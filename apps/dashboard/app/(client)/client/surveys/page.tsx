"use client";

import { useState } from "react";
import Link from "next/link";
import { useSurveysControllerGetClientSurveys } from "@workspace/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Plus, Eye, BarChart3, Users, ClipboardList } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  approved: "bg-green-100 text-green-800",
};

export default function ClientSurveysPage() {
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useSurveysControllerGetClientSurveys();

  const surveys = (response || []) as Array<{
    id: string;
    title: string;
    status: string;
    targetResponses: number;
    responsesCollected: number;
    paymentPerResponse?: number;
    createdAt: string;
  }>;

  const filteredSurveys = surveys.filter((s) => {
    if (activeTab === "all") return true;
    return s.status === activeTab;
  });

  if (isLoading) {
    return <LoadingState text="Loading surveys..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load surveys"
        message="There was an error loading your surveys."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Surveys</h1>
          <p className="text-muted-foreground">
            Create and manage your research surveys
          </p>
        </div>
        <Button asChild>
          <Link href="/client/surveys/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Survey
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Surveys
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {surveys.filter((s) => s.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Responses
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {surveys.reduce((acc, s) => acc + (s.responsesCollected || 0), 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {surveys.filter((s) => s.status === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredSurveys.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  {activeTab === "all"
                    ? "You haven't created any surveys yet."
                    : `No ${activeTab} surveys found.`}
                </p>
                <Button asChild>
                  <Link href="/client/surveys/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Survey
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredSurveys.map((survey) => (
                <Card key={survey.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{survey.title}</CardTitle>
                      <Badge
                        className={
                          statusColors[
                            survey.status as keyof typeof statusColors
                          ] || "bg-gray-100 text-gray-800"
                        }
                      >
                        {survey.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Created {new Date(survey.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Responses</span>
                        <span className="font-medium">
                          {survey.responsesCollected} / {survey.targetResponses}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{
                            width: `${Math.min((survey.responsesCollected / survey.targetResponses) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Reward per response
                      </span>
                      <span className="font-medium">
                        GH₵{survey.paymentPerResponse || 0}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/client/surveys/${survey.id}`}>
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/client/surveys/${survey.id}/analytics`}>
                          <BarChart3 className="mr-1 h-4 w-4" />
                          Analytics
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
