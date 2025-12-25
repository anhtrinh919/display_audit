import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AuditTask } from "@/lib/mockData";
import { Calendar, ChevronRight, BarChart } from "lucide-react";
import { Link } from "wouter";

interface TaskCardProps {
  task: AuditTask;
}

export function TaskCard({ task }: TaskCardProps) {
  const statusColors = {
    active: "bg-primary/10 text-primary border-primary/20",
    completed: "bg-secondary/10 text-secondary border-secondary/20",
    draft: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-l-4 border-l-primary group">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className={statusColors[task.status]}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">{task.id}</span>
        </div>
        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
          {task.title}
        </h3>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pb-4 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>
        
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-16 rounded-md overflow-hidden border bg-muted">
            <img 
              src={task.standardImage} 
              alt="Standard" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span>Progress</span>
              <span>{Math.round((task.completedStores / task.totalStores) * 100)}%</span>
            </div>
            <Progress value={(task.completedStores / task.totalStores) * 100} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {task.completedStores} of {task.totalStores} stores audited
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 bg-muted/20 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Due {task.dueDate}</span>
        </div>
        <Link href={`/audit/${task.id}`}>
          <div className="flex items-center gap-1 font-medium text-primary hover:underline cursor-pointer">
            View Audit <ChevronRight className="w-3 h-3" />
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
}
