"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  useSurveysControllerGetSurveyAnalytics,
  useSurveysControllerGetIndividualResponses,
} from "@workspace/client";

export default function AdminSurveyAnalyticsPage() {
  const params = useParams();
  const surveyId = params.id as string;
  const [activeTab, setActiveTab] = useState("summary");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: survey,
    isLoading,
    isError,
    refetch,
  } = useSurveysControllerGetSurveyAnalytics(surveyId);

  // Fetch individual responses with pagination
  const { data: responsesData } = useSurveysControllerGetIndividualResponses(
    surveyId,
    { page: currentPage, pageSize: 10 },
    { query: { enabled: activeTab === "responses" } },
  );

  if (isLoading) return <LoadingState text="Loading survey analytics..." />;
  if (isError || !survey)
    return (
      <ErrorState
        title="Failed to load analytics"
        message="Error loading analytics."
        onRetry={() => refetch()}
      />
    );

  const hasResponses = survey.responsesCollected > 0;

  const questionAnalytics = survey.answers.map((answer) => {
    const optionPercentages: Record<string, number> = {};
    const optionCounts: Record<string, number> = {};
    Object.entries(answer.distribution || {}).forEach(([key, data]) => {
      optionCounts[key] = (data as { count: number }).count;
      optionPercentages[key] = (data as { percentage: number }).percentage;
    });
    return {
      question: {
        id: answer.questionId,
        question_text: answer.questionText,
        question_type: answer.questionType,
        is_required: true,
      },
      totalResponses: answer.totalResponses,
      analytics: { optionCounts, optionPercentages },
    };
  });

  const paginatedResponses = responsesData?.responses || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/admin/surveys">
            <ChevronLeft className="h-4 w-4" />
            Back to Surveys
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{survey.title}</h1>
          <p className="text-muted-foreground mt-1">{survey.description}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="responses">Individual Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6 mt-6">
          {!hasResponses ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No responses yet. Check back later for analytics.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questionAnalytics.map((qa, index) => (
                <div key={qa.question.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    Q{index + 1}: {qa.question.question_text}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Type: {qa.question.question_type} | Responses:{" "}
                    {qa.totalResponses}
                  </p>
                  {Object.entries(qa.analytics.optionPercentages).map(
                    ([option, percentage]) => (
                      <div key={option} className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{option}</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="responses" className="space-y-6 mt-6">
          {!hasResponses ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No responses yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedResponses.map(
                (response: {
                  id: string;
                  responseDate: string;
                  answers?: Record<string, unknown>;
                }) => (
                  <div key={response.id} className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      {new Date(response.responseDate).toLocaleString()}
                    </p>
                    {Object.entries(response.answers || {}).map(
                      ([questionId, answer]) => (
                        <div key={questionId} className="mb-2">
                          <p className="text-sm">
                            {Array.isArray(answer)
                              ? answer.join(", ")
                              : String(answer)}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                ),
              )}
              {paginatedResponses.length > 0 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="py-2 px-4 text-sm">Page {currentPage}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={paginatedResponses.length < 10}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
