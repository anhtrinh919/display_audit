import { AppLayout } from "@/components/layout/AppLayout";
import { TaskCard } from "@/components/audit/TaskCard";
import { mockTasks } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Calendar as CalendarIcon, FileImage, FolderOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TasksPage() {
  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Audit Tasks</h1>
            <p className="text-muted-foreground">Manage ongoing display audits and reference standards.</p>
          </div>
          
          <div className="flex gap-3">
             <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Batch Upload Photos
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Smart Batch Upload</DialogTitle>
                  <DialogDescription>
                    Upload display photos from store visits. We'll automatically map them to stores using filenames (e.g., "bvi_aisle1.jpg").
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors bg-muted/20">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <FileImage className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Drag & Drop Photos Here</h3>
                    <p className="text-sm text-muted-foreground">or click to browse files</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-sm">
                       <div className="bg-background border px-3 py-1 rounded text-xs font-mono text-muted-foreground">bvi_promo.jpg</div>
                       <div className="bg-background border px-3 py-1 rounded text-xs font-mono text-muted-foreground">s002_display.png</div>
                       <div className="bg-background border px-3 py-1 rounded text-xs font-mono text-muted-foreground">store_55_xmas.jpg</div>
                    </div>
                  </div>
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex gap-3 items-start border border-blue-100">
                    <div className="mt-0.5">ℹ️</div>
                    <p>AI will analyze filenames to auto-assign photos to the correct Store ID and Audit Task. Unmatched photos will be placed in the "Review Queue".</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Process Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg hover:shadow-xl transition-all">
                  <Plus className="w-4 h-4" />
                  Create New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Audit Task</DialogTitle>
                  <DialogDescription>
                    Set up a new display compliance campaign. Upload a best practice image as the standard.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input id="title" placeholder="e.g. Summer Soda End-Cap" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="desc">Description / Instructions</Label>
                    <Textarea id="desc" placeholder="Describe key compliance points..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="grid gap-2">
                      <Label htmlFor="date">Due Date</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="date" type="date" className="pl-9" />
                      </div>
                    </div>
                     <div className="grid gap-2">
                      <Label htmlFor="stores">Target Stores</Label>
                      <Input id="stores" type="number" placeholder="24" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Reference Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Upload className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Click to upload standard image</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          
          {/* Placeholder for creating new task visual */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center p-8 text-center hover:bg-muted/5 transition-colors cursor-pointer min-h-[300px] group">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-muted-foreground group-hover:text-foreground">New Campaign</h3>
                <p className="text-sm text-muted-foreground/60 mt-1 max-w-[200px]">Create a new audit task and upload reference images</p>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Audit Task</DialogTitle>
                <DialogDescription>
                  Set up a new display compliance campaign. Upload a best practice image as the standard.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title-card">Task Title</Label>
                  <Input id="title-card" placeholder="e.g. Summer Soda End-Cap" />
                </div>
                {/* Simplified form for the card trigger */}
                <div className="grid gap-2">
                  <Label>Reference Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium">Click to upload standard image</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  );
}
