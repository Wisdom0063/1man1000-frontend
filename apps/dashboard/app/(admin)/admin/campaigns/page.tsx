"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCampaignsControllerFindAll,
  useCampaignsControllerUpdate,
  getCampaignsControllerFindAllQueryKey,
  UpdateCampaignDtoStatus,
} from "@workspace/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Eye,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Users,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import Link from "next/link";

export default function AdminCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useCampaignsControllerFindAll();
  const campaigns = (response || []) as Array<{
    id: string;
    brandName: string;
    title?: string;
    description?: string;
    client?: { id: string; name: string; email: string };
    budget: number;
    targetViewRange: { min: number; max: number };
    status: string;
    assignedInfluencers?: Array<{ id: string; influencer?: { name: string } }>;
    startDate: string;
    endDate: string;
    createdAt: string;
  }>;

  const updateStatusMutation = useCampaignsControllerUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getCampaignsControllerFindAllQueryKey(),
        });
      },
    },
  });

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.client?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCampaigns = filteredCampaigns.filter(
    (c) => c.status === "pending"
  );
  const activeCampaigns = filteredCampaigns.filter(
    (c) => c.status === "active" || c.status === "approved"
  );
  const completedCampaigns = filteredCampaigns.filter(
    (c) => c.status === "completed" || c.status === "rejected"
  );

  const handleApprove = (id: string) => {
    updateStatusMutation.mutate({
      id,
      data: { status: UpdateCampaignDtoStatus.approved },
    });
  };

  const handleReject = (id: string) => {
    updateStatusMutation.mutate({
      id,
      data: { status: UpdateCampaignDtoStatus.rejected },
    });
  };

  if (isLoading) {
    return <LoadingState text="Loading campaigns..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load campaigns"
        message="There was an error loading the campaigns. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => (
    <div className="p-4 rounded-xl border border-border/60 bg-card space-y-3 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">
            {campaign.title || campaign.brandName}
          </p>
          <p className="text-sm text-muted-foreground">
            {campaign.client?.name || "Unknown Client"} • {campaign.brandName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={campaign.status} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/campaigns/${campaign.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/campaigns/${campaign.id}/influencers`}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Influencers
                </Link>
              </DropdownMenuItem>
              {campaign.status === "pending" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-emerald-600"
                    onClick={() => handleApprove(campaign.id)}
                    disabled={updateStatusMutation.isPending}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleReject(campaign.id)}
                    disabled={updateStatusMutation.isPending}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{campaign.assignedInfluencers?.length || 0} influencers</span>
        </div>
        <div>
          <span className="text-muted-foreground">Target: </span>
          <span className="font-medium">
            {campaign.targetViewRange?.min?.toLocaleString()} -{" "}
            {campaign.targetViewRange?.max?.toLocaleString()} views
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Budget: </span>
          <span className="font-medium">
            GH₵{campaign.budget?.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {new Date(campaign.startDate).toLocaleDateString()} -{" "}
          {new Date(campaign.endDate).toLocaleDateString()}
        </span>
        <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Campaigns
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor all platform campaigns
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              Pending Approval
            </CardTitle>
            <CardDescription>
              {pendingCampaigns.length} campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingCampaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No pending campaigns
              </p>
            ) : (
              pendingCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              Active
            </CardTitle>
            <CardDescription>
              {activeCampaigns.length} campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeCampaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No active campaigns
              </p>
            ) : (
              activeCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gray-500" />
              Completed / Rejected
            </CardTitle>
            <CardDescription>
              {completedCampaigns.length} campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedCampaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No completed campaigns
              </p>
            ) : (
              completedCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
