import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Tag, Search, MoreVertical } from "lucide-react";

export default function CategoriesPage() {
  const categories = [
    { id: 1, name: "Trưng bày Lễ hội (Festive)", desc: "Các chiến dịch theo mùa: Giáng sinh, Tết, Trung thu", count: 12 },
    { id: 2, name: "Ra mắt Sản phẩm mới (NPD)", desc: "Trưng bày kệ chính và đầu kệ cho sản phẩm mới", count: 8 },
    { id: 3, name: "Khuyến mãi (Promotion)", desc: "Khu vực khuyến mãi giảm giá, mua 1 tặng 1", count: 24 },
    { id: 4, name: "Trưng bày Cơ bản (Planogram)", desc: "Tuân thủ sơ đồ trưng bày hàng ngày", count: 156 },
    { id: 5, name: "POSM & Vật phẩm", desc: "Kiểm tra tình trạng biển bảng, wobbler, shelf-talker", count: 45 },
  ];

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Danh mục Nhiệm vụ</h1>
            <p className="text-muted-foreground">Phân loại và quản lý các loại hình kiểm tra trưng bày.</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm Danh mục
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Card key={cat.id} className="group hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary mb-2 inline-flex">
                    <Tag className="w-5 h-5" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{cat.name}</CardTitle>
                <CardDescription className="line-clamp-2">{cat.desc}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0 text-sm text-muted-foreground">
                {cat.count} nhiệm vụ đang hoạt động
              </CardFooter>
            </Card>
          ))}
          
           <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center p-8 text-center hover:bg-muted/5 transition-colors cursor-pointer min-h-[200px] group">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-muted-foreground group-hover:text-foreground">Tạo mới</h3>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
