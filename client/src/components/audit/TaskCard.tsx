import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, ChevronRight, ImageIcon } from "lucide-react";
import { Link } from "wouter";
import type { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const statusColors: Record<string, string> = {
    active: "bg-primary/10 text-primary border-primary/20",
    completed: "bg-secondary/10 text-secondary border-secondary/20",
    draft: "bg-muted text-muted-foreground border-border",
  };

  const statusLabels: Record<string, string> = {
    active: "Đang diễn ra",
    completed: "Hoàn thành",
    draft: "Nháp"
  };

  const progress = task.totalStores > 0 ? (task.completedStores / task.totalStores) * 100 : 0;
  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString("vi-VN") : "Không có";

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-l-4 border-l-primary group" data-testid={`card-task-${task.id}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className={statusColors[task.status] || statusColors.draft}>
            {statusLabels[task.status] || "Nháp"}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono" data-testid={`text-task-id-${task.id}`}>{task.taskId}</span>
        </div>
        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors" data-testid={`text-task-title-${task.id}`}>
          {task.title}
        </h3>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pb-4 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description || "Không có mô tả"}
        </p>
        
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-16 rounded-md overflow-hidden border bg-muted flex items-center justify-center">
            {task.standardImageUrl ? (
              <img 
                src={task.standardImageUrl} 
                alt="Standard" 
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span>Tiến độ</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {task.completedStores} / {task.totalStores} cửa hàng đã kiểm tra
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 bg-muted/20 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Hạn: {dueDate}</span>
        </div>
        <Link href={`/dashboard/${task.id}`}>
          <div className="flex items-center gap-1 font-medium text-primary hover:underline cursor-pointer" data-testid={`link-task-details-${task.id}`}>
            Xem Dashboard <ChevronRight className="w-3 h-3" />
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
}
