import type { Store, Category, Task, AuditResult } from "@shared/schema";

const API_BASE = "/api";

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Stores API
export const storesApi = {
  getAll: () => fetchApi<Store[]>("/stores"),
  getOne: (id: number) => fetchApi<Store>(`/stores/${id}`),
  create: (data: Partial<Store>) => 
    fetchApi<Store>("/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<Store>) =>
    fetchApi<Store>(`/stores/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchApi<void>(`/stores/${id}`, { method: "DELETE" }),
};

// Categories API
export const categoriesApi = {
  getAll: () => fetchApi<Category[]>("/categories"),
  create: (data: Partial<Category>) =>
    fetchApi<Category>("/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<Category>) =>
    fetchApi<Category>(`/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchApi<void>(`/categories/${id}`, { method: "DELETE" }),
};

// Tasks API
export const tasksApi = {
  getAll: () => fetchApi<Task[]>("/tasks"),
  getOne: (id: number) => fetchApi<Task>(`/tasks/${id}`),
  create: (data: FormData) =>
    fetchApi<Task>("/tasks", {
      method: "POST",
      body: data,
    }),
  update: (id: number, data: FormData) =>
    fetchApi<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: data,
    }),
  delete: (id: number) =>
    fetchApi<void>(`/tasks/${id}`, { method: "DELETE" }),
};

// Audit Results API
export const auditResultsApi = {
  getAll: (taskId?: number) => {
    const url = taskId ? `/audit-results?taskId=${taskId}` : "/audit-results";
    return fetchApi<AuditResult[]>(url);
  },
  create: (data: FormData) =>
    fetchApi<AuditResult>("/audit-results", {
      method: "POST",
      body: data,
    }),
  batchUpload: (data: FormData) =>
    fetchApi<{
      success: number;
      failed: number;
      results: any[];
      errors: any[];
    }>("/audit-results/batch", {
      method: "POST",
      body: data,
    }),
};
