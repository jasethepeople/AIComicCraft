import { pgTable, text, serial, integer, json, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  credits: integer("credits").default(10).notNull(), // Monthly credits
  totalCreditsUsed: integer("total_credits_used").default(0).notNull(),
  subscriptionTier: text("subscription_tier").default("free").notNull(), // free, basic, pro, lifetime
  subscriptionStatus: text("subscription_status").default("active").notNull(), // active, cancelled, expired
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  lastCreditReset: timestamp("last_credit_reset").defaultNow().notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Comic/Anime schema
export const comics = pgTable("comics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  userId: integer("user_id").notNull(),
  coverImage: text("cover_image"),
  artStyle: text("art_style").notNull(),
  contentType: text("content_type").notNull().default("comic"), // "comic", "anime", "manga"
  animationStyle: text("animation_style"), // "2D", "3D", "mixed" for anime content
  frameRate: integer("frame_rate").default(24), // for anime content
  duration: integer("duration"), // duration in seconds for anime
  price: text("price"),
  isPublished: boolean("is_published").default(false),
  isForSale: boolean("is_for_sale").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertComicSchema = createInsertSchema(comics).pick({
  title: true,
  description: true,
  userId: true,
  artStyle: true,
  contentType: true,
  animationStyle: true,
  frameRate: true,
  duration: true,
  coverImage: true,
  price: true,
  isPublished: true,
  isForSale: true,
});

// Comic panel/anime frame schema
export const panels = pgTable("panels", {
  id: serial("id").primaryKey(),
  comicId: integer("comic_id").notNull(),
  sequence: integer("sequence").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"), // for anime frames
  animationData: json("animation_data"), // keyframes, transitions for anime
  duration: integer("duration").default(0), // frame duration in milliseconds for anime
  characters: json("characters").default([]),
  dialogues: json("dialogues").default([]),
  voiceOvers: json("voice_overs").default([]), // for anime audio
  layout: text("layout").notNull(),
  panelType: text("panel_type").notNull().default("static"), // "static", "animated", "transition"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPanelSchema = createInsertSchema(panels).pick({
  comicId: true,
  sequence: true,
  imageUrl: true,
  videoUrl: true,
  animationData: true,
  duration: true,
  characters: true,
  dialogues: true,
  voiceOvers: true,
  layout: true,
  panelType: true,
});

// Art style schema
export const artStyles = pgTable("art_styles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
});

export const insertArtStyleSchema = createInsertSchema(artStyles).pick({
  name: true,
  description: true,
  thumbnailUrl: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Comic = typeof comics.$inferSelect;
export type InsertComic = z.infer<typeof insertComicSchema>;

export type Panel = typeof panels.$inferSelect;
export type InsertPanel = z.infer<typeof insertPanelSchema>;

export type ArtStyle = typeof artStyles.$inferSelect;
export type InsertArtStyle = z.infer<typeof insertArtStyleSchema>;

// Credit transactions schema
export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // "used", "purchased", "refunded", "monthly_reset"
  amount: integer("amount").notNull(), // positive for additions, negative for usage
  description: text("description").notNull(),
  relatedId: integer("related_id"), // comic/anime ID if credit was used for generation
  stripePaymentIntentId: text("stripe_payment_intent_id"), // for purchased credits
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).pick({
  userId: true,
  type: true,
  amount: true,
  description: true,
  relatedId: true,
  stripePaymentIntentId: true,
});

// Subscription plans schema
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // "Free", "Basic", "Pro", "Lifetime"
  tier: text("tier").notNull(), // "free", "basic", "pro", "lifetime"
  monthlyCredits: integer("monthly_credits").notNull(),
  priceMonthly: integer("price_monthly"), // in cents, null for free/lifetime
  priceYearly: integer("price_yearly"), // in cents, null for free
  priceLifetime: integer("price_lifetime"), // in cents, null for non-lifetime
  features: json("features").$type<string[]>().notNull().default([]),
  isActive: boolean("is_active").default(true).notNull(),
  stripePriceIdMonthly: text("stripe_price_id_monthly"),
  stripePriceIdYearly: text("stripe_price_id_yearly"),
  stripePriceIdLifetime: text("stripe_price_id_lifetime"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).pick({
  name: true,
  tier: true,
  monthlyCredits: true,
  priceMonthly: true,
  priceYearly: true,
  priceLifetime: true,
  features: true,
  isActive: true,
  stripePriceIdMonthly: true,
  stripePriceIdYearly: true,
  stripePriceIdLifetime: true,
});

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;

// AI Generation schema for backend API interactions
export const comicGenerationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  artStyle: z.string().min(1, "Art style is required"),
  contentType: z.enum(["comic", "anime", "manga"]).default("comic"),
  animationStyle: z.enum(["2D", "3D", "mixed"]).optional(),
  frameRate: z.number().min(12).max(60).default(24),
  duration: z.number().min(5).max(300).optional(), // 5 seconds to 5 minutes
  characters: z.array(z.object({
    name: z.string(),
    description: z.string(),
    voiceType: z.string().optional(), // for anime voice generation
  })).min(1, "At least one character is required"),
  panelCount: z.number().min(1).max(50), // increased for anime frames
  prompt: z.string().min(10, "Detailed prompt is required"),
});

