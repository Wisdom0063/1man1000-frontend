"use client";

import { useMemo, useState } from "react";
import { useSurveysControllerGetInfluencerSurveys } from "@workspace/client";
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

const stats = {
  completed: 12,
  earnings: 145,
  avgRating: 4.8,
};

export default function InfluencerSurveysPage() {
  const [activeTab, setActiveTab] = useState("available");

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useSurveysControllerGetInfluencerSurveys();

  const surveys = useMemo(() => {
    const assignments = (response || []) as Array<any>;

    return assignments.map((a) => {
      const status =
        a.status === "completed"
          ? "completed"
          : a.status === "in_progress"
            ? "in_progress"
            : "available";

      return {
        id: a.surveyId || a.survey?.id,
        title: a.survey?.title,
        client: a.survey?.client?.name,
        reward: a.paymentAmount || a.survey?.paymentPerResponse || 0,
        duration: "",
        status,
        category: "Survey",
      };
    });
  }, [response]);

  const filteredSurveys = surveys.filter((s) => {
    if (activeTab === "available") return s.status === "available";
    if (activeTab === "in_progress") return s.status === "in_progress";
    if (activeTab === "completed") return s.status === "completed";
    return true;
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
            <div className="text-2xl font-bold">{stats.completed}</div>
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
            <div className="text-2xl font-bold">GH₵{stats.earnings}</div>
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
            <div className="text-2xl font-bold">{stats.avgRating}/5</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="available">
            Available
            <Badge variant="secondary" className="ml-2">
              {surveys.filter((s) => s.status === "available").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
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
                  <CardDescription>{survey.client}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{survey.duration}</span>
                  </div>

                  {survey.status === "available" && (
                    <Button className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      Start Survey
                    </Button>
                  )}
                  {survey.status === "in_progress" && (
                    <Button className="w-full" variant="secondary">
                      Continue Survey
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
