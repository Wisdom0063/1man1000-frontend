import { DashboardLayout } from "@/components/dashboard-layout";

export default function InfluencerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout allowedRoles={["influencer"]}>{children}</DashboardLayout>
  );
}
