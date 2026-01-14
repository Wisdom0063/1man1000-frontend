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
import { Badge } from "@workspace/ui/components/badge";
import { ArrowLeft, TrendingUp, Users, CheckCircle } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import Link from "next/link";

export default function AdminSurveyAnalyticsPage() {
  const params = useParams();
  const surveyId = params.id as string;

  const {
    data: survey,
    isLoading,
    isError,
    refetch,
  } = useSurveysControllerFindOne(surveyId);

  if (isLoading) {
    return <LoadingState text="Loading analytics..." />;
  }

  if (isError || !survey) {
    return (
      <ErrorState
        title="Failed to load analytics"
        message="There was an error loading the survey analytics."
        onRetry={() => refetch()}
      />
    );
  }

  const progress =
    survey.targetResponses > 0
      ? (survey.responsesCollected / survey.targetResponses) * 100
      : 0;

  const completionRate = Math.min(progress, 100);
  const remainingResponses = Math.max(
    0,
    survey.targetResponses - survey.responsesCollected
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/surveys/${surveyId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Survey Analytics
          </h1>
          <p className="text-muted-foreground">{survey.title}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {survey.responsesCollected}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {survey.targetResponses} target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completionRate.toFixed(1)}%
            </div>
            <div className="mt-2 h-2 rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{remainingResponses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              responses needed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              GH₵
              {(
                (survey.paymentPerResponse || 0) * survey.responsesCollected
              ).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              @ GH₵{survey.paymentPerResponse || 0} per response
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Survey Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Client
              </h3>
              <p className="text-sm font-medium">
                {survey.client?.name || "Unknown"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </h3>
              <Badge>{survey.status}</Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Questions
              </h3>
              <p className="text-sm">
                {survey._count?.questions || survey.questions?.length || 0}{" "}
                questions
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Response Type
              </h3>
              <p className="text-sm">
                {survey.isAnonymous ? "Anonymous" : "Identified"}
              </p>
            </div>

            {survey.ageRange && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Age Range
                </h3>
                <p className="text-sm">{survey.ageRange}</p>
              </div>
            )}

            {survey.genderFilter && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Gender Filter
                </h3>
                <p className="text-sm">{survey.genderFilter}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {survey.responsesCollected === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Responses Yet</h3>
            <p className="text-muted-foreground">
              This survey hasn't received any responses yet. Check back later
              for analytics.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
