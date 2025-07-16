import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertComicSchema, 
  insertPanelSchema,
  comicGenerationSchema,
  panelGenerationSchema,
  animeGenerationSchema,
  creditPurchaseSchema,
  styleRecommendationSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcryptjs";
import openai from "./openai";
import session from "express-session";
import MemoryStore from "memorystore";
import Stripe from "stripe";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Stripe
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  // Set up session middleware
  const MemoryStoreSession = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "comic-ai-secret-key-for-session-management",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: false, // Set to false for development, will be true in production
        httpOnly: true,
        sameSite: 'lax'
      },
    })
  );

  // Authentication middleware
  const authenticate = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Health check route
  app.get("/api/health", (_, res) => {
    res.json({ status: "ok" });
  });

  // User routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Additional validation for empty/invalid fields
      if (!userData.username || userData.username.trim().length === 0) {
        return res.status(400).json({ message: "Username is required and cannot be empty" });
      }
      
      if (!userData.email || !userData.email.includes("@") || userData.email.trim().length === 0) {
        return res.status(400).json({ message: "Valid email address is required" });
      }
      
      if (!userData.password || userData.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session and save it
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Failed to create session" });
        }
        
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to log in" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", authenticate, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Comic routes
  app.get("/api/comics", async (_, res) => {
    try {
      const comics = await storage.getPublishedComics();
      res.json(comics);
    } catch (err) {
      res.status(500).json({ message: "Failed to get comics" });
    }
  });

  app.get("/api/comics/:id", async (req, res) => {
    try {
      const comic = await storage.getComic(parseInt(req.params.id));
      if (!comic) {
        return res.status(404).json({ message: "Comic not found" });
      }
      
      const panels = await storage.getPanelsByComic(comic.id);
      res.json({ ...comic, panels });
    } catch (err) {
      res.status(500).json({ message: "Failed to get comic" });
    }
  });

  app.post("/api/comics", authenticate, async (req, res) => {
    try {
      const comicData = insertComicSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      
      const comic = await storage.createComic(comicData);
      
      // Record style usage for recommendations
      await recordStyleUsage(req.session.userId!, comicData.artStyle);
      
      res.status(201).json(comic);
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create comic" });
    }
  });

  app.put("/api/comics/:id", authenticate, async (req, res) => {
    try {
      const comicId = parseInt(req.params.id);
      const existingComic = await storage.getComic(comicId);
      
      if (!existingComic) {
        return res.status(404).json({ message: "Comic not found" });
      }
      
      // Check if user owns this comic
      if (existingComic.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized to update this comic" });
      }
      
      const comicData = req.body;
      const updatedComic = await storage.updateComic(comicId, comicData);
      res.json(updatedComic);
    } catch (err) {
      res.status(500).json({ message: "Failed to update comic" });
    }
  });

  app.delete("/api/comics/:id", authenticate, async (req, res) => {
    try {
      const comicId = parseInt(req.params.id);
      const existingComic = await storage.getComic(comicId);
      
      if (!existingComic) {
        return res.status(404).json({ message: "Comic not found" });
      }
      
      // Check if user owns this comic
      if (existingComic.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized to delete this comic" });
      }
      
      await storage.deleteComic(comicId);
      res.json({ message: "Comic deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete comic" });
    }
  });

  app.get("/api/comics/user/me", authenticate, async (req, res) => {
    try {
      const comics = await storage.getComicsByUser(req.session.userId!);
      res.json(comics);
    } catch (err) {
      res.status(500).json({ message: "Failed to get user comics" });
    }
  });

  // Panel routes
  app.get("/api/panels/comic/:comicId", async (req, res) => {
    try {
      const comicId = parseInt(req.params.comicId);
      const panels = await storage.getPanelsByComic(comicId);
      res.json(panels);
    } catch (err) {
      res.status(500).json({ message: "Failed to get panels" });
    }
  });

  app.post("/api/panels", authenticate, async (req, res) => {
    try {
      const panelData = insertPanelSchema.parse(req.body);
      
      // Verify that comic exists and user owns it
      const comic = await storage.getComic(panelData.comicId);
      if (!comic) {
        return res.status(404).json({ message: "Comic not found" });
      }
      
      if (comic.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized to add panels to this comic" });
      }
      
      const panel = await storage.createPanel(panelData);
      res.status(201).json(panel);
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create panel" });
    }
  });

  app.put("/api/panels/:id", authenticate, async (req, res) => {
    try {
      const panelId = parseInt(req.params.id);
      const panel = await storage.getPanel(panelId);
      
      if (!panel) {
        return res.status(404).json({ message: "Panel not found" });
      }
      
      // Check if user owns the comic this panel belongs to
      const comic = await storage.getComic(panel.comicId);
      if (!comic || comic.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized to update this panel" });
      }
      
      const updatedPanel = await storage.updatePanel(panelId, req.body);
      res.json(updatedPanel);
    } catch (err) {
      res.status(500).json({ message: "Failed to update panel" });
    }
  });

  app.delete("/api/panels/:id", authenticate, async (req, res) => {
    try {
      const panelId = parseInt(req.params.id);
      const panel = await storage.getPanel(panelId);
      
      if (!panel) {
        return res.status(404).json({ message: "Panel not found" });
      }
      
      // Check if user owns the comic this panel belongs to
      const comic = await storage.getComic(panel.comicId);
      if (!comic || comic.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized to delete this panel" });
      }
      
      await storage.deletePanel(panelId);
      res.json({ message: "Panel deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete panel" });
    }
  });

  // Art style routes
  app.get("/api/art-styles", async (_, res) => {
    try {
      const artStyles = await storage.getAllArtStyles();
      res.json(artStyles);
    } catch (err) {
      res.status(500).json({ message: "Failed to get art styles" });
    }
  });

  // Remove old route - replaced with the new one below

  app.post("/api/generate/panel", authenticate, async (req, res) => {
    try {
      const panelRequest = panelGenerationSchema.parse(req.body);
      
      // Check and deduct credits (2 credits per panel)
      const creditsDeducted = await checkAndDeductCredits(req.session.userId!, 2, "Panel generation", panelRequest.comicId);
      if (!creditsDeducted) {
        return res.status(402).json({ 
          message: "Insufficient credits", 
          required: 2,
          action: "upgrade_or_purchase"
        });
      }
      
      // Verify that comic exists and user owns it
      const comic = await storage.getComic(panelRequest.comicId);
      if (!comic) {
        return res.status(404).json({ message: "Comic not found" });
      }
      
      if (comic.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized to generate panels for this comic" });
      }
      
      // Check if panel exists
      const existingPanels = await storage.getPanelsByComic(panelRequest.comicId);
      const panelExists = existingPanels.some(p => p.sequence === panelRequest.sequence);
      
      // Generate panel image
      let imageUrl;
      try {
        imageUrl = await openai.generateComicPanel(panelRequest);
      } catch (openaiError) {
        // Fallback when OpenAI is not available
        console.log("OpenAI API not available, using fallback panel generation");
        imageUrl = `https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80&text=${encodeURIComponent(panelRequest.description)}`;
      }
      
      let panel;
      if (panelExists) {
        // Update existing panel
        const existingPanel = existingPanels.find(p => p.sequence === panelRequest.sequence);
        panel = await storage.updatePanel(existingPanel!.id, {
          ...panelRequest,
          imageUrl
        });
      } else {
        // Create new panel
        panel = await storage.createPanel({
          ...panelRequest,
          imageUrl
        });
      }
      
      res.json(panel);
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error generating panel:", err);
      res.status(500).json({ message: "Failed to generate panel" });
    }
  });

  app.post("/api/generate/character", authenticate, async (req, res) => {
    try {
      const { name, description } = req.body;
      
      if (!name || !description) {
        return res.status(400).json({ message: "Name and description are required" });
      }
      
      try {
        const characterDetails = await openai.generateCharacterDetails(name, description);
        res.json(characterDetails);
      } catch (openaiError) {
        // Fallback response when OpenAI is not available
        console.log("OpenAI API not available, using fallback character generation");
        res.json({
          fullDescription: `${name} is ${description}. This character has a unique personality and distinctive appearance that makes them memorable in any comic story.`,
          traits: ["brave", "determined", "creative"],
          background: `${name} comes from an interesting background that shaped their character. Their experiences have made them who they are today, ready for new adventures.`
        });
      }
    } catch (err) {
      console.error("Error generating character details:", err);
      res.status(500).json({ message: "Failed to generate character details" });
    }
  });

  // Anime generation routes
  app.post("/api/generate/anime", authenticate, async (req, res) => {
    try {
      const animeRequest = animeGenerationSchema.parse(req.body);
      
      // Check and deduct credits (10 credits for anime generation)
      const creditsDeducted = await checkAndDeductCredits(req.session.userId!, 10, "Anime generation");
      if (!creditsDeducted) {
        return res.status(402).json({ 
          message: "Insufficient credits", 
          required: 10,
          action: "upgrade_or_purchase"
        });
      }
      
      // Generate anime using OpenAI
      const animeResult = await openai.generateAnime(animeRequest);
      
      // Create a new anime comic
      const comic = await storage.createComic({
        title: animeRequest.title,
        description: animeRequest.description || animeResult.description,
        userId: req.session.userId!,
        artStyle: animeRequest.artStyle,
        contentType: "anime",
        animationStyle: animeRequest.animationStyle,
        frameRate: animeRequest.frameRate,
        duration: animeRequest.duration,
        coverImage: animeResult.coverImage || "",
        price: "",
        isPublished: false,
        isForSale: false,
      });
      
      // Create panels/frames from scenes
      const panelPromises = animeResult.frames.map(async (frame, index) => {
        return storage.createPanel({
          comicId: comic.id,
          sequence: index + 1,
          imageUrl: frame.imageUrl,
          videoUrl: frame.videoUrl,
          animationData: frame.animationData,
          duration: frame.duration,
          characters: frame.characters,
          dialogues: frame.dialogues,
          voiceOvers: frame.voiceOvers,
          layout: "anime",
          panelType: frame.type,
        });
      });
      
      const panels = await Promise.all(panelPromises);
      
      res.status(201).json({
        comicId: comic.id,
        title: comic.title,
        description: comic.description,
        contentType: "anime",
        frameCount: panels.length,
        duration: animeRequest.duration,
        panels: panels.map(panel => ({
          id: panel.id,
          sequence: panel.sequence,
          imageUrl: panel.imageUrl,
          videoUrl: panel.videoUrl,
          duration: panel.duration,
          panelType: panel.panelType
        }))
      });
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error generating anime:", err);
      res.status(500).json({ message: "Failed to generate anime" });
    }
  });

  app.post("/api/generate/anime-frame", authenticate, async (req, res) => {
    try {
      const frameRequest = {
        comicId: req.body.comicId,
        sequence: req.body.sequence,
        description: req.body.description,
        artStyle: req.body.artStyle,
        animationStyle: req.body.animationStyle,
        characters: req.body.characters,
        dialogues: req.body.dialogues,
        duration: req.body.duration || 1000,
        frameType: req.body.frameType || "static"
      };
      
      // Check and deduct credits (3 credits per anime frame)
      const creditsDeducted = await checkAndDeductCredits(req.session.userId!, 3, "Anime frame generation", frameRequest.comicId);
      if (!creditsDeducted) {
        return res.status(402).json({ 
          message: "Insufficient credits", 
          required: 3,
          action: "upgrade_or_purchase"
        });
      }
      
      // Verify that comic exists and user owns it
      const comic = await storage.getComic(frameRequest.comicId);
      if (!comic) {
        return res.status(404).json({ message: "Comic not found" });
      }
      
      if (comic.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized to generate frames for this anime" });
      }
      
      // Generate anime frame
      const frameResult = await openai.generateAnimeFrame(frameRequest);
      
      // Check if panel exists
      const existingPanels = await storage.getPanelsByComic(frameRequest.comicId);
      const panelExists = existingPanels.some(p => p.sequence === frameRequest.sequence);
      
      let panel;
      if (panelExists) {
        // Update existing panel
        const existingPanel = existingPanels.find(p => p.sequence === frameRequest.sequence);
        panel = await storage.updatePanel(existingPanel!.id, {
          imageUrl: frameResult.imageUrl,
          videoUrl: frameResult.videoUrl,
          animationData: frameResult.animationData,
          duration: frameRequest.duration,
          characters: frameRequest.characters,
          dialogues: frameRequest.dialogues,
          voiceOvers: frameResult.voiceOvers,
          panelType: frameRequest.frameType
        });
      } else {
        // Create new panel
        panel = await storage.createPanel({
          comicId: frameRequest.comicId,
          sequence: frameRequest.sequence,
          imageUrl: frameResult.imageUrl,
          videoUrl: frameResult.videoUrl,
          animationData: frameResult.animationData,
          duration: frameRequest.duration,
          characters: frameRequest.characters,
          dialogues: frameRequest.dialogues,
          voiceOvers: frameResult.voiceOvers,
          layout: "anime",
          panelType: frameRequest.frameType
        });
      }
      
      res.json(panel);
    } catch (err) {
      console.error("Error generating anime frame:", err);
      res.status(500).json({ message: "Failed to generate anime frame" });
    }
  });

  // Credit management routes
  app.get("/api/credits/balance", authenticate, async (req, res) => {
    try {
      const credits = await storage.getUserCredits(req.session.userId!);
      const user = await storage.getUser(req.session.userId!);
      res.json({ 
        credits, 
        subscriptionTier: user?.subscriptionTier || "free",
        subscriptionStatus: user?.subscriptionStatus || "active"
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to get credit balance" });
    }
  });

  app.get("/api/credits/transactions", authenticate, async (req, res) => {
    try {
      const transactions = await storage.getCreditTransactions(req.session.userId!);
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ message: "Failed to get credit transactions" });
    }
  });

  // Subscription plans routes
  app.get("/api/subscription/plans", async (_, res) => {
    try {
      const plans = await storage.getAllSubscriptionPlans();
      res.json(plans);
    } catch (err) {
      res.status(500).json({ message: "Failed to get subscription plans" });
    }
  });

  // Credit purchase route
  app.post("/api/credits/purchase", authenticate, async (req, res) => {
    try {
      const purchaseRequest = creditPurchaseSchema.parse(req.body);
      
      // Credit pricing: $0.10 per credit (10 cents)
      const pricePerCredit = 10; // in cents
      const totalAmount = purchaseRequest.creditAmount * pricePerCredit;
      
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: "usd",
        metadata: {
          userId: req.session.userId!.toString(),
          creditAmount: purchaseRequest.creditAmount.toString(),
          type: "credit_purchase"
        }
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        amount: totalAmount,
        credits: purchaseRequest.creditAmount
      });
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating credit purchase:", err);
      res.status(500).json({ message: "Failed to create credit purchase" });
    }
  });

  // Subscription purchase route
  app.post("/api/subscription/purchase", authenticate, async (req, res) => {
    try {
      const { planTier, billingCycle } = req.body; // "monthly", "yearly", "lifetime"
      
      const plan = await storage.getSubscriptionPlan(planTier);
      if (!plan) {
        return res.status(404).json({ message: "Subscription plan not found" });
      }
      
      let amount = 0;
      if (billingCycle === "monthly" && plan.priceMonthly) {
        amount = plan.priceMonthly;
      } else if (billingCycle === "yearly" && plan.priceYearly) {
        amount = plan.priceYearly;
      } else if (billingCycle === "lifetime" && plan.priceLifetime) {
        amount = plan.priceLifetime;
      } else {
        return res.status(400).json({ message: "Invalid billing cycle for this plan" });
      }
      
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: {
          userId: req.session.userId!.toString(),
          planTier,
          billingCycle,
          type: "subscription_purchase"
        }
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        amount,
        planTier,
        billingCycle
      });
    } catch (err) {
      console.error("Error creating subscription purchase:", err);
      res.status(500).json({ message: "Failed to create subscription purchase" });
    }
  });

  // Stripe webhook to handle successful payments
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      // In production, you'd verify the webhook signature
      const { type, data } = req.body;
      
      if (type === "payment_intent.succeeded") {
        const paymentIntent = data.object;
        const { userId, creditAmount, planTier, billingCycle, type: purchaseType } = paymentIntent.metadata;
        
        if (purchaseType === "credit_purchase") {
          // Add credits to user account
          await storage.addCredits(
            parseInt(userId),
            parseInt(creditAmount),
            `Purchased ${creditAmount} credits`,
            paymentIntent.id
          );
        } else if (purchaseType === "subscription_purchase") {
          // Update user subscription
          const expiresAt = billingCycle === "lifetime" ? undefined : 
            billingCycle === "yearly" ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) :
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            
          await storage.updateUserSubscription(parseInt(userId), planTier, expiresAt);
          
          // Reset credits based on new plan
          await storage.resetMonthlyCredits(parseInt(userId));
        }
      }
      
      res.json({ received: true });
    } catch (err) {
      console.error("Error processing webhook:", err);
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });

  // Style recommendation routes
  app.post("/api/styles/recommend", authenticate, async (req, res) => {
    try {
      const recommendationRequest = styleRecommendationSchema.parse(req.body);
      
      // Create request hash for caching
      const requestHash = crypto.createHash('md5').update(JSON.stringify(recommendationRequest)).digest('hex');
      
      // Check cache first
      const cached = await storage.getCachedRecommendations(req.session.userId!, requestHash);
      if (cached) {
        return res.json({ recommendations: cached.recommendations });
      }
      
      // Get all available art styles
      const availableStyles = await storage.getAllArtStyles();
      
      // Get user's style preferences/history
      const userPreferences = await storage.getStyleUsageStats(req.session.userId!);
      
      // Generate AI-powered recommendations
      let recommendations;
      try {
        console.log("Calling OpenAI for style recommendations...");
        recommendations = await openai.generateStyleRecommendations(
          recommendationRequest,
          availableStyles,
          userPreferences
        );
        console.log("OpenAI style recommendations generated successfully:", recommendations.length);
      } catch (openaiError) {
        console.error("OpenAI style recommendations error:", openaiError);
        console.log("Using fallback style recommendations");
        // Fallback to enhanced style recommendations when OpenAI is not available
        recommendations = availableStyles
          .slice(0, 3)
          .map(style => ({
            styleId: style.id,
            styleName: style.name,
            confidence: 0.8,
            reasoning: `${style.name} style is perfect for your ${recommendationRequest.contentType} project${recommendationRequest.genre ? ` in the ${recommendationRequest.genre} genre` : ''}${recommendationRequest.mood ? ` with a ${recommendationRequest.mood} mood` : ''}. This style offers great visual appeal and storytelling potential.`
          }));
      }
      
      // Cache the recommendations
      await storage.cacheRecommendations(req.session.userId!, requestHash, recommendations);
      
      res.json({ recommendations });
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error generating style recommendations:", err);
      res.status(500).json({ message: "Failed to generate style recommendations" });
    }
  });

  // Get user's style preferences and usage stats
  app.get("/api/styles/preferences", authenticate, async (req, res) => {
    try {
      const preferences = await storage.getUserStylePreferences(req.session.userId!);
      const stats = await storage.getStyleUsageStats(req.session.userId!);
      
      res.json({ preferences, stats });
    } catch (err) {
      console.error("Error fetching style preferences:", err);
      res.status(500).json({ message: "Failed to fetch style preferences" });
    }
  });

  // Rate an art style
  app.post("/api/styles/:styleId/rate", authenticate, async (req, res) => {
    try {
      const { rating } = req.body;
      const styleId = parseInt(req.params.styleId);
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }
      
      const preference = await storage.rateArtStyle(req.session.userId!, styleId, rating);
      
      if (!preference) {
        return res.status(404).json({ message: "Style preference not found" });
      }
      
      res.json(preference);
    } catch (err) {
      console.error("Error rating art style:", err);
      res.status(500).json({ message: "Failed to rate art style" });
    }
  });

  // Get style trends
  app.get("/api/styles/trends", async (req, res) => {
    try {
      const period = req.query.period as string || 'weekly';
      const trends = await storage.getStyleTrends(period);
      
      res.json({ trends });
    } catch (err) {
      console.error("Error fetching style trends:", err);
      res.status(500).json({ message: "Failed to fetch style trends" });
    }
  });

  // Get personalized style insights
  app.get("/api/styles/insights", authenticate, async (req, res) => {
    try {
      const insights = await storage.getPersonalizedStyleInsights(req.session.userId!);
      
      res.json(insights);
    } catch (err) {
      console.error("Error fetching style insights:", err);
      res.status(500).json({ message: "Failed to fetch style insights" });
    }
  });

  // Get similar users for collaborative filtering
  app.get("/api/styles/similar-users", authenticate, async (req, res) => {
    try {
      const similarUsers = await storage.getSimilarUsers(req.session.userId!);
      
      res.json({ similarUsers });
    } catch (err) {
      console.error("Error fetching similar users:", err);
      res.status(500).json({ message: "Failed to fetch similar users" });
    }
  });

  // Update style trends (admin only)
  app.post("/api/styles/update-trends", authenticate, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      await storage.updateStyleTrends();
      
      res.json({ message: "Style trends updated successfully" });
    } catch (err) {
      console.error("Error updating style trends:", err);
      res.status(500).json({ message: "Failed to update style trends" });
    }
  });

  // Helper function to record style usage for recommendations
  const recordStyleUsage = async (userId: number, styleName: string): Promise<void> => {
    try {
      const allStyles = await storage.getAllArtStyles();
      const style = allStyles.find(s => s.name.toLowerCase() === styleName.toLowerCase());
      if (style) {
        await storage.recordStyleUsage(userId, style.id, ['comic-creation'], 'comic');
      }
    } catch (error) {
      console.error("Error recording style usage:", error);
      // Don't throw - this is a non-critical feature
    }
  };

  // Check if user has enough credits and deduct them for generation
  const checkAndDeductCredits = async (userId: number, requiredCredits: number, description: string, relatedId?: number): Promise<boolean> => {
    const user = await storage.getUser(userId);
    if (!user) return false;
    
    // Lifetime users have unlimited credits
    if (user.subscriptionTier === "lifetime") {
      return true;
    }
    
    // Check if user has enough credits
    if (user.credits < requiredCredits) {
      return false;
    }
    
    // Deduct credits
    return await storage.deductCredits(userId, requiredCredits, description, relatedId);
  };

  // Generation endpoints
  app.post("/api/generate/character", authenticate, async (req, res) => {
    try {
      const { name, description } = req.body;
      
      if (!name || !description) {
        return res.status(400).json({ message: "Name and description are required" });
      }
      
      // Try OpenAI first, fallback if needed
      let characterDetails;
      try {
        characterDetails = await generateCharacterDetails(name, description);
      } catch (error) {
        console.log("OpenAI API not available, using fallback character generation");
        // Fallback enhanced description
        const enhancedDescription = `${description}. This character has distinct personality traits and plays an important role in the story. They have unique visual characteristics that make them memorable and contribute to the overall narrative.`;
        
        characterDetails = {
          fullDescription: enhancedDescription,
          traits: ["brave", "determined", "creative"],
          background: `${name} comes from an interesting background that shaped their character. Their experiences have made them who they are today, ready for new adventures.`
        };
      }
      
      res.json(characterDetails);
    } catch (error: any) {
      console.error("Error generating character:", error);
      res.status(500).json({ message: "Failed to generate character details" });
    }
  });

  app.post("/api/generate/story", authenticate, async (req, res) => {
    try {
      const { title, description, artStyle, characters, panelCount, prompt } = req.body;
      
      if (!title || !prompt) {
        return res.status(400).json({ message: "Title and prompt are required" });
      }

      // Deduct credits first (2 credits for story generation)
      const creditDeducted = await storage.deductCredits(
        req.session.userId!,
        2,
        "Comic story generation"
      );
      
      if (!creditDeducted) {
        return res.status(402).json({ 
          message: "Insufficient credits", 
          required: 2,
          action: "story_generation"
        });
      }

      // Try OpenAI first, fallback if needed
      let story;
      try {
        story = await generateStoryOutline({
          title,
          description: description || "",
          artStyle,
          characters: characters || [],
          panelCount: panelCount || 6,
          prompt
        });
      } catch (error) {
        console.log("OpenAI API not available, using fallback story generation");
        // Fallback story generation
        story = {
          title,
          outline: `${title}: ${prompt}. This exciting story unfolds across ${panelCount || 6} action-packed panels.`,
          panels: Array.from({ length: panelCount || 6 }, (_, i) => ({
            sequence: i + 1,
            description: `Panel ${i + 1}: ${prompt} - Scene ${i + 1}`,
            dialogues: characters?.length > 0 ? [{
              character: characters[0].name,
              text: `${characters[0].name} takes action in this exciting scene!`
            }] : []
          }))
        };
      }

      // Create comic with panels
      const comic = await storage.createComic({
        title,
        description: description || "",
        userId: req.session.userId!,
        artStyle,
        contentType: "comic"
      });

      // Create panels based on generated story
      const panels = [];
      for (const panelData of story.panels) {
        const panel = await storage.createPanel({
          comicId: comic.id,
          sequence: panelData.sequence,
          layout: "standard",
          panelType: "static",
          characters: characters || [],
          dialogues: panelData.dialogues || []
        });
        panels.push(panel);
      }

      res.json({ 
        comicId: comic.id,
        title: story.title,
        outline: story.outline,
        panels: story.panels.map((p, i) => ({
          id: panels[i].id,
          sequence: p.sequence,
          description: p.description,
          dialogues: p.dialogues
        })),
        creditsUsed: 2
      });
    } catch (error: any) {
      console.error("Error generating story:", error);
      res.status(500).json({ message: "Failed to create comic. Please try again." });
    }
  });

  app.post("/api/generate/panel", authenticate, async (req, res) => {
    try {
      const { description, layout, characters, dialogues } = req.body;
      
      if (!description) {
        return res.status(400).json({ message: "Panel description is required" });
      }
      
      // For now, return a placeholder image URL
      const imageUrl = "https://via.placeholder.com/800x600/4f46e5/ffffff?text=Comic+Panel";
      
      res.json({ 
        imageUrl,
        description,
        layout: layout || "standard"
      });
    } catch (error: any) {
      console.error("Error generating panel:", error);
      res.status(500).json({ message: "Failed to generate panel" });
    }
  });

  // Tutorial progress endpoints
  app.get("/api/tutorials/progress", authenticate, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const progress = await storage.getUserTutorialProgress(userId);
      res.json(progress);
    } catch (error: any) {
      console.error("Error fetching tutorial progress:", error);
      res.status(500).json({ message: "Failed to fetch tutorial progress" });
    }
  });

  app.post("/api/tutorials/complete", authenticate, async (req, res) => {
    try {
      const { tutorialId, quizScore } = req.body;
      const userId = req.session.userId!;
      const progress = await storage.markTutorialComplete(userId, tutorialId, quizScore);
      
      // Check for achievements
      const allProgress = await storage.getUserTutorialProgress(userId);
      const completedCount = allProgress.length;
      
      // Award achievements based on completion count
      if (completedCount === 1) {
        await storage.unlockTutorialAchievement(userId, "first_tutorial");
      } else if (completedCount === 3) {
        await storage.unlockTutorialAchievement(userId, "intermediate_learner");
      } else if (completedCount === 6) {
        await storage.unlockTutorialAchievement(userId, "advanced_student");
      } else if (completedCount === 8) {
        await storage.unlockTutorialAchievement(userId, "master_artist");
      }
      
      // Award quiz performance achievements
      if (quizScore === 3) {
        await storage.unlockTutorialAchievement(userId, "perfect_score");
      }
      
      res.json(progress);
    } catch (error: any) {
      console.error("Error completing tutorial:", error);
      res.status(500).json({ message: "Failed to complete tutorial" });
    }
  });

  app.get("/api/tutorials/achievements", authenticate, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const achievements = await storage.getUserTutorialAchievements(userId);
      res.json(achievements);
    } catch (error: any) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
