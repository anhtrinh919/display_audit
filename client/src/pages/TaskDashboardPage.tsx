import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Store,
  BarChart3,
  Image as ImageIcon,
  ChevronRight,
  Filter
} from "lucide-react";
import { tasksApi, auditResultsApi, storesApi } from "@/lib/api";
import type { Task, AuditResult, Store as StoreType } from "@shared/schema";

export default function TaskDashboardPage() {
  const [, params] = useRoute("/dashboard/:id");
  const taskId = params?.id ? parseInt(params.id) : null;
  const [statusFilter, setStatusFilter] = useState<"all" | "compliant" | "non_compliant" | "pending">("all");

  const { data: task, isLoading: taskLoading } = useQuery<Task>({
    queryKey: ["/api/tasks", taskId],
    queryFn: () => tasksApi.getOne(taskId!),
    enabled: !!taskId,
  });

  const { data: auditResults = [], isLoading: resultsLoading } = useQuery<AuditResult[]>({
    queryKey: ["/api/audit-results", { taskId }],
    queryFn: () => auditResultsApi.getAll(taskId!),
    enabled: !!taskId,
  });

  const { data: stores = [] } = useQuery<StoreType[]>({
    queryKey: ["/api/stores"],
    queryFn: () => storesApi.getAll(),
  });

  const storeMap = new Map(stores.map(s => [s.id, s]));

  const filteredResults = auditResults.filter(r => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  const metrics = {
    total: auditResults.length,
    compliant: auditResults.filter(r => r.status === "compliant").length,
    nonCompliant: auditResults.filter(r => r.status === "non_compliant").length,
    pending: auditResults.filter(r => r.status === "pending").length,
    avgScore: auditResults.length > 0 
      ? Math.round(auditResults.reduce((sum, r) => sum + (r.score || 0), 0) / auditResults.length) 
      : 0,
  };

  const getStatusBadge = (status: string, score: number | null) => {
    if (status === "compliant") {
      return <Badge className="bg-green-100 text-green-700 border-green-300">Đạt</Badge>;
    } else if (status === "pending") {
      return <Badge className="bg-gray-100 text-gray-700 border-gray-300">Chờ xử lý</Badge>;
    }
    return <Badge className="bg-red-100 text-red-700 border-red-300">Không Đạt</Badge>;
  };

  if (taskLoading || resultsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Không tìm thấy hạng mục</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                {task.standardImageUrl && (
                  <img 
                    src={task.standardImageUrl} 
                    alt="Standard" 
                    className="w-12 h-12 rounded-lg object-cover border-2 border-primary/20"
                  />
                )}
                <div>
                  <h1 className="text-xl font-bold">{task.title}</h1>
                  <p className="text-sm text-muted-foreground">{task.taskId}</p>
                </div>
              </div>
            </div>
            <Link href={`/audit/${taskId}`}>
              <Button data-testid="button-add-audit">
                + Thêm Kiểm tra
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Store className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{metrics.total}</p>
              <p className="text-xs text-muted-foreground">Cửa hàng đã kiểm tra</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{metrics.avgScore}%</p>
              <p className="text-xs text-muted-foreground">Điểm trung bình</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-green-600">{metrics.compliant}</p>
              <p className="text-xs text-muted-foreground">Đạt</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-gray-200">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-gray-500" />
              <p className="text-2xl font-bold text-gray-600">{metrics.pending}</p>
              <p className="text-xs text-muted-foreground">Chờ xử lý</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-red-200">
            <CardContent className="p-4 text-center">
              <XCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold text-red-600">{metrics.nonCompliant}</p>
              <p className="text-xs text-muted-foreground">Không Đạt</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Lọc:</span>
          <div className="flex gap-1">
            {[
              { value: "all", label: "Tất cả" },
              { value: "compliant", label: "Đạt" },
              { value: "non_compliant", label: "Không Đạt" },
              { value: "pending", label: "Chờ xử lý" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={statusFilter === option.value ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(option.value as typeof statusFilter)}
                data-testid={`filter-${option.value}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {filteredResults.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">Chưa có kết quả kiểm tra</h3>
            <p className="text-muted-foreground mb-4">Tải ảnh để bắt đầu kiểm tra cửa hàng</p>
            <Link href={`/audit/${taskId}`}>
              <Button>Thêm Kiểm tra</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredResults.map((result) => {
              const store = storeMap.get(result.storeId);
              return (
                <Link key={result.id} href={`/audit/${taskId}?store=${result.storeId}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm" data-testid={`store-card-${result.id}`}>
                    <div className="aspect-square relative">
                      {result.actualImageUrl ? (
                        <img 
                          src={result.actualImageUrl} 
                          alt={store?.name || "Store"} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(result.status, result.score)}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="text-white font-medium text-sm truncate">{store?.name || "Cửa hàng"}</p>
                        <p className="text-white/70 text-xs">{store?.storeId}</p>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-lg font-bold ${
                          (result.score || 0) >= 90 ? "text-green-600" : 
                          (result.score || 0) >= 70 ? "text-yellow-600" : "text-red-600"
                        }`}>
                          {result.score || 0}%
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
