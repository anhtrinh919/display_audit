import { AppLayout } from "@/components/layout/AppLayout";
import { AuditComparison } from "@/components/audit/AuditComparison";
import { mockResults, mockTasks } from "@/lib/mockData";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save } from "lucide-react";
import { Link } from "wouter";

export default function AuditPage() {
  const [match, params] = useRoute("/audit/:id");
  const taskId = params?.id;
  
  const task = mockTasks.find(t => t.id === taskId);
  // Simulating a specific result for demo - normally would select from a list
  const result = mockResults.find(r => r.taskId === taskId) || mockResults[1]; 

  if (!task) return <div>Task not found</div>;

  return (
    <AppLayout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-card flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg font-bold tracking-tight">{task.title}</h1>
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-mono">{task.id}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Auditing: <span className="font-medium text-foreground">{result.storeName}</span> • {result.date}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <Button variant="outline">
                Previous Store
             </Button>
             <Button variant="outline">
                Next Store
             </Button>
             <div className="w-px h-6 bg-border mx-1" />
             <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4" />
                Complete Audit
             </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <AuditComparison task={task} result={result} />
        </div>
      </div>
    </AppLayout>
  );
}
