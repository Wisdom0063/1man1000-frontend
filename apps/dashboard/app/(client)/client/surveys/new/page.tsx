"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useSurveysControllerCreate,
  getSurveysControllerGetClientSurveysQueryKey,
  CreateSurveyDto,
} from "@workspace/client";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SurveyForm } from "@/components/survey-form";
import { type SurveyFormData } from "@/lib/survey-schemas";

export default function CreateClientSurveyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useSurveysControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getSurveysControllerGetClientSurveysQueryKey(),
        });
        router.push("/client/surveys");
      },
    },
  });

  const onSubmit = (data: SurveyFormData) => {
    const payload: CreateSurveyDto = {
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
        questionType: q.questionType as any,
        questionOrder: q.questionOrder,
        isRequired: q.isRequired,
        options: q.options,
        imageUrls: q.imageUrls,
        ratingScaleType: q.ratingScaleType as any,
      })),
    };

    createMutation.mutate({ data: payload });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/client/surveys">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create New Survey
          </h1>
          <p className="text-muted-foreground">
            Design a survey to gather insights from your target audience
          </p>
        </div>
      </div>

      <SurveyForm
        submitLabel="Submit for Approval"
        cancelHref="/client/surveys"
        isSubmitting={createMutation.isPending}
        onSubmit={onSubmit}
        isError={createMutation.isError}
        errorText="Failed to create survey. Please check your details and try again."
      />
    </div>
  );
}
