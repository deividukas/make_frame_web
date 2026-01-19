import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const siteContent = pgTable("site_content", {
  id: varchar("id").primaryKey().default("main"),
  content: jsonb("content").notNull(),
});

export const insertSiteContentSchema = createInsertSchema(siteContent);
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  keyTakeaways: text("key_takeaways"),
  featuredImage: text("featured_image"),
  featuredImageAlt: varchar("featured_image_alt", { length: 255 }),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export const seoMetadata = pgTable("seo_metadata", {
  id: serial("id").primaryKey(),
  path: varchar("path", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  ogImage: text("og_image"),
  canonicalUrl: text("canonical_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSeoMetadataSchema = createInsertSchema(seoMetadata).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSeoMetadata = z.infer<typeof insertSeoMetadataSchema>;
export type SeoMetadata = typeof seoMetadata.$inferSelect;
