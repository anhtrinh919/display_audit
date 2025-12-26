import { AppLayout } from "@/components/layout/AppLayout";
import { AuditComparison } from "@/components/audit/AuditComparison";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Upload, Loader2, ImageIcon, X, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi, auditResultsApi, storesApi } from "@/lib/api";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AuditPage() {
  const [match, params] = useRoute("/audit/:id");
  const taskId = params?.id ? parseInt(params.id) : null;
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [auditImageFile, setAuditImageFile] = useState<File | null>(null);
  const [auditImagePreview, setAuditImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: task, isLoading: taskLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => tasksApi.getOne(taskId!),
    enabled: !!taskId,
  });

  const { data: auditResults = [], isLoading: resultsLoading } = useQuery({
    queryKey: ["audit-results", taskId],
    queryFn: () => auditResultsApi.getAll(taskId!),
    enabled: !!taskId,
  });

  const { data: stores = [] } = useQuery({
    queryKey: ["stores"],
    queryFn: storesApi.getAll,
  });

  const uploadMutation = useMutation({
    mutationFn: auditResultsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-results", taskId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      handleDialogClose();
      toast({ title: "Đã tải ảnh và phân tích AI thành công" });
    },
    onError: (error: Error) => toast({ title: error.message || "Lỗi khi tải ảnh", variant: "destructive" }),
  });

  const handleAuditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAuditImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAuditImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDialogClose = () => {
    setUploadDialogOpen(false);
    setSelectedStoreId("");
    setAuditImageFile(null);
    setAuditImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = () => {
    if (!auditImageFile || !selectedStoreId || !taskId) {
      toast({ title: "Vui lòng chọn cửa hàng và ảnh", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("taskId", String(taskId));
    formData.append("storeId", selectedStoreId);
    formData.append("actualImage", auditImageFile);

    uploadMutation.mutate(formData);
  };

  const currentResult = auditResults[selectedResultIndex];
  const currentStore = currentResult ? stores.find(s => s.id === currentResult.storeId) : null;

  if (taskLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!task) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <p className="text-muted-foreground">Không tìm thấy hạng mục</p>
          <Link href="/tasks">
            <Button>Quay lại danh sách</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="h-screen flex flex-col">
        <div className="px-6 py-4 border-b bg-card flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Link href="/tasks">
              <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-back">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg font-bold tracking-tight" data-testid="text-task-title">{task.title}</h1>
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-mono">{task.taskId}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {currentStore ? (
                  <>Đang kiểm tra: <span className="font-medium text-foreground">{currentStore.name}</span></>
                ) : (
                  <>Tiến độ: {task.completedStores} / {task.totalStores} cửa hàng</>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {auditResults.length > 1 && (
              <>
                <Button 
                  variant="outline" 
                  disabled={selectedResultIndex === 0}
                  onClick={() => setSelectedResultIndex(i => Math.max(0, i - 1))}
                  data-testid="button-prev"
                >
                  Cửa hàng Trước
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedResultIndex + 1} / {auditResults.length}
                </span>
                <Button 
                  variant="outline"
                  disabled={selectedResultIndex === auditResults.length - 1}
                  onClick={() => setSelectedResultIndex(i => Math.min(auditResults.length - 1, i + 1))}
                  data-testid="button-next"
                >
                  Cửa hàng Sau
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
              </>
            )}
            
            <Dialog open={uploadDialogOpen} onOpenChange={(open) => !open && handleDialogClose()}>
              <Button className="gap-2" onClick={() => setUploadDialogOpen(true)} data-testid="button-upload-audit">
                <Upload className="w-4 h-4" />
                Tải ảnh Kiểm tra
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tải ảnh Kiểm tra Trưng bày</DialogTitle>
                  <DialogDescription>
                    Chọn cửa hàng và tải ảnh thực tế để AI phân tích so sánh với tiêu chuẩn.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Cửa hàng</Label>
                    <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                      <SelectTrigger data-testid="select-store-upload">
                        <SelectValue placeholder="Chọn cửa hàng..." />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map(store => (
                          <SelectItem key={store.id} value={String(store.id)}>{store.name} ({store.storeId})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Ảnh Thực tế</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAuditImageSelect}
                      data-testid="input-audit-image"
                    />
                    {auditImagePreview ? (
                      <div className="relative border-2 border-primary rounded-lg overflow-hidden">
                        <img 
                          src={auditImagePreview} 
                          alt="Preview" 
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-8 gap-1"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-3 h-3" />
                            Đổi ảnh
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={() => {
                              setAuditImageFile(null);
                              setAuditImagePreview(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                          {auditImageFile?.name}
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="button-select-audit-image"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                          <ImageIcon className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm font-medium">Nhấn để chọn ảnh</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG tối đa 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleUpload} disabled={uploadMutation.isPending} data-testid="button-submit-upload">
                    {uploadMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Tải lên & Phân tích AI
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-hidden">
          {resultsLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : auditResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Chưa có kết quả kiểm tra</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Nhấn "Tải ảnh Kiểm tra" để tải lên ảnh thực tế từ cửa hàng và AI sẽ phân tích so sánh với tiêu chuẩn.
                </p>
              </div>
              <Button onClick={() => setUploadDialogOpen(true)} className="gap-2" data-testid="button-upload-first">
                <Upload className="w-4 h-4" />
                Tải ảnh Đầu tiên
              </Button>
            </div>
          ) : (
            <AuditComparison task={task} result={currentResult} store={currentStore} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
