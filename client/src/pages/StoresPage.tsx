import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, MapPin, MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storesApi } from "@/lib/api";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Store } from "@shared/schema";

export default function StoresPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: storesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: storesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      setDialogOpen(false);
      toast({ title: "Tạo cửa hàng thành công" });
    },
    onError: (error: Error) => toast({ title: error.message || "Lỗi khi tạo cửa hàng", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Store> }) => storesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      setDialogOpen(false);
      setEditingStore(null);
      toast({ title: "Cập nhật cửa hàng thành công" });
    },
    onError: () => toast({ title: "Lỗi khi cập nhật cửa hàng", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: storesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast({ title: "Xóa cửa hàng thành công" });
    },
    onError: () => toast({ title: "Lỗi khi xóa cửa hàng", variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      storeId: formData.get("storeId") as string,
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      manager: formData.get("manager") as string,
      active: true,
    };

    if (editingStore) {
      updateMutation.mutate({ id: editingStore.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.storeId.toLowerCase().includes(search.toLowerCase()) ||
      store.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Danh sách Cửa hàng</h1>
            <p className="text-muted-foreground">Quản lý mạng lưới cửa hàng và thông tin địa điểm.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingStore(null);
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-store">
                <Plus className="w-4 h-4" />
                Thêm Cửa hàng
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingStore ? "Chỉnh sửa" : "Thêm"} Cửa hàng</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="storeId">Mã cửa hàng</Label>
                    <Input id="storeId" name="storeId" defaultValue={editingStore?.storeId} required data-testid="input-store-id" />
                  </div>
                  <div>
                    <Label htmlFor="name">Tên cửa hàng</Label>
                    <Input id="name" name="name" defaultValue={editingStore?.name} required data-testid="input-store-name" />
                  </div>
                  <div>
                    <Label htmlFor="location">Khu vực</Label>
                    <Input id="location" name="location" defaultValue={editingStore?.location} required data-testid="input-store-location" />
                  </div>
                  <div>
                    <Label htmlFor="manager">Quản lý</Label>
                    <Input id="manager" name="manager" defaultValue={editingStore?.manager || ""} data-testid="input-store-manager" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit-store">
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingStore ? "Cập nhật" : "Tạo mới"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, ID..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-stores"
            />
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredStores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Không tìm thấy cửa hàng nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredStores.map((store) => (
                  <TableRow key={store.id} data-testid={`row-store-${store.id}`}>
                    <TableCell className="font-medium" data-testid={`text-store-id-${store.id}`}>{store.storeId}</TableCell>
                    <TableCell data-testid={`text-store-name-${store.id}`}>{store.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {store.location}
                      </div>
                    </TableCell>
                    <TableCell>{store.manager}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={store.active ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-700 border-gray-200"}
                      >
                        {store.active ? "Hoạt động" : "Ngưng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`button-actions-${store.id}`}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingStore(store);
                              setDialogOpen(true);
                            }}
                            data-testid={`button-edit-${store.id}`}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteMutation.mutate(store.id)}
                            data-testid={`button-delete-${store.id}`}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
