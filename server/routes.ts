import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { GoogleGenAI } from "@google/genai";
import { insertStoreSchema, insertCategorySchema, insertTaskSchema, insertAuditResultSchema } from "@shared/schema";

// Set up file upload with multer
const uploadDir = path.join(process.cwd(), "uploads");
fs.mkdir(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============= STORES API =============
  app.get("/api/stores", async (req, res) => {
    try {
      const allStores = await storage.getAllStores();
      res.json(allStores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      res.status(500).json({ error: "Failed to fetch stores" });
    }
  });

  app.get("/api/stores/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const store = await storage.getStore(id);
      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }
      res.json(store);
    } catch (error) {
      console.error("Error fetching store:", error);
      res.status(500).json({ error: "Failed to fetch store" });
    }
  });

  app.post("/api/stores", async (req, res) => {
    try {
      const validated = insertStoreSchema.parse(req.body);
      const store = await storage.createStore(validated);
      res.status(201).json(store);
    } catch (error: any) {
      console.error("Error creating store:", error);
      if (error?.code === "23505") {
        return res.status(400).json({ error: "Mã cửa hàng đã tồn tại" });
      }
      res.status(400).json({ error: "Dữ liệu cửa hàng không hợp lệ" });
    }
  });

  app.patch("/api/stores/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const store = await storage.updateStore(id, req.body);
      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }
      res.json(store);
    } catch (error) {
      console.error("Error updating store:", error);
      res.status(500).json({ error: "Failed to update store" });
    }
  });

  app.delete("/api/stores/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteStore(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting store:", error);
      res.status(500).json({ error: "Failed to delete store" });
    }
  });

  // ============= CATEGORIES API =============
  app.get("/api/categories", async (req, res) => {
    try {
      const allCategories = await storage.getAllCategories();
      res.json(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validated = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validated);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(400).json({ error: "Invalid category data" });
    }
  });

  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.updateCategory(id, req.body);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // ============= TASKS API =============
  app.get("/api/tasks", async (req, res) => {
    try {
      const allTasks = await storage.getAllTasks();
      res.json(allTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", upload.single("standardImage"), async (req, res) => {
    try {
      const taskData = {
        ...req.body,
        totalStores: parseInt(req.body.totalStores || "0"),
        categoryId: req.body.categoryId ? parseInt(req.body.categoryId) : null,
        standardImageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
      };
      
      const validated = insertTaskSchema.parse(taskData);
      const task = await storage.createTask(validated);
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", upload.single("standardImage"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = {
        ...req.body,
        ...(req.file && { standardImageUrl: `/uploads/${req.file.filename}` }),
        ...(req.body.dueDate && { dueDate: new Date(req.body.dueDate) }),
        ...(req.body.categoryId && { categoryId: parseInt(req.body.categoryId) }),
        ...(req.body.totalStores && { totalStores: parseInt(req.body.totalStores) }),
      };
      const task = await storage.updateTask(id, updateData);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // ============= AUDIT RESULTS API =============
  app.get("/api/audit-results", async (req, res) => {
    try {
      const taskId = req.query.taskId ? parseInt(req.query.taskId as string) : null;
      if (taskId) {
        const results = await storage.getAuditResultsByTask(taskId);
        res.json(results);
      } else {
        const results = await storage.getAllAuditResults();
        res.json(results);
      }
    } catch (error) {
      console.error("Error fetching audit results:", error);
      res.status(500).json({ error: "Failed to fetch audit results" });
    }
  });

  app.post("/api/audit-results", upload.single("actualImage"), async (req, res) => {
    try {
      const { taskId, storeId } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: "Actual display image is required" });
      }

      const actualImageUrl = `/uploads/${req.file.filename}`;
      
      // Get task to retrieve standard image
      const task = await storage.getTask(parseInt(taskId));
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Read both images as base64 for AI analysis
      const actualImagePath = path.join(uploadDir, req.file.filename);
      const actualImageBuffer = await fs.readFile(actualImagePath);
      const actualImageBase64 = actualImageBuffer.toString("base64");

      let standardImageBase64 = "";
      if (task.standardImageUrl) {
        const standardImagePath = path.join(process.cwd(), task.standardImageUrl);
        const standardImageBuffer = await fs.readFile(standardImagePath);
        standardImageBase64 = standardImageBuffer.toString("base64");
      }

      // AI Analysis using Gemini
      const prompt = `You are an AI retail display auditor. Compare these two images:
1. Standard/Best Practice Display (reference)
2. Actual Store Display (current state)

Analyze the actual display against the standard and provide:
1. Compliance score (0-100): How well does the actual display match the standard?
2. List of specific issues (max 5 bullet points): What are the key differences or problems?
3. Overall status: "compliant" (90-100), "needs_review" (70-89), or "non_compliant" (<70)

Focus on: product arrangement, shelf organization, signage placement, stock levels, and visual appeal.

Respond in JSON format:
{
  "score": <number>,
  "status": "<string>",
  "issues": [<array of strings>]
}`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: standardImageBase64,
                  mimeType: "image/jpeg",
                },
              },
              {
                inlineData: {
                  data: actualImageBase64,
                  mimeType: "image/jpeg",
                },
              },
            ],
          },
        ],
      });

      const aiText = aiResponse.text || "{}";
      let analysis: any = {};
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = aiText.match(/```json\n([\s\S]*?)\n```/) || aiText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiText;
        analysis = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        analysis = { score: 0, status: "pending", issues: ["AI analysis failed"] };
      }

      // Create audit result
      const auditData = {
        taskId: parseInt(taskId),
        storeId: parseInt(storeId),
        actualImageUrl,
        score: analysis.score || 0,
        status: analysis.status || "pending",
        aiAnalysis: JSON.stringify(analysis),
        issues: JSON.stringify(analysis.issues || []),
      };

      const result = await storage.createAuditResult(auditData);
      
      // Update task progress
      await storage.updateTaskProgress(parseInt(taskId));

      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating audit result:", error);
      res.status(500).json({ error: "Failed to create audit result" });
    }
  });

  // ============= BATCH UPLOAD API =============
  app.post("/api/audit-results/batch", upload.array("images", 50), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const { taskId } = req.body;

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No images uploaded" });
      }

      const results = [];
      const errors = [];

      for (const file of files) {
        try {
          // Extract store ID from filename (e.g., "bvi_display.jpg" -> "bvi" or "S001" -> "s001")
          const filename = file.originalname.toLowerCase();
          const storeIdMatch = filename.match(/^([a-z0-9]+)[_-]?/i);
          const fileStoreId = storeIdMatch ? storeIdMatch[1].toUpperCase() : null;

          if (!fileStoreId) {
            errors.push({ filename: file.originalname, error: "Could not extract store ID from filename" });
            continue;
          }

          // Find store by storeId
          const store = await storage.getStoreByStoreId(fileStoreId);
          if (!store) {
            errors.push({ filename: file.originalname, error: `Store not found: ${fileStoreId}` });
            continue;
          }

          // Simple analysis for batch upload (faster processing)
          const auditData = {
            taskId: parseInt(taskId),
            storeId: store.id,
            actualImageUrl: `/uploads/${file.filename}`,
            score: 0,
            status: "pending" as const,
            issues: JSON.stringify(["Pending AI analysis"]),
          };

          const result = await storage.createAuditResult(auditData);
          results.push({ filename: file.originalname, storeId: store.storeId, result });
        } catch (err) {
          errors.push({ filename: file.originalname, error: String(err) });
        }
      }

      // Update task progress
      await storage.updateTaskProgress(parseInt(taskId));

      res.json({
        success: results.length,
        failed: errors.length,
        results,
        errors,
      });
    } catch (error) {
      console.error("Error batch uploading:", error);
      res.status(500).json({ error: "Failed to process batch upload" });
    }
  });

  return httpServer;
}
