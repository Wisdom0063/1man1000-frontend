import { DashboardLayout } from "@/components/dashboard-layout";
import { InfluencerProfileGate } from "@/components/influencer-profile-gate";

export default function InfluencerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout allowedRoles={["influencer"]}>
      <InfluencerProfileGate>{children}</InfluencerProfileGate>
    </DashboardLayout>
  );
}
