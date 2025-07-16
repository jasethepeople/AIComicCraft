import { pgTable, text, serial, integer, json, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
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

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  comics: many(comics),
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