export type ComicGenerationRequest = z.infer<typeof comicGenerationSchema>;

// Anime-specific generation schema
export const animeGenerationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  artStyle: z.string().min(1, "Art style is required"),
  animationStyle: z.enum(["2D", "3D", "mixed"]).default("2D"),
  frameRate: z.number().min(12).max(60).default(24),
  duration: z.number().min(5).max(300), // duration in seconds
  characters: z.array(z.object({
    name: z.string(),
    description: z.string(),
    voiceType: z.enum(["young_male", "young_female", "mature_male", "mature_female", "child", "elderly"]).default("young_male"),
    personality: z.string().optional(),
  })).min(1, "At least one character is required"),
  scenes: z.array(z.object({
    description: z.string(),
    duration: z.number().min(1).max(30), // scene duration in seconds
    dialogues: z.array(z.object({
      character: z.string(),
      text: z.string(),
      emotion: z.enum(["happy", "sad", "angry", "surprised", "neutral", "excited"]).default("neutral"),
    })).optional(),
    cameraMovement: z.enum(["static", "pan", "zoom", "rotation"]).default("static"),
    effects: z.array(z.string()).optional(),
  })).min(1, "At least one scene is required"),
  musicStyle: z.enum(["epic", "dramatic", "cheerful", "mysterious", "action", "romance", "none"]).default("none"),
  prompt: z.string().min(10, "Detailed prompt is required"),
});

export type AnimeGenerationRequest = z.infer<typeof animeGenerationSchema>;

export const panelGenerationSchema = z.object({
  comicId: z.number(),
  sequence: z.number(),
  layout: z.string(),
  description: z.string(),
  characters: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })),
  dialogues: z.array(z.object({
    character: z.string(),
    text: z.string(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
  })).optional(),
});

export type PanelGenerationRequest = z.infer<typeof panelGenerationSchema>;

// Credit purchase schema
export const creditPurchaseSchema = z.object({
  creditAmount: z.number().min(1).max(1000),
  paymentMethod: z.enum(["stripe"]).default("stripe"),
});

export type CreditPurchaseRequest = z.infer<typeof creditPurchaseSchema>;

// Style recommendation schema
export const styleRecommendationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  contentType: z.enum(["comic", "anime", "manga"]).default("comic"),
  genre: z.string().optional(),
  targetAudience: z.enum(["children", "teens", "adults", "all"]).optional(),
  mood: z.enum(["lighthearted", "serious", "dark", "adventure", "romance", "action", "comedy", "drama"]).optional(),
  characters: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })).optional(),
  previousStyles: z.array(z.string()).optional(),
  colorPalette: z.enum(["bright", "muted", "dark", "pastel", "vibrant", "monochrome"]).optional(),
  complexity: z.enum(["simple", "moderate", "detailed", "intricate"]).optional(),
  timeOfDay: z.enum(["morning", "day", "evening", "night", "any"]).optional(),
  setting: z.enum(["urban", "rural", "fantasy", "sci-fi", "historical", "modern", "post-apocalyptic"]).optional(),
  inspirationImages: z.array(z.string()).optional(), // URLs to reference images
});

