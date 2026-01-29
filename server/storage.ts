import { type User, type InsertUser, type SiteContent, type Resource, type InsertResource, type SeoMetadata, type InsertSeoMetadata, type FaqItem, type InsertFaqItem, type SiteSettings, type InsertSiteSettings, users, siteContent, resources, seoMetadata, faqItems, siteSettings } from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getSiteContent(): Promise<SiteContent | undefined>;
  upsertSiteContent(content: unknown): Promise<SiteContent>;
  
  getAllResources(): Promise<Resource[]>;
  getPublishedResources(): Promise<Resource[]>;
  getResourceById(id: number): Promise<Resource | undefined>;
  getResourceBySlug(slug: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: number, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: number): Promise<boolean>;

  getAllSeoMetadata(): Promise<SeoMetadata[]>;
  getSeoMetadataByPath(path: string): Promise<SeoMetadata | undefined>;
  getSeoMetadataById(id: number): Promise<SeoMetadata | undefined>;
  createSeoMetadata(seo: InsertSeoMetadata): Promise<SeoMetadata>;
  updateSeoMetadata(id: number, seo: Partial<InsertSeoMetadata>): Promise<SeoMetadata | undefined>;
  deleteSeoMetadata(id: number): Promise<boolean>;

  getAllFaqItems(): Promise<FaqItem[]>;
  getPublishedFaqItems(): Promise<FaqItem[]>;
  getFaqItemById(id: number): Promise<FaqItem | undefined>;
  createFaqItem(faq: InsertFaqItem): Promise<FaqItem>;
  updateFaqItem(id: number, faq: Partial<InsertFaqItem>): Promise<FaqItem | undefined>;
  deleteFaqItem(id: number): Promise<boolean>;

  getSiteSettings(): Promise<SiteSettings | undefined>;
  upsertSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getSiteContent(): Promise<SiteContent | undefined> {
    const [content] = await db.select().from(siteContent).where(eq(siteContent.id, "main"));
    return content;
  }

  async upsertSiteContent(content: unknown): Promise<SiteContent> {
    const [result] = await db
      .insert(siteContent)
      .values({ id: "main", content })
      .onConflictDoUpdate({
        target: siteContent.id,
        set: { content },
      })
      .returning();
    return result;
  }

  async getAllResources(): Promise<Resource[]> {
    return db.select().from(resources).orderBy(desc(resources.createdAt));
  }

  async getPublishedResources(): Promise<Resource[]> {
    return db.select().from(resources).where(eq(resources.isPublished, true)).orderBy(desc(resources.publishedAt));
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async getResourceBySlug(slug: string): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.slug, slug));
    return resource;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [result] = await db.insert(resources).values(resource).returning();
    return result;
  }

  async updateResource(id: number, resource: Partial<InsertResource>): Promise<Resource | undefined> {
    const [result] = await db
      .update(resources)
      .set({ ...resource, updatedAt: new Date() })
      .where(eq(resources.id, id))
      .returning();
    return result;
  }

  async deleteResource(id: number): Promise<boolean> {
    const result = await db.delete(resources).where(eq(resources.id, id)).returning();
    return result.length > 0;
  }

  async getAllSeoMetadata(): Promise<SeoMetadata[]> {
    return db.select().from(seoMetadata).orderBy(seoMetadata.path);
  }

  async getSeoMetadataByPath(path: string): Promise<SeoMetadata | undefined> {
    const [result] = await db.select().from(seoMetadata).where(eq(seoMetadata.path, path));
    return result;
  }

  async getSeoMetadataById(id: number): Promise<SeoMetadata | undefined> {
    const [result] = await db.select().from(seoMetadata).where(eq(seoMetadata.id, id));
    return result;
  }

  async createSeoMetadata(seo: InsertSeoMetadata): Promise<SeoMetadata> {
    const [result] = await db.insert(seoMetadata).values(seo).returning();
    return result;
  }

  async updateSeoMetadata(id: number, seo: Partial<InsertSeoMetadata>): Promise<SeoMetadata | undefined> {
    const [result] = await db
      .update(seoMetadata)
      .set({ ...seo, updatedAt: new Date() })
      .where(eq(seoMetadata.id, id))
      .returning();
    return result;
  }

  async deleteSeoMetadata(id: number): Promise<boolean> {
    const result = await db.delete(seoMetadata).where(eq(seoMetadata.id, id)).returning();
    return result.length > 0;
  }

  async getAllFaqItems(): Promise<FaqItem[]> {
    return db.select().from(faqItems).orderBy(asc(faqItems.category), asc(faqItems.sortOrder));
  }

  async getPublishedFaqItems(): Promise<FaqItem[]> {
    return db.select().from(faqItems).where(eq(faqItems.isPublished, true)).orderBy(asc(faqItems.category), asc(faqItems.sortOrder));
  }

  async getFaqItemById(id: number): Promise<FaqItem | undefined> {
    const [result] = await db.select().from(faqItems).where(eq(faqItems.id, id));
    return result;
  }

  async createFaqItem(faq: InsertFaqItem): Promise<FaqItem> {
    const [result] = await db.insert(faqItems).values(faq).returning();
    return result;
  }

  async updateFaqItem(id: number, faq: Partial<InsertFaqItem>): Promise<FaqItem | undefined> {
    const [result] = await db
      .update(faqItems)
      .set({ ...faq, updatedAt: new Date() })
      .where(eq(faqItems.id, id))
      .returning();
    return result;
  }

  async deleteFaqItem(id: number): Promise<boolean> {
    const result = await db.delete(faqItems).where(eq(faqItems.id, id)).returning();
    return result.length > 0;
  }

  async getSiteSettings(): Promise<SiteSettings | undefined> {
    const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, "main"));
    return settings;
  }

  async upsertSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings> {
    const [result] = await db
      .insert(siteSettings)
      .values({ id: "main", ...settings })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { ...settings, updatedAt: new Date() },
      })
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
