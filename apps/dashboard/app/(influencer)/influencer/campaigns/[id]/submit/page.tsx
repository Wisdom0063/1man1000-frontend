"use client";

import { useState, useCallback } from "react";
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
  X,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    data: response,
    isLoading: campaignLoading,
    isError: campaignError,
  } = useCampaignsControllerFindOne(campaignId);
  const campaign = response as Campaign | undefined;

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
    if (!selectedFile) {
      return;
    }

    // Create FormData to send file with submission data
    const formData = new FormData();
    formData.append("screenshot", selectedFile);
    formData.append("campaignId", data.campaignId);
    formData.append("extractedViewCount", data.extractedViewCount.toString());
    if (data.description) {
      formData.append("description", data.description);
    }

    submitMutation.mutate({
      data: formData as any,
    });
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setValue("screenshotUrl", url);
    },
    [setValue]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValue("screenshotUrl", "");
  }, [setValue]);

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
            {!previewUrl ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border/60 hover:border-border"
                }`}
              >
                <input
                  type="file"
                  id="screenshot-upload"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  {...register("screenshotUrl")}
                />
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium mb-1">
                  Drag and drop your screenshot here
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  or click to browse
                </p>
                <label htmlFor="screenshot-upload">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: JPG, PNG, GIF (Max 10MB)
                </p>
                {errors.screenshotUrl && (
                  <p className="text-xs text-destructive mt-2">
                    {errors.screenshotUrl.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Screenshot Preview</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
                <div className="rounded-xl border border-border/60 overflow-hidden bg-muted/30 relative">
                  <img
                    src={previewUrl}
                    alt="Screenshot preview"
                    className="w-full max-h-[400px] object-contain"
                  />
                </div>
                {selectedFile && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    <span>{selectedFile.name}</span>
                    <span>
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}
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
