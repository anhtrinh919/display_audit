import bestPracticeImg from "@assets/generated_images/perfect_retail_display_standard.png";
import actualDisplayImg from "@assets/generated_images/messy_retail_display_actual.png";

export interface Store {
  id: string;
  name: string;
  location: string;
  manager: string;
}

export interface AuditTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  standardImage: string;
  status: "active" | "completed" | "draft";
  progress: number;
  totalStores: number;
  completedStores: number;
}

export interface AuditResult {
  id: string;
  taskId: string;
  storeId: string;
  storeName: string;
  date: string;
  score: number;
  status: "compliant" | "non_compliant" | "needs_review";
  actualImage: string;
  issues: string[];
}

export const mockStores: Store[] = [
  { id: "S001", name: "BVI Flagship", location: "Tortola", manager: "Sarah J." },
  { id: "S002", name: "Downtown Metro", location: "City Center", manager: "Mike R." },
  { id: "S003", name: "Westside Market", location: "West End", manager: "Lisa K." },
  { id: "S004", name: "Harbor Mall", location: "Harbor View", manager: "Tom B." },
];

export const mockTasks: AuditTask[] = [
  {
    id: "T-2025-001",
    title: "Christmas Promo End-Cap",
    description: "Verify Q4 festive chocolate display setup across all Tier 1 stores. Focus on red/gold theming and header signage visibility.",
    dueDate: "2025-12-30",
    standardImage: bestPracticeImg,
    status: "active",
    progress: 65,
    totalStores: 24,
    completedStores: 16,
  },
  {
    id: "T-2025-002",
    title: "Summer Refresh Beverage Stand",
    description: "New isotonic drink launch stand audit. Ensure cooler placement is near checkout.",
    dueDate: "2025-06-15",
    standardImage: bestPracticeImg, // Using same placeholder for mockup
    status: "draft",
    progress: 0,
    totalStores: 45,
    completedStores: 0,
  },
  {
    id: "T-2024-045",
    title: "Back to School Stationery",
    description: "Primary aisle gondola ends for BTS campaign.",
    dueDate: "2024-09-01",
    standardImage: bestPracticeImg,
    status: "completed",
    progress: 100,
    totalStores: 30,
    completedStores: 30,
  },
];

export const mockResults: AuditResult[] = [
  {
    id: "A-001",
    taskId: "T-2025-001",
    storeId: "S001",
    storeName: "BVI Flagship",
    date: "2025-12-15",
    score: 92,
    status: "compliant",
    actualImage: actualDisplayImg, // Using best practice as actual for compliant one
    issues: ["Minor spacing irregularity on bottom shelf"],
  },
  {
    id: "A-002",
    taskId: "T-2025-001",
    storeId: "S002",
    storeName: "Downtown Metro",
    date: "2025-12-16",
    score: 45,
    status: "non_compliant",
    actualImage: actualDisplayImg,
    issues: [
      "Missing header signage",
      "Product rows disorganized and mixed",
      "Empty gaps on eye-level shelf",
      "Wrong price tags displayed",
      "Lighting insufficient for display"
    ],
  },
  {
    id: "A-003",
    taskId: "T-2025-001",
    storeId: "S003",
    storeName: "Westside Market",
    date: "2025-12-16",
    score: 78,
    status: "needs_review",
    actualImage: actualDisplayImg,
    issues: ["Signage slightly crooked", "Stock levels low on top shelf"],
  }
];
