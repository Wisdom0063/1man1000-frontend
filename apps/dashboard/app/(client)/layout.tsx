import { DashboardLayout } from "@/components/dashboard-layout";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout allowedRoles={["client"]}>{children}</DashboardLayout>
  );
}
