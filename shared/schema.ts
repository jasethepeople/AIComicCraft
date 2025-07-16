import { pgTable, text, serial, integer, json, timestamp, boolean } from "drizzle-orm/pg-core";
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

// Comic schema
export const comics = pgTable("comics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  userId: integer("user_id").notNull(),
  coverImage: text("cover_image"),
  artStyle: text("art_style").notNull(),
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
  coverImage: true,
  price: true,
  isPublished: true,
  isForSale: true,
});

// Comic panel schema
export const panels = pgTable("panels", {
  id: serial("id").primaryKey(),
  comicId: integer("comic_id").notNull(),
  sequence: integer("sequence").notNull(),
  imageUrl: text("image_url"),
  characters: json("characters").default([]),
  dialogues: json("dialogues").default([]),
  layout: text("layout").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPanelSchema = createInsertSchema(panels).pick({
  comicId: true,
  sequence: true,
  imageUrl: true,
  characters: true,
  dialogues: true,
  layout: true,
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
  characters: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })).min(1, "At least one character is required"),
  panelCount: z.number().min(1).max(12),
  prompt: z.string().min(10, "Detailed prompt is required"),
});

export type ComicGenerationRequest = z.infer<typeof comicGenerationSchema>;

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
