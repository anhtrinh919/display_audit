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
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Hạng mục</h1>
            <p className="text-muted-foreground">Quản lý các chiến dịch kiểm tra và tiêu chuẩn trưng bày.</p>
          </div>
          
          <div className="flex gap-3">
             <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
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
                  <div className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors bg-muted/20">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <FileImage className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Kéo thả ảnh vào đây</h3>
                    <p className="text-sm text-muted-foreground">hoặc nhấn để chọn file</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-sm">
                       <div className="bg-background border px-3 py-1 rounded text-xs font-mono text-muted-foreground">bvi_promo.jpg</div>
                       <div className="bg-background border px-3 py-1 rounded text-xs font-mono text-muted-foreground">s002_display.png</div>
                       <div className="bg-background border px-3 py-1 rounded text-xs font-mono text-muted-foreground">store_55_xmas.jpg</div>
                    </div>
                  </div>
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex gap-3 items-start border border-blue-100">
                    <div className="mt-0.5">ℹ️</div>
                    <p>AI sẽ phân tích tên file để tự động gán vào đúng Mã Cửa hàng và Hạng mục. Ảnh không xác định sẽ được đưa vào "Hàng chờ Duyệt".</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Tiến hành Tải lên</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg hover:shadow-xl transition-all">
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
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Tên Hạng mục</Label>
                    <Input id="title" placeholder="VD: Trưng bày End-Cap Mùa Hè" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="desc">Mô tả / Hướng dẫn</Label>
                    <Textarea id="desc" placeholder="Mô tả các điểm cần kiểm tra..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="grid gap-2">
                      <Label htmlFor="date">Hạn chót</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="date" type="date" className="pl-9" />
                      </div>
                    </div>
                     <div className="grid gap-2">
                      <Label htmlFor="stores">Số lượng Cửa hàng</Label>
                      <Input id="stores" type="number" placeholder="24" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Ảnh Tiêu chuẩn</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Upload className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Nhấn để tải ảnh lên</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG tối đa 10MB</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Tạo Hạng mục</Button>
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
                <h3 className="font-semibold text-lg text-muted-foreground group-hover:text-foreground">Chiến dịch Mới</h3>
                <p className="text-sm text-muted-foreground/60 mt-1 max-w-[200px]">Tạo hạng mục kiểm tra mới và tải lên ảnh tham chiếu</p>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Tạo Hạng mục Kiểm tra</DialogTitle>
                <DialogDescription>
                  Thiết lập chiến dịch kiểm tra mới. Tải lên hình ảnh chuẩn (Best Practice).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title-card">Tên Hạng mục</Label>
                  <Input id="title-card" placeholder="VD: Trưng bày End-Cap Mùa Hè" />
                </div>
                {/* Simplified form for the card trigger */}
                <div className="grid gap-2">
                  <Label>Ảnh Tiêu chuẩn</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium">Nhấn để tải ảnh lên</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Tạo Hạng mục</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  );
}
