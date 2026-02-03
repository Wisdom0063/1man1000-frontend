"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  useAuthControllerGetProfile,
  type ProfileResponseDto,
} from "@workspace/client";
import { useAuthStore } from "@/lib/auth-store";

interface InfluencerProfileGateProps {
  children: React.ReactNode;
}

export function InfluencerProfileGate({
  children,
}: InfluencerProfileGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const { data: profile, isLoading } = useAuthControllerGetProfile({
    query: {
      enabled: !!user && user.role === "influencer",
      staleTime: 15_000,
    },
  });

  useEffect(() => {
    if (!user) return;
    if (user.role !== "influencer") return;

    if (pathname === "/influencer/complete-profile") return;

    if (isLoading) return;

    const typedProfile = profile as ProfileResponseDto | undefined;
    const status = typedProfile?.status ?? user.status;
    const profileCompleted =
      typedProfile?.profileCompleted ?? user.profileCompleted;

    if (status === "approved" && profileCompleted === false) {
      router.push("/influencer/complete-profile");
    }
  }, [user, profile, isLoading, pathname, router]);

  return <>{children}</>;
}