export type StyleRecommendationRequest = z.infer<typeof styleRecommendationSchema>;

// User style preferences tracking
export const userStylePreferences = pgTable("user_style_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  artStyleId: integer("art_style_id").notNull(),
  usageCount: integer("usage_count").default(1).notNull(),
  lastUsed: timestamp("last_used").defaultNow().notNull(),
  rating: integer("rating"), // 1-5 stars, optional user rating
  contextTags: text("context_tags").array(), // Tags for when this style was used
  projectType: text("project_type"), // Type of project where this style was used
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Style recommendation cache to improve performance
export const styleRecommendationCache = pgTable("style_recommendation_cache", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  requestHash: text("request_hash").notNull().unique(), // Hash of the request parameters
  recommendations: json("recommendations").notNull(), // Cached recommendations
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Style trend tracking
export const styleTrends = pgTable("style_trends", {
  id: serial("id").primaryKey(),
  artStyleId: integer("art_style_id").notNull(),
  period: text("period").notNull(), // 'daily', 'weekly', 'monthly'
  usageCount: integer("usage_count").default(0).notNull(),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }),
  trendingScore: decimal("trending_score", { precision: 5, scale: 2 }),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserStylePreferenceSchema = createInsertSchema(userStylePreferences).pick({
  userId: true,
  artStyleId: true,
  usageCount: true,
  rating: true,
});

export type UserStylePreference = typeof userStylePreferences.$inferSelect;
export type InsertUserStylePreference = z.infer<typeof insertUserStylePreferenceSchema>;

export const insertStyleRecommendationCacheSchema = createInsertSchema(styleRecommendationCache).pick({
  userId: true,
  requestHash: true,
  recommendations: true,
  expiresAt: true,
});

export type StyleRecommendationCache = typeof styleRecommendationCache.$inferSelect;
export type InsertStyleRecommendationCache = z.infer<typeof insertStyleRecommendationCacheSchema>;

export const insertStyleTrendSchema = createInsertSchema(styleTrends).pick({
  artStyleId: true,
  period: true,
  usageCount: true,
  averageRating: true,
  trendingScore: true,
  periodStart: true,
  periodEnd: true,
});

export type StyleTrend = typeof styleTrends.$inferSelect;
export type InsertStyleTrend = z.infer<typeof insertStyleTrendSchema>;

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  comics: many(comics),
  creditTransactions: many(creditTransactions),
}));

export const comicsRelations = relations(comics, ({ one, many }) => ({
  user: one(users, {
    fields: [comics.userId],
    references: [users.id],
  }),
  panels: many(panels),
}));

export const panelsRelations = relations(panels, ({ one }) => ({
  comic: one(comics, {
    fields: [panels.comicId],
    references: [comics.id],
  }),
}));

export const creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
  user: one(users, {
    fields: [creditTransactions.userId],
    references: [users.id],
  }),
}));

export const userStylePreferencesRelations = relations(userStylePreferences, ({ one }) => ({
  user: one(users, {
    fields: [userStylePreferences.userId],
    references: [users.id],
  }),
  artStyle: one(artStyles, {
    fields: [userStylePreferences.artStyleId],
    references: [artStyles.id],
  }),
}));

export const styleRecommendationCacheRelations = relations(styleRecommendationCache, ({ one }) => ({
  user: one(users, {
    fields: [styleRecommendationCache.userId],
    references: [users.id],
  }),
}));

export const styleTrendsRelations = relations(styleTrends, ({ one }) => ({
  artStyle: one(artStyles, {
    fields: [styleTrends.artStyleId],
    references: [artStyles.id],
  }),
}));
