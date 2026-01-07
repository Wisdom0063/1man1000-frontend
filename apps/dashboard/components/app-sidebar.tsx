"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  FileImage,
  CreditCard,
  ClipboardList,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  BarChart3,
  UserCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useAuthStore } from "@/lib/auth-store";

const adminNavItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { title: "Submissions", href: "/admin/submissions", icon: FileImage },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Surveys", href: "/admin/surveys", icon: ClipboardList },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

const clientNavItems = [
  { title: "Dashboard", href: "/client", icon: LayoutDashboard },
  { title: "Campaigns", href: "/client/campaigns", icon: Megaphone },
  { title: "Submissions", href: "/client/submissions", icon: FileImage },
  { title: "Surveys", href: "/client/surveys", icon: ClipboardList },
  { title: "Analytics", href: "/client/analytics", icon: TrendingUp },
];

const influencerNavItems = [
  { title: "Dashboard", href: "/influencer", icon: LayoutDashboard },
  { title: "Campaigns", href: "/influencer/campaigns", icon: Megaphone },
  { title: "Submissions", href: "/influencer/submissions", icon: FileImage },
  { title: "Surveys", href: "/influencer/surveys", icon: ClipboardList },
  { title: "Earnings", href: "/influencer/earnings", icon: CreditCard },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const navItems =
    user?.role === "admin"
      ? adminNavItems
      : user?.role === "client"
        ? clientNavItems
        : influencerNavItems;

  const roleLabel =
    user?.role === "admin"
      ? "Admin Portal"
      : user?.role === "client"
        ? "Client Portal"
        : "Influencer Portal";

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border/50">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25">
            1K
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm text-sidebar-foreground">
              1man1000
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              {roleLabel}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/notifications"}
                  tooltip="Notifications"
                >
                  <Link href="/notifications">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/settings"}
                  tooltip="Settings"
                >
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent rounded-xl transition-all duration-200 hover:bg-sidebar-accent/80"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-sidebar-border/50">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs font-semibold">
                      {user?.name?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-semibold truncate max-w-[140px] text-sidebar-foreground">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-sidebar-foreground/60 truncate max-w-[140px]">
                      {user?.email}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width]"
              >
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
