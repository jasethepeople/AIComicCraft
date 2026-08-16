import { db } from "./db";
import { artStyles, subscriptionPlans, type InsertArtStyle, type InsertSubscriptionPlan } from "@shared/schema";
import { eq } from "drizzle-orm";
import { ensureSrfStorage } from "./srf/repository";

// Initialize database with art styles and subscription plans if they don't exist
export async function initializeDatabase() {
  try {
    await ensureSrfStorage();

    // Check if art styles already exist
    const existingStyles = await db.select().from(artStyles).limit(1);
    const existingPlans = await db.select().from(subscriptionPlans).limit(1);
    
    if (existingStyles.length > 0 && existingPlans.length > 0) {
      console.log("Database already initialized with art styles and subscription plans");
      return;
    }

    // Insert initial art styles including anime styles
    const styles: InsertArtStyle[] = [
      // Comic styles
      {
        name: "Superhero",
        description: "Bold, colorful, dynamic action with muscular heroes",
        thumbnailUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Manga",
        description: "Japanese-inspired black & white with expressive characters",
        thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Indie",
        description: "Artistic, hand-crafted feel with unique perspectives",
        thumbnailUrl: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "European",
        description: "Clear lines, detailed environments, realistic proportions",
        thumbnailUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Retro",
        description: "Vintage feel with halftones and classic comic book style",
        thumbnailUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Cartoon",
        description: "Fun, simplified character designs with bright colors",
        thumbnailUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Noir",
        description: "High contrast, moody shadows, detective atmosphere",
        thumbnailUrl: "https://images.unsplash.com/photo-1519638399535-1b036603ac77?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      
      // Anime styles
      {
        name: "Studio Ghibli",
        description: "Whimsical, detailed environments with magical realism",
        thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Shonen Anime",
        description: "Dynamic action, spiky hair, power-up transformations",
        thumbnailUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Slice of Life",
        description: "Soft colors, everyday settings, gentle character expressions",
        thumbnailUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Mecha Anime",
        description: "Futuristic robots, metallic textures, epic battles",
        thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Chibi Style",
        description: "Super cute, oversized heads, minimalist expressions",
        thumbnailUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Dark Anime",
        description: "Gothic atmosphere, complex emotions, mature themes",
        thumbnailUrl: "https://images.unsplash.com/photo-1519638399535-1b036603ac77?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Kawaii Anime",
        description: "Pastel colors, sparkles, adorable characters",
        thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Traditional Japanese",
        description: "Classic art style with ink wash techniques",
        thumbnailUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      }
    ];

    // Insert art styles if they don't exist
    if (existingStyles.length === 0) {
      const insertedStyles = await db.insert(artStyles).values(styles).returning();
      console.log(`Initialized database with ${insertedStyles.length} art styles`);
    }

    // Insert subscription plans if they don't exist
    if (existingPlans.length === 0) {
      const plans: InsertSubscriptionPlan[] = [
        {
          name: "Free",
          tier: "free",
          monthlyCredits: 10,
          priceMonthly: null,
          priceYearly: null,
          priceLifetime: null,
          features: [
            "10 AI generations per month",
            "Basic comic creation",
            "Community access",
            "Standard quality exports"
          ],
          isActive: true
        },
        {
          name: "Basic",
          tier: "basic",
          monthlyCredits: 50,
          priceMonthly: 299, // $2.99
          priceYearly: 2999, // $29.99 (2 months free)
          priceLifetime: null,
          features: [
            "50 credits per month",
            "All art styles",
            "High-resolution exports",
            "Priority generation queue",
            "Email support"
          ],
          isActive: true
        },
        {
          name: "Pro",
          tier: "pro",
          monthlyCredits: 200,
          priceMonthly: 799, // $7.99
          priceYearly: 7999, // $79.99 (2 months free)
          priceLifetime: null,
          features: [
            "200 credits per month",
            "Everything in Basic",
            "Commercial usage rights",
            "Advanced editing tools",
            "Priority support"
          ],
          isActive: true
        },
        {
          name: "Lifetime",
          tier: "lifetime",
          monthlyCredits: 999999, // Unlimited
          priceMonthly: null,
          priceYearly: null,
          priceLifetime: 9999, // $99.99
          features: [
            "Unlimited credits",
            "All Pro features",
            "Lifetime access",
            "No monthly fees",
            "Exclusive content",
            "Early access to new features"
          ],
          isActive: true
        }
      ];

      const insertedPlans = await db.insert(subscriptionPlans).values(plans).returning();
      console.log(`Initialized database with ${insertedPlans.length} subscription plans`);
    }
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}