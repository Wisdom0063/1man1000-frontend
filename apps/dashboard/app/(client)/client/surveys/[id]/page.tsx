"use client";

import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useSurveysControllerFindOne,
  useSurveysControllerDelete,
  getSurveysControllerGetClientSurveysQueryKey,
} from "@workspace/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  ArrowLeft,
  Calendar,
  Users,
  Trash2,
  BarChart3,
  Edit,
} from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";

type Survey = {
  id: string;
  title: string;
  description?: string;
  status: string;
  targetResponses: number;
  responsesCollected: number;
  isAnonymous: boolean;
  ageRange?: string;
  genderFilter?: string;
  locationFilter?: string[];
  paymentPerResponse?: number;
  client?: { id: string; name: string; email: string };
  questions?: Array<{
    id: string;
    questionText: string;
    questionType: string;
    questionOrder: number;
    isRequired: boolean;
    options?: string[];
    ratingScaleType?: string;
  }>;
  _count?: {
    questions?: number;
    responses?: number;
    assignments?: number;
  };
  createdAt: string;
  updatedAt: string;
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  approved: "bg-green-100 text-green-800",
};

export default function SurveyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const surveyId = params.id as string;

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useSurveysControllerFindOne(surveyId);
  const survey = response as Survey;

  const deleteMutation = useSurveysControllerDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getSurveysControllerGetClientSurveysQueryKey(),
        });
        router.push("/client/surveys");
      },
    },
  });

  if (isLoading) {
    return <LoadingState text="Loading survey details..." />;
  }

  if (isError || !survey) {
    return (
      <ErrorState
        title="Failed to load survey"
        message="There was an error loading the survey details."
        onRetry={() => refetch()}
      />
    );
  }

  const progress =
    survey.targetResponses > 0
      ? (survey.responsesCollected / survey.targetResponses) * 100
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/client/surveys">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {survey.title}
              </h1>
              <Badge
                className={
                  statusColors[survey.status as keyof typeof statusColors] ||
                  "bg-gray-100 text-gray-800"
                }
              >
                {survey.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {survey.client?.name || "Unknown Client"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {survey.status !== "approved" && survey.status !== "active" && (
            <Button variant="outline" asChild>
              <Link href={`/client/surveys/${surveyId}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          )}
          {survey.responsesCollected > 0 && (
            <Button variant="outline" asChild>
              <Link href={`/client/surveys/${surveyId}/analytics`}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Survey</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this survey? This action
                  cannot be undone and all responses will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate({ id: surveyId })}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {survey.responsesCollected} / {survey.targetResponses}
            </div>
            <div className="mt-2 h-2 rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {survey._count?.questions || survey.questions?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Payment Per Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              GH₵{survey.paymentPerResponse || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Survey Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {survey.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Description
              </h3>
              <p className="text-sm">{survey.description}</p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
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

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Created {new Date(survey.createdAt).toLocaleDateString()}
            </div>
            {survey._count?.assignments && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {survey._count.assignments} influencers assigned
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {survey.questions && survey.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions ({survey.questions.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {survey.questions
              .sort((a, b) => a.questionOrder - b.questionOrder)
              .map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Badge variant="outline">Q{index + 1}</Badge>
                    <div className="flex-1">
                      <p className="font-medium">{question.questionText}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {question.questionType.replace(/_/g, " ")}
                        </Badge>
                        {!question.isRequired && (
                          <Badge variant="outline" className="text-xs">
                            Optional
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {question.options && question.options.length > 0 && (
                    <div className="ml-8 mt-2 space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className="text-sm text-muted-foreground"
                        >
                          • {option}
                        </div>
                      ))}
                    </div>
                  )}

                  {question.ratingScaleType && (
                    <div className="ml-8 mt-2 text-sm text-muted-foreground">
                      Rating: {question.ratingScaleType.replace(/_/g, " ")}
                    </div>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
