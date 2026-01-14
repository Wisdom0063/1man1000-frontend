"use client";

import { useParams } from "next/navigation";
import { useSurveysControllerFindOne } from "@workspace/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, Users, Download } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import Link from "next/link";

export default function AdminSurveyResponsesPage() {
  const params = useParams();
  const surveyId = params.id as string;

  const {
    data: survey,
    isLoading,
    isError,
    refetch,
  } = useSurveysControllerFindOne(surveyId);

  if (isLoading) {
    return <LoadingState text="Loading responses..." />;
  }

  if (isError || !survey) {
    return (
      <ErrorState
        title="Failed to load responses"
        message="There was an error loading the survey responses."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/surveys/${surveyId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Survey Responses
            </h1>
            <p className="text-muted-foreground">{survey.title}</p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Responses
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {survey.responsesCollected}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Target Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{survey.targetResponses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Response Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {survey.isAnonymous ? "Anonymous" : "Identified"}
            </div>
          </CardContent>
        </Card>
      </div>

      {survey.responsesCollected === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Responses Yet</h3>
            <p className="text-muted-foreground">
              This survey hasn't received any responses yet. Check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Response Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">
                Detailed response data will be displayed here.
              </p>
              <p className="text-sm">
                This feature shows individual survey responses and aggregated
                data.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
