import { 
  users, comics, panels, artStyles, creditTransactions, subscriptionPlans,
  type User, type InsertUser, 
  type Comic, type InsertComic, 
  type Panel, type InsertPanel, 
  type ArtStyle, type InsertArtStyle,
  type CreditTransaction, type InsertCreditTransaction,
  type SubscriptionPlan, type InsertSubscriptionPlan
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Comic operations
  getComic(id: number): Promise<Comic | undefined>;
  getComicsByUser(userId: number): Promise<Comic[]>;
  getPublishedComics(): Promise<Comic[]>;
  createComic(comic: InsertComic): Promise<Comic>;
  updateComic(id: number, comic: Partial<InsertComic>): Promise<Comic | undefined>;
  deleteComic(id: number): Promise<boolean>;
  
  // Panel operations
  getPanel(id: number): Promise<Panel | undefined>;
  getPanelsByComic(comicId: number): Promise<Panel[]>;
  createPanel(panel: InsertPanel): Promise<Panel>;
  updatePanel(id: number, panel: Partial<InsertPanel>): Promise<Panel | undefined>;
  deletePanel(id: number): Promise<boolean>;
  
  // Art style operations
  getAllArtStyles(): Promise<ArtStyle[]>;
  getArtStyle(id: number): Promise<ArtStyle | undefined>;
  createArtStyle(artStyle: InsertArtStyle): Promise<ArtStyle>;

  // Credit operations
  getUserCredits(userId: number): Promise<number>;
  updateUserCredits(userId: number, credits: number): Promise<User | undefined>;
  deductCredits(userId: number, amount: number, description: string, relatedId?: number): Promise<boolean>;
  addCredits(userId: number, amount: number, description: string, stripePaymentIntentId?: string): Promise<boolean>;
  createCreditTransaction(transaction: any): Promise<any>;
  getCreditTransactions(userId: number): Promise<any[]>;
  
  // Subscription operations
  updateUserSubscription(userId: number, tier: string, expiresAt?: Date): Promise<User | undefined>;
  getAllSubscriptionPlans(): Promise<any[]>;
  getSubscriptionPlan(tier: string): Promise<any | undefined>;
  resetMonthlyCredits(userId: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private comics: Map<number, Comic>;
  private panels: Map<number, Panel>;
  private artStyles: Map<number, ArtStyle>;
  private userIdCounter: number;
  private comicIdCounter: number;
  private panelIdCounter: number;
  private artStyleIdCounter: number;

  constructor() {
    this.users = new Map();
    this.comics = new Map();
    this.panels = new Map();
    this.artStyles = new Map();
    this.userIdCounter = 1;
    this.comicIdCounter = 1;
    this.panelIdCounter = 1;
    this.artStyleIdCounter = 1;
    
    // Initialize with some art styles
    this.initArtStyles();
  }

  private initArtStyles() {
    const styles: InsertArtStyle[] = [
      {
        name: "Superhero",
        description: "Bold, colorful, dynamic action",
        thumbnailUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Manga",
        description: "Japanese-inspired black & white",
        thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Indie",
        description: "Artistic, hand-crafted feel",
        thumbnailUrl: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "European",
        description: "Clear lines, detailed environments",
        thumbnailUrl: "https://pixabay.com/get/gae692731f22ff761143137310e935838330a4a98e6ed2d361f186e44a974515c0d5aa0bc95583f6d0ae6d169e9348daf1bf7ae5207d3663eeb20351282e35585_1280.jpg"
      },
      {
        name: "Retro",
        description: "Vintage feel with halftones",
        thumbnailUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Cartoon",
        description: "Fun, simplified character designs",
        thumbnailUrl: "https://pixabay.com/get/gb6d99661f09cd9540b0af1d8c497c8823186989c9406718b8f1c074437a2517023ee9e985333d83e75976dbaa742321ea46f4c0a4ea448fd62090b56a43f2e01_1280.jpg"
      },
      {
        name: "Noir",
        description: "High contrast, moody shadows",
        thumbnailUrl: "https://images.unsplash.com/photo-1519638399535-1b036603ac77?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      }
    ];

    styles.forEach(style => this.createArtStyle(style));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...userData, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Comic methods
  async getComic(id: number): Promise<Comic | undefined> {
    return this.comics.get(id);
  }

  async getComicsByUser(userId: number): Promise<Comic[]> {
    return Array.from(this.comics.values()).filter(
      (comic) => comic.userId === userId
    );
  }

  async getPublishedComics(): Promise<Comic[]> {
    return Array.from(this.comics.values()).filter(
      (comic) => comic.isPublished && comic.isForSale
    );
  }

  async createComic(comicData: InsertComic): Promise<Comic> {
    const id = this.comicIdCounter++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const comic: Comic = { ...comicData, id, createdAt, updatedAt };
    this.comics.set(id, comic);
    return comic;
  }

  async updateComic(id: number, comicData: Partial<InsertComic>): Promise<Comic | undefined> {
    const existingComic = this.comics.get(id);
    if (!existingComic) return undefined;

    const updatedComic: Comic = {
      ...existingComic,
      ...comicData,
      updatedAt: new Date()
    };
    this.comics.set(id, updatedComic);
    return updatedComic;
  }

  async deleteComic(id: number): Promise<boolean> {
    // Delete associated panels first
    const panelsToDelete = await this.getPanelsByComic(id);
    for (const panel of panelsToDelete) {
      await this.deletePanel(panel.id);
    }
    return this.comics.delete(id);
  }

  // Panel methods
  async getPanel(id: number): Promise<Panel | undefined> {
    return this.panels.get(id);
  }

  async getPanelsByComic(comicId: number): Promise<Panel[]> {
    return Array.from(this.panels.values())
      .filter((panel) => panel.comicId === comicId)
      .sort((a, b) => a.sequence - b.sequence);
  }

  async createPanel(panelData: InsertPanel): Promise<Panel> {
    const id = this.panelIdCounter++;
    const createdAt = new Date();
    const panel: Panel = { ...panelData, id, createdAt };
    this.panels.set(id, panel);
    return panel;
  }

  async updatePanel(id: number, panelData: Partial<InsertPanel>): Promise<Panel | undefined> {
    const existingPanel = this.panels.get(id);
    if (!existingPanel) return undefined;

    const updatedPanel: Panel = {
      ...existingPanel,
      ...panelData,
    };
    this.panels.set(id, updatedPanel);
    return updatedPanel;
  }

  async deletePanel(id: number): Promise<boolean> {
    return this.panels.delete(id);
  }

  // Art style methods
  async getAllArtStyles(): Promise<ArtStyle[]> {
    return Array.from(this.artStyles.values());
  }

  async getArtStyle(id: number): Promise<ArtStyle | undefined> {
    return this.artStyles.get(id);
  }

  async createArtStyle(artStyleData: InsertArtStyle): Promise<ArtStyle> {
    const id = this.artStyleIdCounter++;
    const artStyle: ArtStyle = { ...artStyleData, id };
    this.artStyles.set(id, artStyle);
    return artStyle;
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getComic(id: number): Promise<Comic | undefined> {
    const [comic] = await db.select().from(comics).where(eq(comics.id, id));
    return comic || undefined;
  }

  async getComicsByUser(userId: number): Promise<Comic[]> {
    return await db.select().from(comics).where(eq(comics.userId, userId));
  }

  async getPublishedComics(): Promise<Comic[]> {
    return await db.select().from(comics).where(eq(comics.isPublished, true));
  }

  async createComic(insertComic: InsertComic): Promise<Comic> {
    const [comic] = await db
      .insert(comics)
      .values(insertComic)
      .returning();
    return comic;
  }

  async updateComic(id: number, comicData: Partial<InsertComic>): Promise<Comic | undefined> {
    const [updatedComic] = await db
      .update(comics)
      .set({ ...comicData, updatedAt: new Date() })
      .where(eq(comics.id, id))
      .returning();
    return updatedComic || undefined;
  }

  async deleteComic(id: number): Promise<boolean> {
    // First delete all panels associated with this comic
    await db.delete(panels).where(eq(panels.comicId, id));
    // Then delete the comic
    const result = await db.delete(comics).where(eq(comics.id, id));
    return result.rowCount > 0;
  }

  async getPanel(id: number): Promise<Panel | undefined> {
    const [panel] = await db.select().from(panels).where(eq(panels.id, id));
    return panel || undefined;
  }

  async getPanelsByComic(comicId: number): Promise<Panel[]> {
    return await db
      .select()
      .from(panels)
      .where(eq(panels.comicId, comicId))
      .orderBy(panels.sequence);
  }

  async createPanel(insertPanel: InsertPanel): Promise<Panel> {
    const [panel] = await db
      .insert(panels)
      .values(insertPanel)
      .returning();
    return panel;
  }

  async updatePanel(id: number, panelData: Partial<InsertPanel>): Promise<Panel | undefined> {
    const [updatedPanel] = await db
      .update(panels)
      .set(panelData)
      .where(eq(panels.id, id))
      .returning();
    return updatedPanel || undefined;
  }

  async deletePanel(id: number): Promise<boolean> {
    const result = await db.delete(panels).where(eq(panels.id, id));
    return result.rowCount > 0;
  }

  async getAllArtStyles(): Promise<ArtStyle[]> {
    return await db.select().from(artStyles);
  }

  async getArtStyle(id: number): Promise<ArtStyle | undefined> {
    const [artStyle] = await db.select().from(artStyles).where(eq(artStyles.id, id));
    return artStyle || undefined;
  }

  async createArtStyle(insertArtStyle: InsertArtStyle): Promise<ArtStyle> {
    const [artStyle] = await db
      .insert(artStyles)
      .values(insertArtStyle)
      .returning();
    return artStyle;
  }

  // Credit operations
  async getUserCredits(userId: number): Promise<number> {
    const [user] = await db.select({ credits: users.credits }).from(users).where(eq(users.id, userId));
    return user?.credits || 0;
  }

  async updateUserCredits(userId: number, credits: number): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ credits })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser || undefined;
  }

  async deductCredits(userId: number, amount: number, description: string, relatedId?: number): Promise<boolean> {
    try {
      // Start transaction
      const user = await this.getUser(userId);
      if (!user || user.credits < amount) {
        return false;
      }

      // Deduct credits
      const newCredits = user.credits - amount;
      await this.updateUserCredits(userId, newCredits);

      // Record transaction
      await db.insert(creditTransactions).values({
        userId,
        type: "used",
        amount: -amount,
        description,
        relatedId,
      });

      // Update total credits used
      await db
        .update(users)
        .set({ totalCreditsUsed: user.totalCreditsUsed + amount })
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error("Error deducting credits:", error);
      return false;
    }
  }

  async addCredits(userId: number, amount: number, description: string, stripePaymentIntentId?: string): Promise<boolean> {
    try {
      const user = await this.getUser(userId);
      if (!user) return false;

      // Add credits
      const newCredits = user.credits + amount;
      await this.updateUserCredits(userId, newCredits);

      // Record transaction
      await db.insert(creditTransactions).values({
        userId,
        type: "purchased",
        amount,
        description,
        stripePaymentIntentId,
      });

      return true;
    } catch (error) {
      console.error("Error adding credits:", error);
      return false;
    }
  }

  async createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction> {
    const [creditTransaction] = await db
      .insert(creditTransactions)
      .values(transaction)
      .returning();
    return creditTransaction;
  }

  async getCreditTransactions(userId: number): Promise<CreditTransaction[]> {
    return await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt));
  }

  // Subscription operations
  async updateUserSubscription(userId: number, tier: string, expiresAt?: Date): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        subscriptionTier: tier,
        subscriptionExpiresAt: expiresAt,
        subscriptionStatus: "active"
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser || undefined;
  }

  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
  }

  async getSubscriptionPlan(tier: string): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.tier, tier));
    return plan || undefined;
  }

  async resetMonthlyCredits(userId: number): Promise<boolean> {
    try {
      const user = await this.getUser(userId);
      if (!user) return false;

      const plan = await this.getSubscriptionPlan(user.subscriptionTier);
      if (!plan) return false;

      // Reset credits based on subscription plan
      await db
        .update(users)
        .set({ 
          credits: plan.monthlyCredits,
          lastCreditReset: new Date()
        })
        .where(eq(users.id, userId));

      // Record transaction
      await db.insert(creditTransactions).values({
        userId,
        type: "monthly_reset",
        amount: plan.monthlyCredits,
        description: `Monthly credit reset for ${plan.name} plan`,
      });

      return true;
    } catch (error) {
      console.error("Error resetting monthly credits:", error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
