import { LayoutDashboard, ClipboardList, BarChart3, Settings, LogOut, Search, Store, Tags } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Tổng quan", href: "/reports" },
    { icon: ClipboardList, label: "Hạng mục", href: "/" },
    { icon: Store, label: "Cửa hàng", href: "/stores" },
    { icon: Tags, label: "Danh mục", href: "/categories" },
    { icon: BarChart3, label: "Phân tích", href: "/analytics" },
    { icon: Settings, label: "Cài đặt", href: "/settings" },
  ];

  return (
    <div className="w-64 border-r bg-sidebar h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">DisplayAudit AI</span>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm..." className="pl-9 bg-background/50" />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Menu</div>
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t bg-muted/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent-foreground font-bold text-xs">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium truncate">Jane Doe</div>
            <div className="text-xs text-muted-foreground truncate">Quản lý Trade Marketing</div>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}
