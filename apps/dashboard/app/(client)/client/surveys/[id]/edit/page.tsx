"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useSurveysControllerFindOne,
  useSurveysControllerUpdate,
  getSurveysControllerGetClientSurveysQueryKey,
  getSurveysControllerFindOneQueryKey,
  UpdateSurveyDto,
} from "@workspace/client";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SurveyForm } from "@/components/survey-form";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { type SurveyFormData } from "@/lib/survey-schemas";

export default function ClientEditSurveyPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const surveyId = params.id as string;

  const {
    data: survey,
    isLoading,
    isError,
    refetch,
  } = useSurveysControllerFindOne(surveyId);

  const updateMutation = useSurveysControllerUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getSurveysControllerFindOneQueryKey(surveyId),
        });
        queryClient.invalidateQueries({
          queryKey: getSurveysControllerGetClientSurveysQueryKey(),
        });
        router.push(`/client/surveys/${surveyId}`);
      },
    },
  });

  const defaultValues = useMemo((): Partial<SurveyFormData> | undefined => {
    if (!survey) return undefined;

    return {
      title: survey.title,
      description: survey.description || undefined,
      targetResponses: survey.targetResponses,
      isAnonymous: survey.isAnonymous ?? true,
      ageRange: survey.ageRange || undefined,
      genderFilter: survey.genderFilter || undefined,
      locationFilter: (survey.locationFilter as string[]) || undefined,
      paymentPerResponse: survey.paymentPerResponse || undefined,
      questions: (survey.questions || [])
        .sort((a, b) => a.questionOrder - b.questionOrder)
        .map((q) => ({
          questionText: q.questionText,
          questionType: q.questionType,
          questionOrder: q.questionOrder,
          isRequired: q.isRequired ?? true,
          options: q.options || undefined,
          imageUrls: q.imageUrls || undefined,
          ratingScaleType: q.ratingScaleType || undefined,
        })),
    };
  }, [survey]);

  if (isLoading) return <LoadingState text="Loading survey..." />;

  if (isError || !survey) {
    return (
      <ErrorState
        title="Failed to load survey"
        message="There was an error loading the survey."
        onRetry={() => refetch()}
      />
    );
  }

  const onSubmit = (data: SurveyFormData) => {
    const payload: UpdateSurveyDto = {
      title: data.title,
      description: data.description,
      targetResponses: data.targetResponses,
      isAnonymous: data.isAnonymous,
      ageRange: data.ageRange,
      genderFilter: data.genderFilter,
      locationFilter: data.locationFilter,
      paymentPerResponse: data.paymentPerResponse,
      questions: data.questions.map((q) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        questionOrder: q.questionOrder,
        isRequired: q.isRequired,
        options: q.options,
        imageUrls: q.imageUrls,
        ratingScaleType: q.ratingScaleType,
      })),
    };

    updateMutation.mutate({
      id: surveyId,
      data: payload,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/client/surveys/${surveyId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Survey</h1>
          <p className="text-muted-foreground">Update your survey details</p>
        </div>
      </div>

      <SurveyForm
        defaultValues={defaultValues}
        submitLabel="Save Changes"
        cancelHref={`/client/surveys/${surveyId}`}
        isSubmitting={updateMutation.isPending}
        onSubmit={onSubmit}
        isError={updateMutation.isError}
        errorText="Failed to update survey. Please try again."
      />
    </div>
  );
}
