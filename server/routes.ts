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
      const taskData: Record<string, any> = {
        taskId: req.body.taskId,
        title: req.body.title,
        description: req.body.description || undefined,
        totalStores: parseInt(req.body.totalStores || "0"),
        standardImageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      };
      
      if (req.body.categoryId) {
        taskData.categoryId = parseInt(req.body.categoryId);
      }
      if (req.body.dueDate) {
        taskData.dueDate = new Date(req.body.dueDate);
      }
      
      const validated = insertTaskSchema.parse(taskData);
      const task = await storage.createTask(validated);
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ error: "Dữ liệu hạng mục không hợp lệ" });
    }
  });

  app.patch("/api/tasks/:id", upload.single("standardImage"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData: Record<string, any> = {};
      
      if (req.body.taskId) updateData.taskId = req.body.taskId;
      if (req.body.title) updateData.title = req.body.title;
      if (req.body.description !== undefined) updateData.description = req.body.description || undefined;
      if (req.body.totalStores) updateData.totalStores = parseInt(req.body.totalStores);
      if (req.body.categoryId) updateData.categoryId = parseInt(req.body.categoryId);
      if (req.body.dueDate) updateData.dueDate = new Date(req.body.dueDate);
      if (req.file) updateData.standardImageUrl = `/uploads/${req.file.filename}`;
      
      const task = await storage.updateTask(id, updateData);
      if (!task) {
        return res.status(404).json({ error: "Không tìm thấy hạng mục" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Lỗi khi cập nhật hạng mục" });
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

      // AI Analysis using Gemini - Structured 4-step shelf comparison
      const prompt = `Bạn là chuyên gia kiểm tra trưng bày bán lẻ (Trade Marketing Auditor). So sánh 2 ảnh sau:
- ẢNH 1: Tiêu chuẩn trưng bày (Best Practice/Standard)
- ẢNH 2: Thực tế tại cửa hàng (Actual Display)

## ĐỊNH NGHĨA QUAN TRỌNG:
- **Mặt kệ (Shelf Unit)**: Một đơn vị kệ hoàn chỉnh, có thể có nhiều tầng
- **Khay kệ (Shelf Tray)**: Mỗi tầng ngang trên một mặt kệ

## QUY TRÌNH SO SÁNH 4 BƯỚC:

### BƯỚC 1: ĐẾM SỐ MẶT KỆ
- Đếm số mặt kệ (shelf units) trong ảnh tiêu chuẩn
- Đếm số mặt kệ trong ảnh thực tế
- So sánh: Có bằng nhau không?

### BƯỚC 2: ĐẾM SỐ KHAY KỆ TRÊN MỖI MẶT KỆ
- Với mỗi mặt kệ, đếm số khay kệ (tầng ngang)
- So sánh số khay giữa tiêu chuẩn và thực tế

### BƯỚC 3: SO SÁNH NGÀNH HÀNG TRÊN TỪNG KHAY
- KHÔNG cần nhận diện chính xác sản phẩm
- Chỉ cần xác định NGÀNH HÀNG/NHÓM SP chung:
  - Ví dụ: "Đồ chơi", "Bánh kẹo", "Snack", "Nước ngọt", "Hóa mỹ phẩm", "Bia", v.v.
- So sánh ngành hàng trên từng khay tương ứng

### BƯỚC 4: TÓM TẮT THEO TỪNG MẶT KỆ
- Tổng hợp kết quả so sánh cho mỗi mặt kệ
- Đánh giá mức độ tuân thủ tổng thể

## KIỂM TRA THEME (nếu có)
Nếu ảnh có theme rõ ràng (Halloween, Tết, Trung Thu...):
- Theme không khớp → Điểm = 0-20, status = "non_compliant"

## ĐỊNH DẠNG OUTPUT (JSON - TIẾNG VIỆT):
{
  "themeMatch": {
    "standard": "<tên theme nếu có, hoặc 'Không có theme cụ thể'>",
    "actual": "<tên theme thực tế>",
    "match": <true/false>,
    "comment": "<nhận xét>"
  },
  "score": <0-100>,
  "status": "<compliant|needs_review|non_compliant>",
  "summary": "<tóm tắt 1-2 câu về kết quả>",
  "issues": ["<vấn đề 1>", "<vấn đề 2>"],
  "shelfComparison": {
    "standardShelfCount": <số mặt kệ ảnh tiêu chuẩn>,
    "actualShelfCount": <số mặt kệ ảnh thực tế>,
    "shelfCountMatch": <true/false>,
    "shelves": [
      {
        "shelfId": "shelf_1",
        "shelfName": "<tên mặt kệ, vd: Kệ chính, Kệ mini bên cạnh>",
        "standardTrayCount": <số khay tiêu chuẩn>,
        "actualTrayCount": <số khay thực tế>,
        "trayCountMatch": <true/false>,
        "trays": [
          {
            "trayNumber": 1,
            "standardCategory": "<ngành hàng tiêu chuẩn, vd: Bánh kẹo>",
            "actualCategory": "<ngành hàng thực tế, vd: Đồ chơi>",
            "match": <true/false>,
            "note": "<ghi chú nếu cần>"
          }
        ],
        "overallMatch": <true nếu tất cả khay đều khớp>
      }
    ]
  }
}

Lưu ý:
- Tất cả nội dung bằng TIẾNG VIỆT
- Đánh số khay từ TRÊN xuống DƯỚI (khay 1 = tầng trên cùng)
- Nếu mặt kệ nhỏ (mini), vẫn liệt kê riêng
- Trả về JSON hợp lệ, không có text thêm`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-pro",
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
        analysis = { 
          score: 0, 
          status: "pending", 
          issues: ["Lỗi phân tích AI - không thể đọc kết quả"],
          summary: "Không thể phân tích hình ảnh. Vui lòng thử lại."
        };
      }

      // Validate and normalize AI response
      const normalizedAnalysis: any = {
        themeMatch: analysis.themeMatch || null,
        score: typeof analysis.score === "number" ? Math.min(100, Math.max(0, analysis.score)) : 0,
        status: ["compliant", "needs_review", "non_compliant"].includes(analysis.status) 
          ? analysis.status 
          : (analysis.score >= 90 ? "compliant" : analysis.score >= 70 ? "needs_review" : "non_compliant"),
        summary: analysis.summary || null,
        issues: Array.isArray(analysis.issues) ? analysis.issues : [],
        shelfComparison: analysis.shelfComparison || null,
      };

      // Validate and sanitize shelfComparison structure if present
      if (normalizedAnalysis.shelfComparison) {
        const sc = normalizedAnalysis.shelfComparison;
        sc.standardShelfCount = typeof sc.standardShelfCount === "number" ? sc.standardShelfCount : 0;
        sc.actualShelfCount = typeof sc.actualShelfCount === "number" ? sc.actualShelfCount : 0;
        sc.shelfCountMatch = sc.standardShelfCount === sc.actualShelfCount;
        sc.shelves = Array.isArray(sc.shelves) ? sc.shelves : [];
        
        // Sanitize each shelf and its trays
        sc.shelves = sc.shelves.map((shelf: any, idx: number) => ({
          shelfId: shelf.shelfId || `shelf_${idx + 1}`,
          shelfName: shelf.shelfName || `Mặt kệ ${idx + 1}`,
          standardTrayCount: typeof shelf.standardTrayCount === "number" ? shelf.standardTrayCount : 0,
          actualTrayCount: typeof shelf.actualTrayCount === "number" ? shelf.actualTrayCount : 0,
          trayCountMatch: shelf.standardTrayCount === shelf.actualTrayCount,
          trays: Array.isArray(shelf.trays) ? shelf.trays.map((tray: any, tIdx: number) => ({
            trayNumber: typeof tray.trayNumber === "number" ? tray.trayNumber : tIdx + 1,
            standardCategory: tray.standardCategory || "Không xác định",
            actualCategory: tray.actualCategory || "Không xác định",
            match: Boolean(tray.match),
            note: tray.note || null
          })) : [],
          overallMatch: Boolean(shelf.overallMatch)
        }));
      }

      // Force low score if theme doesn't match
      if (normalizedAnalysis.themeMatch && normalizedAnalysis.themeMatch.match === false) {
        normalizedAnalysis.score = Math.min(normalizedAnalysis.score, 20);
        normalizedAnalysis.status = "non_compliant";
      }

      // Create audit result
      const auditData = {
        taskId: parseInt(taskId),
        storeId: parseInt(storeId),
        actualImageUrl,
        score: normalizedAnalysis.score,
        status: normalizedAnalysis.status,
        aiAnalysis: JSON.stringify(normalizedAnalysis),
        issues: JSON.stringify(normalizedAnalysis.issues),
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
