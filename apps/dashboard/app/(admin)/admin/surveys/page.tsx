"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useSurveysControllerFindAll,
  useSurveysControllerUpdateStatus,
  getSurveysControllerFindAllQueryKey,
  UpdateSurveyStatusDtoStatus,
} from "@workspace/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  BarChart3,
  Users,
} from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-blue-100 text-blue-800",
  paused: "bg-gray-100 text-gray-800",
  rejected: "bg-red-100 text-red-800",
  approved: "bg-green-100 text-green-800",
};

export default function AdminSurveysPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const queryClient = useQueryClient();

  const statusParam = activeTab === "all" ? undefined : activeTab;

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useSurveysControllerFindAll({ status: statusParam });

  const surveys = (response as any)?.data || [];

  const updateStatusMutation = useSurveysControllerUpdateStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getSurveysControllerFindAllQueryKey({
            status: statusParam,
          }),
        });
      },
    },
  });

  const filteredSurveys = surveys.filter((survey: any) => {
    const matchesSearch =
      survey.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.client?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || survey.status === activeTab;
    return matchesSearch && matchesTab;
  });

  if (isLoading) {
    return <LoadingState text="Loading surveys..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load surveys"
        message="There was an error loading surveys."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Surveys</h1>
        <p className="text-muted-foreground">
          Manage and monitor platform surveys
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search surveys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2">
              {surveys.filter((s: any) => s.status === "pending").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Survey List</CardTitle>
              <CardDescription>
                {filteredSurveys.length} surveys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSurveys.map((survey) => (
                  <div
                    key={survey.id}
                    className="p-4 rounded-lg border space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{survey.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {survey.client?.name || "Unknown"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={
                            statusColors[
                              survey.status as keyof typeof statusColors
                            ]
                          }
                        >
                          {survey.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              View Responses
                            </DropdownMenuItem>
                            {survey.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() =>
                                    updateStatusMutation.mutate({
                                      id: survey.id,
                                      data: {
                                        status:
                                          UpdateSurveyStatusDtoStatus.approved,
                                      },
                                    })
                                  }
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    updateStatusMutation.mutate({
                                      id: survey.id,
                                      data: {
                                        status:
                                          UpdateSurveyStatusDtoStatus.rejected,
                                      },
                                    })
                                  }
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
                      <div>
                        <span className="text-muted-foreground">
                          Responses:{" "}
                        </span>
                        <span className="font-medium">
                          {survey.responsesCollected || 0}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          / {survey.targetResponses}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reward: </span>
                        <span className="font-medium">
                          GH₵{survey.paymentPerResponse || 0}
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        Created{" "}
                        {new Date(survey.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{
                          width: `${Math.min(((survey.responsesCollected || 0) / (survey.targetResponses || 1)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
