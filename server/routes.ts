import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertComicSchema, 
  insertPanelSchema,
  comicGenerationSchema,
  panelGenerationSchema,
  animeGenerationSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcryptjs";
import openai from "./openai";
import session from "express-session";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  const MemoryStoreSession = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "comic-ai-secret",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: process.env.NODE_ENV === "production",
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
      
      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
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

  // AI generation routes
  app.post("/api/generate/story", authenticate, async (req, res) => {
    try {
      const generationRequest = comicGenerationSchema.parse(req.body);
      
      // Generate story outline using OpenAI
      const storyOutline = await openai.generateStoryOutline(generationRequest);
      
      // Create a new comic
      const comic = await storage.createComic({
        title: generationRequest.title,
        description: generationRequest.description || storyOutline.outline,
        userId: req.session.userId!,
        artStyle: generationRequest.artStyle,
        coverImage: "",
        price: "",
        isPublished: false,
        isForSale: false,
      });
      
      // Create panels from scenes
      const panelPromises = storyOutline.scenes.map(async (scene, index) => {
        return storage.createPanel({
          comicId: comic.id,
          sequence: index + 1,
          imageUrl: "", // Will be generated later
          characters: generationRequest.characters,
          dialogues: scene.dialogues || [],
          layout: "standard", // Default layout
        });
      });
      
      const panels = await Promise.all(panelPromises);
      
      res.status(201).json({
        comicId: comic.id,
        title: comic.title,
        outline: storyOutline.outline,
        panels: panels.map(panel => ({
          id: panel.id,
          sequence: panel.sequence,
          description: storyOutline.scenes[panel.sequence - 1].description,
          dialogues: storyOutline.scenes[panel.sequence - 1].dialogues || []
        }))
      });
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error generating story:", err);
      res.status(500).json({ message: "Failed to generate story" });
    }
  });

  app.post("/api/generate/panel", authenticate, async (req, res) => {
    try {
      const panelRequest = panelGenerationSchema.parse(req.body);
      
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
      const imageUrl = await openai.generateComicPanel(panelRequest);
      
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
      
      const characterDetails = await openai.generateCharacterDetails(name, description);
      res.json(characterDetails);
    } catch (err) {
      console.error("Error generating character details:", err);
      res.status(500).json({ message: "Failed to generate character details" });
    }
  });

  // Anime generation routes
  app.post("/api/generate/anime", authenticate, async (req, res) => {
    try {
      const animeRequest = animeGenerationSchema.parse(req.body);
      
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

  const httpServer = createServer(app);
  return httpServer;
}
