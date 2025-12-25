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
  ImageIcon
} from "lucide-react";
import { motion } from "framer-motion";
import type { Task, AuditResult, Store } from "@shared/schema";

interface AuditComparisonProps {
  task: Task;
  result: AuditResult;
  store: Store | null | undefined;
}

export function AuditComparison({ task, result, store }: AuditComparisonProps) {
  const [showGrid, setShowGrid] = useState(true);
  const [activeIssue, setActiveIssue] = useState<number | null>(null);

  const score = result.score || 0;
  const parseIssues = (issuesData: string | null | undefined): string[] => {
    if (!issuesData) return [];
    try {
      const parsed = JSON.parse(issuesData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const issues = parseIssues(result.issues);
  const storeName = store?.name || "Không xác định";

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
            
            {showGrid && (
              <div className="absolute inset-0 z-20 pointer-events-none audit-grid opacity-60 mix-blend-overlay" />
            )}

            {issues.map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (idx * 0.1) }}
                className={`absolute z-30 w-16 h-16 border-2 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  activeIssue === idx 
                    ? "border-destructive bg-destructive/20 scale-125 shadow-[0_0_15px_rgba(239,68,68,0.6)]" 
                    : "border-destructive/60 bg-transparent hover:border-destructive hover:bg-destructive/10"
                }`}
                style={{
                  top: `${20 + (idx * 15)}%`,
                  left: `${30 + (idx * 12)}%`,
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
                  score >= 90 ? "text-secondary" : score >= 70 ? "text-accent" : "text-destructive"
                }`} data-testid="text-score">
                  {score}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 mb-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    score >= 90 ? "bg-secondary" : score >= 70 ? "bg-accent" : "bg-destructive"
                  }`} 
                  style={{ width: `${score}%` }} 
                />
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                {score >= 90 ? (
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                ) : score >= 70 ? (
                  <AlertTriangle className="w-5 h-5 text-accent" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
                <span className="font-medium" data-testid="text-status">
                  {score >= 90 ? "Đạt (Tuyệt đối)" : score >= 70 ? "Đạt (Cần cải thiện)" : "Không Đạt"}
                </span>
              </div>
            </div>

            {issues.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Lỗi phát hiện bởi AI</h3>
                {issues.map((issue, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                      activeIssue === idx 
                        ? "bg-destructive/5 border-destructive shadow-sm ring-1 ring-destructive/20" 
                        : "bg-card hover:bg-accent/5 hover:border-accent/50"
                    }`}
                    onMouseEnter={() => setActiveIssue(idx)}
                    onMouseLeave={() => setActiveIssue(null)}
                    data-testid={`issue-${idx}`}
                  >
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 text-destructive text-xs font-bold flex items-center justify-center mt-0.5 border border-destructive/20">
                        {idx + 1}
                      </span>
                      <p className="text-sm leading-relaxed">{issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
              <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Hành động Đề xuất
              </h3>
              <ul className="text-sm space-y-2 text-foreground/80 list-disc list-inside">
                {score < 90 && <li>Điều chỉnh trưng bày theo tiêu chuẩn</li>}
                {score < 70 && <li>Liên hệ quản lý để được hỗ trợ</li>}
                {score >= 90 && <li>Duy trì chất lượng trưng bày hiện tại</li>}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ClipboardList(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 14h6" />
      <path d="M9 10h6" />
      <path d="M9 18h6" />
    </svg>
  );
}
