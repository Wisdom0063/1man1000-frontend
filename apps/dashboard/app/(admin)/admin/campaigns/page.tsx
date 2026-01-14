"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useCampaignsControllerFindAll,
  useCampaignsControllerUpdate,
  UpdateCampaignDtoStatus,
  CampaignsListResponseDto,
} from "@workspace/client";
import { Button } from "@workspace/ui/components/button";
import {
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Users,
  Plus,
  Loader2,
  ArrowUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { DataTable } from "@workspace/ui/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";

export default function AdminCampaignsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [campaigns, setCampaigns] = useState<CampaignsListResponseDto["data"]>(
    []
  );

  const queryParams: Record<string, string | number> = {};
  if (statusFilter && statusFilter !== "all") {
    queryParams.status = statusFilter;
  }

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useCampaignsControllerFindAll({
    page,
    limit,
    ...queryParams,
  });

  useEffect(() => {
    if (response && !isLoading) {
      setCampaigns(response.data || []);
    }
  }, [response, isLoading]);

  const updateStatusMutation = useCampaignsControllerUpdate({
    mutation: {
      onSuccess: () => {
        refetch();
      },
    },
  });

  const handleApprove = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to approve this campaign?")) {
        try {
          await updateStatusMutation.mutateAsync({
            id,
            data: { status: UpdateCampaignDtoStatus.approved },
          });
        } catch (error) {
          console.error("Error approving campaign:", error);
        }
      }
    },
    [updateStatusMutation]
  );

  const handleReject = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to reject this campaign?")) {
        try {
          await updateStatusMutation.mutateAsync({
            id,
            data: { status: UpdateCampaignDtoStatus.rejected },
          });
        } catch (error) {
          console.error("Error rejecting campaign:", error);
        }
      }
    },
    [updateStatusMutation]
  );

  const columns: ColumnDef<CampaignsListResponseDto["data"][number]>[] =
    useMemo(
      () => [
        {
          accessorKey: "title",
          size: 200,
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Campaign
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => {
            const campaign = row.original;
            return (
              <div className="flex flex-col">
                <span className="font-medium">
                  {campaign.title || campaign.brandName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {campaign.brandName}
                </span>
              </div>
            );
          },
        },
        {
          accessorKey: "client",
          size: 150,
          header: "Client",
          cell: ({ row }) => {
            const client = row.original.client;
            return client?.name || "Unknown";
          },
        },
        {
          accessorKey: "status",
          size: 100,
          header: "Status",
          cell: ({ row }) => {
            const status = row.original.status;
            return <StatusBadge status={status} />;
          },
        },
        {
          id: "influencers",
          size: 100,
          header: "Influencers",
          cell: ({ row }) => {
            const count = row.original.assignedInfluencers?.length || 0;
            return (
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{count}</span>
              </div>
            );
          },
        },
        {
          id: "targetViews",
          size: 150,
          header: "Target Views",
          cell: ({ row }) => {
            const range = row.original.targetViewRange;
            if (!range) return "N/A";
            return (
              <span className="text-sm">
                {range.min?.toLocaleString()} - {range.max?.toLocaleString()}
              </span>
            );
          },
        },
        {
          accessorKey: "budget",
          size: 100,
          header: "Budget",
          cell: ({ row }) => {
            const budget = row.original.budget;
            return budget ? `GH₵${budget.toLocaleString()}` : "N/A";
          },
        },
        {
          id: "dates",
          size: 150,
          header: "Campaign Period",
          cell: ({ row }) => {
            const campaign = row.original;
            return (
              <div className="text-sm">
                <div>{new Date(campaign.startDate).toLocaleDateString()}</div>
                <div className="text-muted-foreground">
                  {new Date(campaign.endDate).toLocaleDateString()}
                </div>
              </div>
            );
          },
        },
        {
          id: "actions",
          size: 60,
          header: "Actions",
          cell: ({ row }) => {
            const campaign = row.original;
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/admin/campaigns/${campaign.id}`)
                    }
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/admin/campaigns/${campaign.id}/influencers`)
                    }
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Manage Influencers
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
            );
          },
        },
      ],
      [router, updateStatusMutation.isPending, handleApprove, handleReject]
    );

  const CampaignFilter = useCallback(() => {
    return (
      <div className="flex items-center space-x-2 flex-1">
        <div className="relative flex-1 max-w-sm">
          <input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <select
          value={statusFilter || "all"}
          onChange={(e) => {
            const value = e.target.value;
            setStatusFilter(value === "all" ? "" : value);
            setPage(1);
          }}
          className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[180px]"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    );
  }, [searchQuery, statusFilter]);

  const TableLoadingComponent = () => (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <span className="ml-3 text-muted-foreground">Loading campaigns...</span>
    </div>
  );

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Campaigns</h1>
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
        <div className="rounded-md border p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">
            Failed to load campaigns
          </h3>
          <p className="text-muted-foreground mb-4">
            There was an error loading campaigns. Please try again.
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
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

      <DataTable
        columns={columns}
        data={campaigns}
        showColumnVisibility={true}
        onRowClick={(campaign) =>
          router.push(`/admin/campaigns/${campaign.id}`)
        }
        FilterComponent={CampaignFilter}
        LoadingComponent={TableLoadingComponent}
        isLoading={isLoading && campaigns.length === 0}
        pagination={{
          page,
          limit,
          total: (response?.meta?.total as number) ?? 0,
          totalPages: (response?.meta?.totalPages as number) ?? 0,
          onPageChange: (newPage) => setPage(newPage),
          onPageSizeChange: (newLimit) => {
            setLimit(newLimit);
            setPage(1);
          },
        }}
      />
    </div>
  );
}
