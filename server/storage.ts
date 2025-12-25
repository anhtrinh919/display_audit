import { db } from "./db";
import {
  type User,
  type InsertUser,
  type Store,
  type InsertStore,
  type Category,
  type InsertCategory,
  type Task,
  type InsertTask,
  type AuditResult,
  type InsertAuditResult,
  users,
  stores,
  categories,
  tasks,
  auditResults,
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Store methods
  getAllStores(): Promise<Store[]>;
  getStore(id: number): Promise<Store | undefined>;
  getStoreByStoreId(storeId: string): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;
  updateStore(id: number, store: Partial<InsertStore>): Promise<Store | undefined>;
  deleteStore(id: number): Promise<void>;

  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<void>;

  // Task methods
  getAllTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  getTaskByTaskId(taskId: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<void>;
  updateTaskProgress(taskId: number): Promise<void>;

  // Audit Result methods
  getAllAuditResults(): Promise<AuditResult[]>;
  getAuditResult(id: number): Promise<AuditResult | undefined>;
  getAuditResultsByTask(taskId: number): Promise<AuditResult[]>;
  getAuditResultByTaskAndStore(taskId: number, storeId: number): Promise<AuditResult | undefined>;
  createAuditResult(result: InsertAuditResult): Promise<AuditResult>;
  updateAuditResult(id: number, result: Partial<InsertAuditResult>): Promise<AuditResult | undefined>;
  deleteAuditResult(id: number): Promise<void>;
}

class DatabaseStorage implements IStorage {
  // User methods
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

  // Store methods
  async getAllStores(): Promise<Store[]> {
    return db.select().from(stores).orderBy(stores.name);
  }

  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store;
  }

  async getStoreByStoreId(storeId: string): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.storeId, storeId));
    return store;
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const [store] = await db.insert(stores).values(insertStore).returning();
    return store;
  }

  async updateStore(id: number, updateData: Partial<InsertStore>): Promise<Store | undefined> {
    const [store] = await db.update(stores).set(updateData).where(eq(stores.id, id)).returning();
    return store;
  }

  async deleteStore(id: number): Promise<void> {
    await db.delete(stores).where(eq(stores.id, id));
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(categories.name);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db.update(categories).set(updateData).where(eq(categories.id, id)).returning();
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Task methods
  async getAllTasks(): Promise<Task[]> {
    return db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async getTaskByTaskId(taskId: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.taskId, taskId));
    return task;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: number, updateData: Partial<InsertTask>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async updateTaskProgress(taskId: number): Promise<void> {
    const results = await this.getAuditResultsByTask(taskId);
    const completed = results.filter((r) => r.status !== "pending").length;
    await db
      .update(tasks)
      .set({ completedStores: completed, updatedAt: new Date() })
      .where(eq(tasks.id, taskId));
  }

  // Audit Result methods
  async getAllAuditResults(): Promise<AuditResult[]> {
    return db.select().from(auditResults).orderBy(desc(auditResults.auditDate));
  }

  async getAuditResult(id: number): Promise<AuditResult | undefined> {
    const [result] = await db.select().from(auditResults).where(eq(auditResults.id, id));
    return result;
  }

  async getAuditResultsByTask(taskId: number): Promise<AuditResult[]> {
    return db.select().from(auditResults).where(eq(auditResults.taskId, taskId)).orderBy(desc(auditResults.auditDate));
  }

  async getAuditResultByTaskAndStore(taskId: number, storeId: number): Promise<AuditResult | undefined> {
    const [result] = await db
      .select()
      .from(auditResults)
      .where(and(eq(auditResults.taskId, taskId), eq(auditResults.storeId, storeId)));
    return result;
  }

  async createAuditResult(insertResult: InsertAuditResult): Promise<AuditResult> {
    const [result] = await db.insert(auditResults).values(insertResult).returning();
    return result;
  }

  async updateAuditResult(id: number, updateData: Partial<InsertAuditResult>): Promise<AuditResult | undefined> {
    const [result] = await db.update(auditResults).set(updateData).where(eq(auditResults.id, id)).returning();
    return result;
  }

  async deleteAuditResult(id: number): Promise<void> {
    await db.delete(auditResults).where(eq(auditResults.id, id));
  }
}

export const storage = new DatabaseStorage();
