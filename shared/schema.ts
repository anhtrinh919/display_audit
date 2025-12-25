import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Stores table
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  storeId: text("store_id").notNull().unique(), // e.g., "S001", "BVI"
  name: text("name").notNull(),
  location: text("location").notNull(),
  manager: text("manager"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Categories for task types
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Audit tasks/campaigns
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  taskId: text("task_id").notNull().unique(), // e.g., "T-2025-001"
  title: text("title").notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => categories.id),
  dueDate: timestamp("due_date"),
  status: text("status").notNull().default("draft"), // draft, active, completed
  standardImageUrl: text("standard_image_url"), // URL to reference/best practice image
  totalStores: integer("total_stores").default(0).notNull(),
  completedStores: integer("completed_stores").default(0).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Audit results - one per store per task
export const auditResults = pgTable("audit_results", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  storeId: integer("store_id").notNull().references(() => stores.id),
  actualImageUrl: text("actual_image_url"), // URL to uploaded actual display image
  score: integer("score"), // 0-100 compliance score
  status: text("status").notNull().default("pending"), // pending, compliant, non_compliant, needs_review
  aiAnalysis: text("ai_analysis"), // JSON string with AI findings
  issues: text("issues"), // JSON array of issue strings
  auditDate: timestamp("audit_date").default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStoreSchema = createInsertSchema(stores).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedStores: true,
});

export const insertAuditResultSchema = createInsertSchema(auditResults).omit({
  id: true,
  createdAt: true,
  auditDate: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Store = typeof stores.$inferSelect;
export type InsertStore = z.infer<typeof insertStoreSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type AuditResult = typeof auditResults.$inferSelect;
export type InsertAuditResult = z.infer<typeof insertAuditResultSchema>;
