import { 
  users, comics, panels, artStyles, creditTransactions, subscriptionPlans, userStylePreferences, styleRecommendationCache, styleTrends, tutorialProgress, tutorialAchievements, tutorialStats,
  type User, type InsertUser, 
  type Comic, type InsertComic, 
  type Panel, type InsertPanel, 
  type ArtStyle, type InsertArtStyle,
  type CreditTransaction, type InsertCreditTransaction,
  type SubscriptionPlan, type InsertSubscriptionPlan,
  type UserStylePreference, type InsertUserStylePreference,
  type StyleRecommendationCache, type InsertStyleRecommendationCache,
  type StyleTrend, type InsertStyleTrend,
  type TutorialProgress, type TutorialAchievement, type TutorialStats, type InsertTutorialProgress, type InsertTutorialAchievement
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, gt, gte, ne } from "drizzle-orm";

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
  
  // Style preference operations
  getUserStylePreferences(userId: number): Promise<UserStylePreference[]>;
  recordStyleUsage(userId: number, artStyleId: number, contextTags?: string[], projectType?: string): Promise<UserStylePreference>;
  rateArtStyle(userId: number, artStyleId: number, rating: number): Promise<UserStylePreference | undefined>;
  getStyleUsageStats(userId: number): Promise<Array<{ styleName: string; usageCount: number; rating?: number; artStyleId: number }>>;
  
  // Advanced recommendation features
  getCachedRecommendations(userId: number, requestHash: string): Promise<StyleRecommendationCache | undefined>;
  cacheRecommendations(userId: number, requestHash: string, recommendations: any): Promise<StyleRecommendationCache>;
  getStyleTrends(period?: string): Promise<StyleTrend[]>;
  updateStyleTrends(): Promise<void>;
  getPersonalizedStyleInsights(userId: number): Promise<any>;
  getSimilarUsers(userId: number): Promise<Array<{ userId: number; similarity: number }>>;

  // Tutorial operations
  getUserTutorialProgress(userId: number): Promise<TutorialProgress[]>;
  markTutorialComplete(userId: number, tutorialId: string, quizScore?: number): Promise<TutorialProgress>;
  getUserTutorialAchievements(userId: number): Promise<TutorialAchievement[]>;
  unlockTutorialAchievement(userId: number, achievementId: string): Promise<TutorialAchievement>;
  getTutorialStats(tutorialId?: string): Promise<TutorialStats[]>;
  updateTutorialStats(tutorialId: string, quizScore?: number): Promise<void>;
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
  async getUserStylePreferences(userId: number): Promise<UserStylePreference[]> {
    const preferences = await db
      .select()
      .from(userStylePreferences)
      .where(eq(userStylePreferences.userId, userId))
      .orderBy(desc(userStylePreferences.usageCount));
    return preferences;
  }

  async recordStyleUsage(userId: number, artStyleId: number, contextTags?: string[], projectType?: string): Promise<UserStylePreference> {
    // Check if preference already exists
    const [existingPreference] = await db
      .select()
      .from(userStylePreferences)
      .where(eq(userStylePreferences.userId, userId))
      .where(eq(userStylePreferences.artStyleId, artStyleId));

    if (existingPreference) {
      // Update existing preference
      const [updatedPreference] = await db
        .update(userStylePreferences)
        .set({
          usageCount: existingPreference.usageCount + 1,
          lastUsed: new Date(),
          contextTags: contextTags || existingPreference.contextTags,
          projectType: projectType || existingPreference.projectType,
        })
        .where(eq(userStylePreferences.id, existingPreference.id))
        .returning();
      return updatedPreference;
    } else {
      // Create new preference
      const [newPreference] = await db
        .insert(userStylePreferences)
        .values({
          userId,
          artStyleId,
          usageCount: 1,
          contextTags,
          projectType,
        })
        .returning();
      return newPreference;
    }
  }

  async rateArtStyle(userId: number, artStyleId: number, rating: number): Promise<UserStylePreference | undefined> {
    const [existingPreference] = await db
      .select()
      .from(userStylePreferences)
      .where(eq(userStylePreferences.userId, userId))
      .where(eq(userStylePreferences.artStyleId, artStyleId));

    if (existingPreference) {
      const [updatedPreference] = await db
        .update(userStylePreferences)
        .set({ rating })
        .where(eq(userStylePreferences.id, existingPreference.id))
        .returning();
      return updatedPreference;
    }

    return undefined;
  }

  async getStyleUsageStats(userId: number): Promise<Array<{ styleName: string; usageCount: number; rating?: number; artStyleId: number }>> {
    const stats = await db
      .select({
        styleName: artStyles.name,
        usageCount: userStylePreferences.usageCount,
        rating: userStylePreferences.rating,
        artStyleId: userStylePreferences.artStyleId,
      })
      .from(userStylePreferences)
      .innerJoin(artStyles, eq(userStylePreferences.artStyleId, artStyles.id))
      .where(eq(userStylePreferences.userId, userId))
      .orderBy(desc(userStylePreferences.usageCount));
      
    return stats;
  }

  // Advanced recommendation features
  async getCachedRecommendations(userId: number, requestHash: string): Promise<StyleRecommendationCache | undefined> {
    const [cached] = await db
      .select()
      .from(styleRecommendationCache)
      .where(eq(styleRecommendationCache.userId, userId))
      .where(eq(styleRecommendationCache.requestHash, requestHash))
      .where(gt(styleRecommendationCache.expiresAt, new Date()));
    return cached || undefined;
  }

  async cacheRecommendations(userId: number, requestHash: string, recommendations: any): Promise<StyleRecommendationCache> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Cache for 24 hours

    const [cached] = await db
      .insert(styleRecommendationCache)
      .values({
        userId,
        requestHash,
        recommendations,
        expiresAt,
      })
      .onConflictDoUpdate({
        target: styleRecommendationCache.requestHash,
        set: {
          recommendations,
          expiresAt,
        },
      })
      .returning();
    return cached;
  }

  async getStyleTrends(period: string = 'weekly'): Promise<StyleTrend[]> {
    const trends = await db
      .select()
      .from(styleTrends)
      .where(eq(styleTrends.period, period))
      .orderBy(desc(styleTrends.trendingScore));
    return trends;
  }

  async updateStyleTrends(): Promise<void> {
    // This would typically be run as a background job
    const now = new Date();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Calculate trends for each art style
    const allStyles = await this.getAllArtStyles();
    
    for (const style of allStyles) {
      const recentUsage = await db
        .select()
        .from(userStylePreferences)
        .where(eq(userStylePreferences.artStyleId, style.id))
        .where(gte(userStylePreferences.lastUsed, weekStart));
      
      const usageCount = recentUsage.reduce((sum, pref) => sum + pref.usageCount, 0);
      const averageRating = recentUsage
        .filter(pref => pref.rating !== null)
        .reduce((sum, pref, _, arr) => sum + (pref.rating || 0) / arr.length, 0);
      
      const trendingScore = usageCount * (averageRating || 3) * 10; // Basic trending algorithm
      
      await db
        .insert(styleTrends)
        .values({
          artStyleId: style.id,
          period: 'weekly',
          usageCount,
          averageRating: averageRating.toString(),
          trendingScore: trendingScore.toString(),
          periodStart: weekStart,
          periodEnd: now,
        })
        .onConflictDoNothing();
    }
  }

  async getPersonalizedStyleInsights(userId: number): Promise<any> {
    const preferences = await this.getUserStylePreferences(userId);
    const stats = await this.getStyleUsageStats(userId);
    
    // Calculate insights
    const mostUsedStyle = stats[0];
    const highestRatedStyles = stats.filter(s => s.rating && s.rating >= 4);
    const recentTrends = await this.getStyleTrends('weekly');
    
    return {
      totalStylesUsed: stats.length,
      mostUsedStyle: mostUsedStyle?.styleName,
      highestRatedStyles: highestRatedStyles.map(s => s.styleName),
      recommendedTrendingStyles: recentTrends.slice(0, 3).map(t => ({
        styleId: t.artStyleId,
        trendingScore: t.trendingScore,
      })),
      stylePersonality: this.calculateStylePersonality(stats),
    };
  }

  async getSimilarUsers(userId: number): Promise<Array<{ userId: number; similarity: number }>> {
    // Simplified similarity calculation based on shared style preferences
    const userPrefs = await this.getUserStylePreferences(userId);
    const userStyleIds = new Set(userPrefs.map(p => p.artStyleId));
    
    if (userStyleIds.size === 0) return [];
    
    // Get other users with overlapping style preferences
    const otherUsers = await db
      .select({
        userId: userStylePreferences.userId,
        artStyleId: userStylePreferences.artStyleId,
        rating: userStylePreferences.rating,
      })
      .from(userStylePreferences)
      .where(ne(userStylePreferences.userId, userId));
    
    const userSimilarities = new Map<number, number>();
    
    for (const pref of otherUsers) {
      if (userStyleIds.has(pref.artStyleId)) {
        const currentSimilarity = userSimilarities.get(pref.userId) || 0;
        userSimilarities.set(pref.userId, currentSimilarity + 1);
      }
    }
    
    return Array.from(userSimilarities.entries())
      .map(([userId, overlap]) => ({
        userId,
        similarity: overlap / userStyleIds.size,
      }))
      .filter(u => u.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);
  }

  private calculateStylePersonality(stats: Array<{ styleName: string; usageCount: number; rating?: number }>): string {
    if (stats.length === 0) return "Explorer";
    
    const totalUsage = stats.reduce((sum, s) => sum + s.usageCount, 0);
    const avgRating = stats.reduce((sum, s) => sum + (s.rating || 3), 0) / stats.length;
    const diversity = stats.length;
    
    if (diversity >= 5 && avgRating >= 4) return "Creative Virtuoso";
    if (diversity >= 4) return "Style Explorer";
    if (avgRating >= 4.5) return "Quality Focused";
    if (totalUsage >= 10) return "Prolific Creator";
    return "Rising Artist";
  }
  // Tutorial methods
  async getUserTutorialProgress(userId: number): Promise<TutorialProgress[]> {
    return await db.select().from(tutorialProgress).where(eq(tutorialProgress.userId, userId));
  }

  async markTutorialComplete(userId: number, tutorialId: string, quizScore?: number): Promise<TutorialProgress> {
    const [progress] = await db
      .insert(tutorialProgress)
      .values({
        userId,
        tutorialId,
        quizScore,
        certificateGenerated: (quizScore && quizScore >= 2) || false,
      })
      .returning();

    // Update tutorial stats
    await this.updateTutorialStats(tutorialId, quizScore);

    return progress;
  }

  async getUserTutorialAchievements(userId: number): Promise<TutorialAchievement[]> {
    return await db.select().from(tutorialAchievements).where(eq(tutorialAchievements.userId, userId));
  }

  async unlockTutorialAchievement(userId: number, achievementId: string): Promise<TutorialAchievement> {
    const [achievement] = await db
      .insert(tutorialAchievements)
      .values({
        userId,
        achievementId,
      })
      .returning();

    return achievement;
  }

  async getTutorialStats(tutorialId?: string): Promise<TutorialStats[]> {
    if (tutorialId) {
      return await db.select().from(tutorialStats).where(eq(tutorialStats.tutorialId, tutorialId));
    }
    return await db.select().from(tutorialStats);
  }

  async updateTutorialStats(tutorialId: string, quizScore?: number): Promise<void> {
    // Get existing stats
    const [existingStats] = await db.select().from(tutorialStats).where(eq(tutorialStats.tutorialId, tutorialId));

    if (existingStats) {
      // Update existing stats
      const newCompletions = existingStats.totalCompletions + 1;
      let newAverageScore = existingStats.averageQuizScore;

      if (quizScore !== undefined) {
        const currentTotal = existingStats.averageQuizScore 
          ? parseFloat(existingStats.averageQuizScore) * (newCompletions - 1)
          : 0;
        newAverageScore = ((currentTotal + quizScore) / newCompletions).toString();
      }

      await db
        .update(tutorialStats)
        .set({
          totalCompletions: newCompletions,
          averageQuizScore: newAverageScore,
          updatedAt: new Date(),
        })
        .where(eq(tutorialStats.tutorialId, tutorialId));
    } else {
      // Create new stats
      await db
        .insert(tutorialStats)
        .values({
          tutorialId,
          totalCompletions: 1,
          averageQuizScore: quizScore?.toString(),
          popularityScore: "1.0",
        });
    }
  }
}

export const storage = new DatabaseStorage();
