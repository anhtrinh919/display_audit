import { AppLayout } from "@/components/layout/AppLayout";
import { TaskCard } from "@/components/audit/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Calendar as CalendarIcon, FileImage, FolderOpen, Loader2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi, categoriesApi, storesApi, auditResultsApi } from "@/lib/api";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export default function TasksPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const standardImageRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.getAll,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const { data: stores = [] } = useQuery({
    queryKey: ["stores"],
    queryFn: storesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setCreateDialogOpen(false);
      toast({ title: "Tạo hạng mục thành công" });
    },
    onError: (error: Error) => toast({ title: error.message || "Lỗi khi tạo hạng mục", variant: "destructive" }),
  });

  const batchUploadMutation = useMutation({
    mutationFn: auditResultsApi.batchUpload,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["audit-results"] });
      setBatchDialogOpen(false);
      setSelectedFiles([]);
      setSelectedTaskId("");
      toast({ 
        title: `Tải lên thành công ${data.success} ảnh`,
        description: data.failed > 0 ? `${data.failed} ảnh thất bại` : undefined
      });
    },
    onError: (error: Error) => toast({ title: error.message || "Lỗi khi tải ảnh", variant: "destructive" }),
  });

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const file = standardImageRef.current?.files?.[0];
    if (file) {
      formData.set("standardImage", file);
    }
    
    const taskId = `T-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
    formData.set("taskId", taskId);
    
    createMutation.mutate(formData);
  };

  const handleBatchUpload = () => {
    if (!selectedTaskId || selectedFiles.length === 0) {
      toast({ title: "Vui lòng chọn hạng mục và ảnh", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("taskId", selectedTaskId);
    selectedFiles.forEach(file => {
      formData.append("images", file);
    });

    batchUploadMutation.mutate(formData);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Hạng mục</h1>
            <p className="text-muted-foreground">Quản lý các chiến dịch kiểm tra và tiêu chuẩn trưng bày.</p>
          </div>
          
          <div className="flex gap-3">
            <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2" data-testid="button-batch-upload">
                  <FolderOpen className="w-4 h-4" />
                  Tải ảnh hàng loạt
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Tải lên Thông minh</DialogTitle>
                  <DialogDescription>
                    Tải ảnh trưng bày từ các cửa hàng. Hệ thống sẽ tự động gán cửa hàng dựa trên tên file (VD: "bvi_aisle1.jpg").
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label>Chọn Hạng mục</Label>
                    <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                      <SelectTrigger data-testid="select-task-batch">
                        <SelectValue placeholder="Chọn hạng mục..." />
                      </SelectTrigger>
                      <SelectContent>
                        {tasks.map(task => (
                          <SelectItem key={task.id} value={String(task.id)}>{task.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div 
                    className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors bg-muted/20"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="dropzone-batch"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <FileImage className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Kéo thả ảnh vào đây</h3>
                    <p className="text-sm text-muted-foreground">hoặc nhấn để chọn file</p>
                    
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 text-sm text-primary font-medium">
                        Đã chọn {selectedFiles.length} ảnh
                      </div>
                    )}
                    
                    <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-sm">
                      <div className="bg-background border px-3 py-1 rounded text-xs font-mono text-muted-foreground">bvi_promo.jpg</div>
                      <div className="bg-background border px-3 py-1 rounded text-xs font-mono text-muted-foreground">s002_display.png</div>
                      <div className="bg-background border px-3 py-1 rounded text-xs font-mono text-muted-foreground">cgv_xmas.jpg</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex gap-3 items-start border border-blue-100">
                    <div className="mt-0.5">ℹ️</div>
                    <p>AI sẽ phân tích tên file để tự động gán vào đúng Mã Cửa hàng. Ví dụ: "bvi_display.jpg" sẽ được gán cho cửa hàng BVI.</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleBatchUpload}
                    disabled={batchUploadMutation.isPending || selectedFiles.length === 0}
                    data-testid="button-submit-batch"
                  >
                    {batchUploadMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Tiến hành Tải lên ({selectedFiles.length})
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg hover:shadow-xl transition-all" data-testid="button-create-task">
                  <Plus className="w-4 h-4" />
                  Tạo Hạng mục mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tạo Hạng mục Kiểm tra</DialogTitle>
                  <DialogDescription>
                    Thiết lập chiến dịch kiểm tra mới. Tải lên hình ảnh chuẩn (Best Practice).
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Tên Hạng mục</Label>
                      <Input id="title" name="title" placeholder="VD: Trưng bày End-Cap Mùa Hè" required data-testid="input-task-title" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Mô tả / Hướng dẫn</Label>
                      <Textarea id="description" name="description" placeholder="Mô tả các điểm cần kiểm tra..." data-testid="input-task-description" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="categoryId">Danh mục</Label>
                      <Select name="categoryId">
                        <SelectTrigger data-testid="select-task-category">
                          <SelectValue placeholder="Chọn danh mục..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="dueDate">Hạn chót</Label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input id="dueDate" name="dueDate" type="date" className="pl-9" data-testid="input-task-duedate" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="totalStores">Số lượng Cửa hàng</Label>
                        <Input id="totalStores" name="totalStores" type="number" placeholder={String(stores.length)} defaultValue={stores.length} data-testid="input-task-stores" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Ảnh Tiêu chuẩn</Label>
                      <div 
                        className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => standardImageRef.current?.click()}
                      >
                        <input
                          ref={standardImageRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          name="standardImage"
                        />
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                          <Upload className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm font-medium">Nhấn để tải ảnh lên</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG tối đa 10MB</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-task">
                      {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Tạo Hạng mục
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Chưa có hạng mục nào. Nhấn "Tạo Hạng mục mới" để bắt đầu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            
            <div 
              className="border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center p-8 text-center hover:bg-muted/5 transition-colors cursor-pointer min-h-[300px] group"
              onClick={() => setCreateDialogOpen(true)}
              data-testid="card-create-task"
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-muted-foreground group-hover:text-foreground">Chiến dịch Mới</h3>
              <p className="text-sm text-muted-foreground/60 mt-1 max-w-[200px]">Tạo hạng mục kiểm tra mới và tải lên ảnh tham chiếu</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
