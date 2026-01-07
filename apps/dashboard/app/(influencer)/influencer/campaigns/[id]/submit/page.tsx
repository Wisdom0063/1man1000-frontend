"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCampaignsControllerFindOne,
  useSubmissionsControllerCreate,
  getSubmissionsControllerGetInfluencerSubmissionsQueryKey,
  getCampaignsControllerGetInfluencerCampaignsQueryKey,
  CreateSubmissionDto,
} from "@workspace/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  ArrowLeft,
  Loader2,
  Upload,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { submissionSchema, type SubmissionFormData } from "@/lib/schemas";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

type Campaign = {
  id: string;
  brandName: string;
  title?: string;
  description?: string;
  targetViewRange: { min: number; max: number };
  ratePerView?: number;
  endDate: string;
};

export default function SubmitCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const campaignId = params.id as string;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    data: response,
    isLoading: campaignLoading,
    isError: campaignError,
  } = useCampaignsControllerFindOne(campaignId);
  const campaign = response?.data as Campaign | undefined;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      campaignId,
      extractedViewCount: 0,
    },
  });

  const submitMutation = useSubmissionsControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getSubmissionsControllerGetInfluencerSubmissionsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getCampaignsControllerGetInfluencerCampaignsQueryKey(),
        });
        router.push("/influencer/submissions");
      },
    },
  });

  const onSubmit = (data: SubmissionFormData) => {
    submitMutation.mutate({ data: data as CreateSubmissionDto });
  };

  const handleScreenshotUrlChange = (url: string) => {
    setValue("screenshotUrl", url);
    if (url && url.startsWith("http")) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  if (campaignLoading) {
    return <LoadingState text="Loading campaign details..." />;
  }

  if (campaignError || !campaign) {
    return (
      <ErrorState
        title="Campaign not found"
        message="The campaign you're looking for doesn't exist or you don't have access to it."
      />
    );
  }

  const c = campaign as Campaign;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/influencer/campaigns/${campaignId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Submit Your Work
          </h1>
          <p className="text-muted-foreground">{c.title || c.brandName}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campaign Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Target Views</p>
              <p className="font-semibold">
                {c.targetViewRange?.min?.toLocaleString()} -{" "}
                {c.targetViewRange?.max?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Rate per View</p>
              <p className="font-semibold text-emerald-600">
                GH₵{c.ratePerView?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Deadline</p>
            <p className="font-semibold">
              {new Date(c.endDate).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Screenshot Upload</CardTitle>
            <CardDescription>
              Provide a screenshot showing your view count for this campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="screenshotUrl">
                Screenshot URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="screenshotUrl"
                type="url"
                placeholder="https://example.com/screenshot.png"
                {...register("screenshotUrl")}
                onChange={(e) => handleScreenshotUrlChange(e.target.value)}
                className={errors.screenshotUrl ? "border-destructive" : ""}
              />
              {errors.screenshotUrl && (
                <p className="text-xs text-destructive">
                  {errors.screenshotUrl.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Upload your screenshot to an image hosting service and paste the
                URL here.
              </p>
            </div>

            {previewUrl && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="rounded-xl border border-border/60 overflow-hidden bg-muted/30">
                  <img
                    src={previewUrl}
                    alt="Screenshot preview"
                    className="w-full max-h-[300px] object-contain"
                    onError={() => setPreviewUrl(null)}
                  />
                </div>
              </div>
            )}

            {!previewUrl && (
              <div className="rounded-xl border-2 border-dashed border-border/60 p-8 text-center">
                <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Enter a screenshot URL above to see a preview
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View Count</CardTitle>
            <CardDescription>
              Enter the view count shown in your screenshot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="extractedViewCount">
                View Count <span className="text-destructive">*</span>
              </Label>
              <Input
                id="extractedViewCount"
                type="number"
                placeholder="Enter view count"
                {...register("extractedViewCount", { valueAsNumber: true })}
                className={
                  errors.extractedViewCount ? "border-destructive" : ""
                }
              />
              {errors.extractedViewCount && (
                <p className="text-xs text-destructive">
                  {errors.extractedViewCount.message}
                </p>
              )}
            </div>

            <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-700">Important</p>
                <p className="text-yellow-600">
                  Make sure the view count matches what's shown in your
                  screenshot. False submissions may result in account
                  suspension.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <input type="hidden" {...register("campaignId")} value={campaignId} />

        <div className="flex items-center justify-end gap-4 pt-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/influencer/campaigns/${campaignId}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={submitMutation.isPending}>
            {submitMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Submit for Review
          </Button>
        </div>

        {submitMutation.isError && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-center">
            <p className="text-sm text-destructive">
              Failed to submit. Please check your details and try again.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
