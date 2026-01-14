"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useSurveysControllerFindAll,
  useSurveysControllerUpdateStatus,
  UpdateSurveyStatusDtoStatus,
  SurveysListResponseDto,
} from "@workspace/client";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  BarChart3,
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
import Link from "next/link";

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-blue-100 text-blue-800",
  paused: "bg-gray-100 text-gray-800",
  rejected: "bg-red-100 text-red-800",
  approved: "bg-green-100 text-green-800",
};

const StatusBadge = ({ status }: { status: string }) => (
  <Badge className={statusColors[status as keyof typeof statusColors]}>
    {status}
  </Badge>
);

export default function AdminSurveysPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [surveys, setSurveys] = useState<SurveysListResponseDto["data"]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const queryParams: Record<string, string | number> = {};
  if (statusFilter && statusFilter !== "all") {
    queryParams.status = statusFilter;
  }

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useSurveysControllerFindAll({
    page,
    limit,
    ...queryParams,
  });

  useEffect(() => {
    if (response && !isLoading) {
      setSurveys(response.data || []);
    }
  }, [response, isLoading]);

  const updateStatusMutation = useSurveysControllerUpdateStatus({
    mutation: {
      onSuccess: () => {
        refetch();
      },
    },
  });

  const handleApprove = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to approve this survey?")) {
        try {
          await updateStatusMutation.mutateAsync({
            id,
            data: { status: UpdateSurveyStatusDtoStatus.approved },
          });
        } catch (error) {
          console.error("Error approving survey:", error);
        }
      }
    },
    [updateStatusMutation]
  );

  const handleReject = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to reject this survey?")) {
        try {
          await updateStatusMutation.mutateAsync({
            id,
            data: { status: UpdateSurveyStatusDtoStatus.rejected },
          });
        } catch (error) {
          console.error("Error rejecting survey:", error);
        }
      }
    },
    [updateStatusMutation]
  );

  const columns: ColumnDef<SurveysListResponseDto["data"][number]>[] = useMemo(
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
              Survey
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const survey = row.original;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{survey.title}</span>
              <span className="text-sm text-muted-foreground">
                {survey.client?.name || "Unknown"}
              </span>
            </div>
          );
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
        id: "responses",
        size: 150,
        header: "Responses",
        cell: ({ row }) => {
          const survey = row.original;
          const progress =
            ((survey.responsesCollected || 0) / (survey.targetResponses || 1)) *
            100;
          return (
            <div className="space-y-1">
              <div className="text-sm">
                <span className="font-medium">
                  {survey.responsesCollected || 0}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  / {survey.targetResponses}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary">
                <div
                  className="h-1.5 rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "paymentPerResponse",
        size: 100,
        header: "Reward",
        cell: ({ row }) => {
          const payment = row.original.paymentPerResponse;
          return payment ? `GH₵${payment.toLocaleString()}` : "N/A";
        },
      },
      {
        id: "questions",
        size: 100,
        header: "Questions",
        cell: ({ row }) => {
          const count = row.original._count?.questions || 0;
          return <span>{count}</span>;
        },
      },
      {
        accessorKey: "createdAt",
        size: 120,
        header: "Created",
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt);
          return <span className="text-sm">{date.toLocaleDateString()}</span>;
        },
      },
      {
        id: "actions",
        size: 60,
        header: "Actions",
        cell: ({ row }) => {
          const survey = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/admin/surveys/${survey.id}`);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/admin/surveys/${survey.id}/analytics`);
                  }}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/admin/surveys/${survey.id}/responses`);
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Responses
                </DropdownMenuItem>
                {survey.status === "pending" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-emerald-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(survey.id);
                      }}
                      disabled={updateStatusMutation.isPending}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(survey.id);
                      }}
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

  const SurveyFilter = useCallback(() => {
    return (
      <div className="flex items-center space-x-2 flex-1">
        <div className="relative flex-1 max-w-sm">
          <input
            placeholder="Search surveys..."
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
      <span className="ml-3 text-muted-foreground">Loading surveys...</span>
    </div>
  );

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Surveys</h1>
            <p className="text-muted-foreground">
              Manage and monitor platform surveys
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/surveys/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Survey
            </Link>
          </Button>
        </div>
        <div className="rounded-md border p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Failed to load surveys</h3>
          <p className="text-muted-foreground mb-4">
            There was an error loading surveys. Please try again.
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
          <h1 className="text-3xl font-bold">Surveys</h1>
          <p className="text-muted-foreground">
            Manage and monitor platform surveys
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/surveys/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Survey
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={surveys}
        showColumnVisibility={true}
        onRowClick={(survey) => router.push(`/admin/surveys/${survey.id}`)}
        FilterComponent={SurveyFilter}
        LoadingComponent={TableLoadingComponent}
        isLoading={isLoading && surveys.length === 0}
        pagination={{
          page,
          limit,
          total: (response?.meta as any)?.total,
          totalPages: (response?.meta as any)?.totalPages,
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
