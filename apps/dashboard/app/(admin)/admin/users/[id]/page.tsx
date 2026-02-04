"use client";

import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUsersControllerFindOne,
  useUsersControllerUpdateStatus,
  getUsersControllerFindAllQueryKey,
  getUsersControllerFindOneQueryKey,
  UpdateUserStatusDtoStatus,
} from "@workspace/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import {
  ArrowLeft,
  UserCheck,
  UserX,
  Ban,
  Mail,
  Phone,
  Building2,
  IdCard,
  GraduationCap,
  Briefcase,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { StatusBadge } from "@/components/ui/status-badge";

type User = {
  id: string;
  email: string;
  role: "client" | "influencer" | "admin" | string;
  status: "pending" | "approved" | "rejected" | string;
  name?: string;
  company?: string;
  phone?: string;
  publicInfluencerId?: string | null;
  mobileMoneyNumber?: string | null;
  mobileMoneyNetwork?: string | null;
  occupation?: string | null;
  isStudent?: boolean;
  schoolName?: string | null;
  gender?: string | null;
  ageBracket?: string | null;
  profileCompleted?: boolean;
  registrationDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

const FieldRow = ({ label, value }: { label: string; value?: string }) => {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right break-all">
        {value && value.length > 0 ? value : "—"}
      </span>
    </div>
  );
};

export default function AdminUserDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const userId = params.id as string;

  const { data, isLoading, isError, refetch } =
    useUsersControllerFindOne(userId);
  const user = data as unknown as User | undefined;

  const updateStatusMutation = useUsersControllerUpdateStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getUsersControllerFindOneQueryKey(userId),
        });
        queryClient.invalidateQueries({
          queryKey: getUsersControllerFindAllQueryKey(),
        });
      },
    },
  });

  const handleApprove = () => {
    updateStatusMutation.mutate({
      id: userId,
      data: { status: UpdateUserStatusDtoStatus.approved },
    });
  };

  const handleReject = () => {
    updateStatusMutation.mutate({
      id: userId,
      data: { status: UpdateUserStatusDtoStatus.rejected },
    });
  };

  const handleSuspend = () => {
    updateStatusMutation.mutate({
      id: userId,
      data: { status: "suspended" as unknown as UpdateUserStatusDtoStatus },
    });
  };

  const handleUnsuspend = () => {
    updateStatusMutation.mutate({
      id: userId,
      data: { status: UpdateUserStatusDtoStatus.approved },
    });
  };

  if (isLoading) return <LoadingState text="Loading user details..." />;

  if (isError || !user) {
    return (
      <ErrorState
        title="Failed to load user"
        message="There was an error loading the user details."
        onRetry={() => refetch()}
      />
    );
  }

  const isInfluencer = user.role === "influencer";
  const isClient = user.role === "client";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {user.name || user.company || "User"}
              </h1>
              <Badge variant="outline" className="capitalize border-border/60">
                {user.role}
              </Badge>
              <StatusBadge status={user.status} />
            </div>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user.status === "pending" && (
            <>
              <Button
                variant="outline"
                className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                onClick={handleApprove}
                disabled={updateStatusMutation.isPending}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="text-destructive border-destructive hover:bg-destructive/10"
                onClick={handleReject}
                disabled={updateStatusMutation.isPending}
              >
                <UserX className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}

          {user.status !== "suspended" ? (
            <Button
              variant="destructive"
              onClick={handleSuspend}
              disabled={updateStatusMutation.isPending}
            >
              <Ban className="h-4 w-4 mr-2" />
              Suspend
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
              onClick={handleUnsuspend}
              disabled={updateStatusMutation.isPending}
            >
              <Ban className="h-4 w-4 mr-2" />
              Unsuspend
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>Email</span>
            </div>
            <FieldRow label="Email" value={user.email} />
            <Separator />
            <div className="flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>Phone</span>
            </div>
            <FieldRow label="Phone" value={user.phone || undefined} />
            <Separator />
            <FieldRow label="Status" value={user.status} />
            <FieldRow
              label="Profile Completed"
              value={String(!!user.profileCompleted)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isClient && (
              <>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>Client</span>
                </div>
                <FieldRow
                  label="Company"
                  value={user.company || user.name || undefined}
                />
              </>
            )}

            {isInfluencer && (
              <>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                  <span>Influencer</span>
                </div>
                <FieldRow
                  label="Public Influencer ID"
                  value={user.publicInfluencerId || undefined}
                />
                <Separator />

                <div className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>Profile</span>
                </div>
                <FieldRow
                  label="Occupation"
                  value={user.occupation || undefined}
                />
                <FieldRow label="Gender" value={user.gender || undefined} />
                <FieldRow
                  label="Age Bracket"
                  value={user.ageBracket || undefined}
                />
                <FieldRow label="Is Student" value={String(!!user.isStudent)} />
                <FieldRow label="School" value={user.schoolName || undefined} />

                <Separator />

                <div className="flex items-center gap-2 text-sm font-medium">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span>Payment</span>
                </div>
                <FieldRow
                  label="Mobile Money Network"
                  value={user.mobileMoneyNetwork || undefined}
                />
                <FieldRow
                  label="Mobile Money Number"
                  value={user.mobileMoneyNumber || undefined}
                />
              </>
            )}

            {!isClient && !isInfluencer && (
              <>
                <FieldRow label="Role" value={user.role} />
                <FieldRow label="Company" value={user.company || undefined} />
              </>
            )}

            <Separator />
            <div className="flex items-center gap-2 text-sm font-medium">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span>Dates</span>
            </div>
            <FieldRow
              label="Created"
              value={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : undefined
              }
            />
            <FieldRow
              label="Updated"
              value={
                user.updatedAt
                  ? new Date(user.updatedAt).toLocaleString()
                  : undefined
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
