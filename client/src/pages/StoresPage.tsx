import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, MapPin, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { mockStores } from "@/lib/mockData";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function StoresPage() {
  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Danh sách Cửa hàng</h1>
            <p className="text-muted-foreground">Quản lý mạng lưới cửa hàng và thông tin địa điểm.</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm Cửa hàng
          </Button>
        </div>

        <div className="flex items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm theo tên, ID..." className="pl-9" />
          </div>
          <div className="flex gap-2">
             <Button variant="outline">Bộ lọc</Button>
             <Button variant="outline">Xuất Excel</Button>
          </div>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã CH</TableHead>
                <TableHead>Tên Cửa hàng</TableHead>
                <TableHead>Khu vực</TableHead>
                <TableHead>Quản lý</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.id}</TableCell>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {store.location}
                    </div>
                  </TableCell>
                  <TableCell>{store.manager}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Hoạt động</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {/* Additional Mock Rows for fullness */}
              <TableRow>
                  <TableCell className="font-medium">S005</TableCell>
                  <TableCell>Vincom Center A</TableCell>
                  <TableCell><div className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-3 h-3" />Quận 1, TP.HCM</div></TableCell>
                  <TableCell>Nguyen Van A</TableCell>
                  <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Hoạt động</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
