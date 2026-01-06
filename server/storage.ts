import { type User, type InsertUser, type SiteContent, users, siteContent } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getSiteContent(): Promise<SiteContent | undefined>;
  upsertSiteContent(content: unknown): Promise<SiteContent>;
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
}

export const storage = new DatabaseStorage();
