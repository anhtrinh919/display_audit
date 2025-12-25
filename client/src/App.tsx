import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import TasksPage from "@/pages/TasksPage";
import AuditPage from "@/pages/AuditPage";
import ReportsPage from "@/pages/ReportsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={TasksPage} />
      <Route path="/audit/:id" component={AuditPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
