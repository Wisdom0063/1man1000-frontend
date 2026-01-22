"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  useSurveysControllerGetInfluencerSurveys,
  useSurveysControllerGetInfluencerStats,
  useSurveysControllerGetAvailableSurveys,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { ClipboardList, Clock, CheckCircle, Star, Play } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

export default function InfluencerSurveysPage() {
  const [activeTab, setActiveTab] = useState("available");

  const {
    data: assignedResponse,
    isLoading: assignedLoading,
    isError: assignedError,
    refetch: refetchAssigned,
  } = useSurveysControllerGetInfluencerSurveys();

  const {
    data: availableResponse,
    isLoading: availableLoading,
    isError: availableError,
    refetch: refetchAvailable,
  } = useSurveysControllerGetAvailableSurveys();

  const { data: statsResponse, isLoading: statsLoading } =
    useSurveysControllerGetInfluencerStats();

  const stats = statsResponse || {
    completedSurveys: 0,
    totalEarnings: 0,
    averageRating: 0,
    inProgressCount: 0,
    availableCount: 0,
  };

  const assignedSurveys = useMemo(() => {
    const assignments = (assignedResponse || []) as Array<any>;

    return assignments.map((a) => {
      const status =
        a.status === "completed"
          ? "completed"
          : a.status === "in_progress"
            ? "in_progress"
            : "assigned";

      return {
        id: a.surveyId || a.survey?.id,
        title: a.survey?.title,
        client: a.survey?.client?.name,
        reward: a.paymentAmount || a.survey?.paymentPerResponse || 0,
        duration: `${a.survey?._count?.questions || 0} questions`,
        status,
        category: "Survey",
      };
    });
  }, [assignedResponse]);

  const availableSurveys = useMemo(() => {
    const surveys = (availableResponse || []) as Array<any>;

    return surveys.map((s) => ({
      id: s.id,
      title: s.title,
      client: s.client?.name,
      reward: s.paymentPerResponse || 0,
      duration: `${s._count?.questions || 0} questions`,
      status: "available",
      category: "Survey",
      description: s.description,
    }));
  }, [availableResponse]);

  const filteredSurveys = useMemo(() => {
    if (activeTab === "available") return availableSurveys;
    if (activeTab === "in_progress")
      return assignedSurveys.filter((s) => s.status === "in_progress");
    if (activeTab === "completed")
      return assignedSurveys.filter((s) => s.status === "completed");
    return [];
  }, [activeTab, availableSurveys, assignedSurveys]);

  if (assignedLoading || availableLoading || statsLoading) {
    return <LoadingState text="Loading surveys..." />;
  }

  if (assignedError || availableError) {
    return (
      <ErrorState
        title="Failed to load surveys"
        message="There was an error loading surveys."
        onRetry={() => {
          refetchAssigned();
          refetchAvailable();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Surveys</h1>
        <p className="text-muted-foreground">
          Complete surveys to earn extra income
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Surveys
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSurveys}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Survey Earnings
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GH₵{stats.totalEarnings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Response Quality
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}/5</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="available">
            Available
            <Badge variant="secondary" className="ml-2">
              {availableSurveys.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            In Progress
            {stats.inProgressCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {stats.inProgressCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({stats.completedSurveys})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredSurveys.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">No surveys found</p>
                <p className="text-sm text-muted-foreground">
                  {activeTab === "available"
                    ? "There are no available surveys at the moment. Check back later!"
                    : activeTab === "in_progress"
                      ? "You don't have any surveys in progress."
                      : "You haven't completed any surveys yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSurveys.map((survey) => (
                <Card key={survey.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{survey.category}</Badge>
                      <span className="text-lg font-bold text-green-600">
                        GH₵{survey.reward}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{survey.title}</CardTitle>
                    <CardDescription>
                      {survey.client}
                      {/* {survey.description && activeTab === "available" && (
                        <span className="block mt-2 text-xs">
                          {survey.description}
                        </span>
                      )} */}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{survey.duration}</span>
                    </div>

                    {survey.status === "available" && (
                      <Button className="w-full" asChild>
                        <Link href={`/influencer/surveys/${survey.id}/take`}>
                          <Play className="mr-2 h-4 w-4" />
                          Start Survey
                        </Link>
                      </Button>
                    )}
                    {survey.status === "in_progress" && (
                      <Button className="w-full" variant="secondary" asChild>
                        <Link href={`/influencer/surveys/${survey.id}/take`}>
                          Continue Survey
                        </Link>
                      </Button>
                    )}
                    {survey.status === "completed" && (
                      <Button className="w-full" variant="outline" disabled>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Completed
                      </Button>
                    )}
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
