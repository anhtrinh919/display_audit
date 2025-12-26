import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Maximize2, 
  Grid3X3, 
  Download, 
  Share2,
  ScanEye,
  ImageIcon,
  Layers,
  ListChecks
} from "lucide-react";
import { motion } from "framer-motion";
import type { Task, AuditResult, Store } from "@shared/schema";

interface ThemeMatch {
  standard: string;
  actual: string;
  match: boolean;
  comment: string;
}

interface ProductComparison {
  zone: string;
  standard: string;
  actual: string;
  match: boolean;
  note?: string;
}

interface AIAnalysis {
  themeMatch?: ThemeMatch;
  score: number;
  status: string;
  summary?: string;
  issues: string[];
  productComparison?: ProductComparison[];
  recommendations?: string[];
}

interface AuditComparisonProps {
  task: Task;
  result: AuditResult;
  store: Store | null | undefined;
}

export function AuditComparison({ task, result, store }: AuditComparisonProps) {
  const [showGrid, setShowGrid] = useState(true);
  const [activeIssue, setActiveIssue] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"issues" | "comparison" | "actions">("issues");

  const score = result.score || 0;
  
  const parseAIAnalysis = (): AIAnalysis => {
    const defaultAnalysis: AIAnalysis = { score: 0, status: "pending", issues: [] };
    
    if (result.aiAnalysis) {
      try {
        const parsed = JSON.parse(result.aiAnalysis);
        return { ...defaultAnalysis, ...parsed };
      } catch {
        // Fall back to issues field
      }
    }
    
    if (result.issues) {
      try {
        const issues = JSON.parse(result.issues);
        return { ...defaultAnalysis, issues: Array.isArray(issues) ? issues : [] };
      } catch {
        return defaultAnalysis;
      }
    }
    
    return defaultAnalysis;
  };

  const analysis = parseAIAnalysis();
  const storeName = store?.name || "Không xác định";
  const themeMatch = analysis.themeMatch;
  const issues = analysis.issues || [];
  const productComparison = analysis.productComparison || [];
  const recommendations = analysis.recommendations || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      <div className="lg:col-span-8 flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ScanEye className="w-5 h-5 text-primary" />
            Phân tích Hình ảnh
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              variant={showGrid ? "secondary" : "outline"} 
              size="sm" 
              onClick={() => setShowGrid(!showGrid)}
              className="gap-2"
              data-testid="button-toggle-grid"
            >
              <Grid3X3 className="w-4 h-4" />
              {showGrid ? "Ẩn Lưới" : "Hiện Lưới"}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Maximize2 className="w-4 h-4" />
              Mở rộng
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="relative rounded-xl overflow-hidden border-2 border-primary/20 shadow-sm bg-muted/30 group flex items-center justify-center">
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-primary/90 hover:bg-primary text-white backdrop-blur-sm shadow-sm">
                Tiêu chuẩn (Best Practice)
              </Badge>
            </div>
            {themeMatch && (
              <div className="absolute bottom-3 left-3 z-10">
                <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                  Theme: {themeMatch.standard}
                </Badge>
              </div>
            )}
            {task.standardImageUrl ? (
              <img 
                src={task.standardImageUrl} 
                alt="Standard" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="w-12 h-12" />
                <span className="text-sm">Chưa có ảnh tiêu chuẩn</span>
              </div>
            )}
          </div>

          <div className="relative rounded-xl overflow-hidden border-2 border-muted shadow-sm bg-muted/30 group flex items-center justify-center">
            <div className="absolute top-3 left-3 z-10">
              <Badge variant="secondary" className="bg-black/70 hover:bg-black/80 text-white backdrop-blur-sm shadow-sm">
                Thực tế: {storeName}
              </Badge>
            </div>
            
            {themeMatch && (
              <div className="absolute bottom-3 left-3 z-10">
                <Badge 
                  variant={themeMatch.match ? "outline" : "destructive"}
                  className={themeMatch.match ? "bg-white/90 backdrop-blur-sm" : ""}
                >
                  Theme: {themeMatch.actual}
                  {!themeMatch.match && " ⚠️"}
                </Badge>
              </div>
            )}
            
            {showGrid && (
              <div className="absolute inset-0 z-20 pointer-events-none audit-grid opacity-60 mix-blend-overlay" />
            )}

            {issues.slice(0, 5).map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (idx * 0.1) }}
                className={`absolute z-30 w-12 h-12 border-2 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  activeIssue === idx 
                    ? "border-destructive bg-destructive/20 scale-125 shadow-[0_0_15px_rgba(239,68,68,0.6)]" 
                    : "border-destructive/60 bg-transparent hover:border-destructive hover:bg-destructive/10"
                }`}
                style={{
                  top: `${15 + (idx * 12)}%`,
                  left: `${25 + (idx * 10)}%`,
                }}
                onClick={() => setActiveIssue(idx === activeIssue ? null : idx)}
              >
                <span className="bg-destructive text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {idx + 1}
                </span>
              </motion.div>
            ))}

            {result.actualImageUrl ? (
              <img 
                src={result.actualImageUrl} 
                alt="Actual" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="w-12 h-12" />
                <span className="text-sm">Chưa có ảnh thực tế</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-4 h-full overflow-hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Kết quả Kiểm tra</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Card className="flex-1 overflow-y-auto border-none shadow-none bg-transparent">
          <CardContent className="p-0 space-y-4">
            <div className="bg-card rounded-xl p-5 border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-muted-foreground">Điểm Tuân thủ</span>
                <span className={`text-2xl font-bold ${
                  score >= 90 ? "text-green-600" : score >= 70 ? "text-yellow-600" : "text-red-600"
                }`} data-testid="text-score">
                  {score}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 mb-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    score >= 90 ? "bg-green-500" : score >= 70 ? "bg-yellow-500" : "bg-red-500"
                  }`} 
                  style={{ width: `${score}%` }} 
                />
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                {score >= 90 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : score >= 70 ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium" data-testid="text-status">
                  {score >= 90 ? "Đạt" : score >= 70 ? "Cần cải thiện" : "Không Đạt"}
                </span>
              </div>
              {analysis.summary && (
                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">{analysis.summary}</p>
              )}
            </div>

            {themeMatch && !themeMatch.match && (
              <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 border border-red-200 dark:border-red-900">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">Theme không khớp!</h4>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      <strong>Tiêu chuẩn:</strong> {themeMatch.standard}<br/>
                      <strong>Thực tế:</strong> {themeMatch.actual}
                    </p>
                    {themeMatch.comment && (
                      <p className="text-sm text-red-600/80 dark:text-red-300/80 mt-2 italic">
                        {themeMatch.comment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              <Button 
                variant={activeTab === "issues" ? "secondary" : "ghost"} 
                size="sm" 
                className="flex-1 text-xs"
                onClick={() => setActiveTab("issues")}
              >
                Vấn đề ({issues.length})
              </Button>
              <Button 
                variant={activeTab === "comparison" ? "secondary" : "ghost"} 
                size="sm" 
                className="flex-1 text-xs"
                onClick={() => setActiveTab("comparison")}
              >
                So sánh ({productComparison.length})
              </Button>
              <Button 
                variant={activeTab === "actions" ? "secondary" : "ghost"} 
                size="sm" 
                className="flex-1 text-xs"
                onClick={() => setActiveTab("actions")}
              >
                Hành động ({recommendations.length})
              </Button>
            </div>

            {activeTab === "issues" && issues.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Lỗi phát hiện bởi AI
                </h3>
                {issues.map((issue, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      activeIssue === idx 
                        ? "bg-destructive/5 border-destructive shadow-sm ring-1 ring-destructive/20" 
                        : "bg-card hover:bg-accent/5 hover:border-accent/50"
                    }`}
                    onMouseEnter={() => setActiveIssue(idx)}
                    onMouseLeave={() => setActiveIssue(null)}
                    data-testid={`issue-${idx}`}
                  >
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-destructive/10 text-destructive text-xs font-bold flex items-center justify-center border border-destructive/20">
                        {idx + 1}
                      </span>
                      <p className="text-sm leading-relaxed">{issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "comparison" && productComparison.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  So sánh theo Khu vực
                </h3>
                {productComparison.map((comp, idx) => (
                  <div key={idx} className="p-3 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{comp.zone}</span>
                      {comp.match ? (
                        <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Khớp
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <XCircle className="w-3 h-3 mr-1" /> Khác
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-primary/5 rounded">
                        <span className="text-muted-foreground block mb-1">Tiêu chuẩn:</span>
                        {comp.standard}
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <span className="text-muted-foreground block mb-1">Thực tế:</span>
                        {comp.actual}
                      </div>
                    </div>
                    {comp.note && (
                      <p className="text-xs text-muted-foreground mt-2 italic">📝 {comp.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "actions" && recommendations.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <ListChecks className="w-4 h-4" />
                  Hành động Đề xuất
                </h3>
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 rounded-lg border bg-primary/5 border-primary/20">
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <p className="text-sm leading-relaxed">{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "issues" && issues.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p className="text-sm">Không phát hiện vấn đề!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
