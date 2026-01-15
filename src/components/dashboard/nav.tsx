"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  QrCode,
  LayoutDashboard,
  Store,
  Settings,
  LogOut,
  Menu,
  User,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface DashboardNavProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

const navItems = [
  {
    title: "Genel Bakış",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Restoranlar",
    href: "/dashboard/restoranlar",
    icon: Store,
  },
  {
    title: "Ayarlar",
    href: "/dashboard/ayarlar",
    icon: Settings,
  },
];

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-72 flex-col bg-background border-r">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <QrCode className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold text-lg tracking-tight">QRMenum</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            );
          })}

          {/* Quick Add Button */}
          <div className="pt-4">
            <Link href="/dashboard/restoranlar/yeni">
              <Button className="w-full rounded-xl h-10 justify-start gap-3" variant="outline">
                <Plus className="w-4 h-4" />
                Yeni Restoran
              </Button>
            </Link>
          </div>
        </nav>

        {/* User */}
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">{user.name || "Kullanıcı"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuItem asChild className="rounded-lg">
                <Link href="/dashboard/ayarlar" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Ayarlar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-destructive focus:text-destructive rounded-lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 glass border-b flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
            <QrCode className="w-4 h-4 text-background" />
          </div>
          <span className="font-semibold text-lg tracking-tight">QRMenum</span>
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            {/* Mobile Nav Content */}
            <div className="flex flex-col h-full">
              <div className="h-16 flex items-center px-6 border-b">
                <span className="font-semibold">Menü</span>
              </div>
              
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.title}
                    </Link>
                  );
                })}

                <div className="pt-4">
                  <Link href="/dashboard/restoranlar/yeni" onClick={() => setOpen(false)}>
                    <Button className="w-full rounded-xl h-11 justify-start gap-3" variant="outline">
                      <Plus className="w-4 h-4" />
                      Yeni Restoran
                    </Button>
                  </Link>
                </div>
              </nav>

              <div className="p-4 border-t">
                <div className="flex items-center gap-3 px-4 py-2.5 mb-4">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">{user.name || "Kullanıcı"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-xl h-11"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Çıkış Yap
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Mobile spacer */}
      <div className="lg:hidden h-16" />
    </>
  );
}
