"use client";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { Separator } from "@workspace/ui/components/separator";
import { AppSidebar } from "./app-sidebar";
import { AuthGuard } from "./auth-guard";
import type { UserRole } from "@/lib/auth-store";

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  breadcrumb?: React.ReactNode;
}

export function DashboardLayout({
  children,
  allowedRoles,
  breadcrumb,
}: DashboardLayoutProps) {
  return (
    <AuthGuard allowedRoles={allowedRoles}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-muted/30">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border/40 bg-background/80 backdrop-blur-xl px-6">
            <SidebarTrigger className="-ml-2 h-9 w-9 rounded-xl hover:bg-accent" />
            {breadcrumb && (
              <>
                <Separator orientation="vertical" className="mr-2 h-5" />
                {breadcrumb}
              </>
            )}
          </header>
          <main className="flex-1 overflow-auto p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
