"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCampaignsControllerCreate,
  getCampaignsControllerFindAllQueryKey,
  CreateCampaignDto,
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
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { campaignSchema, type CampaignFormData } from "@/lib/schemas";

const industries = [
  "Technology",
  "Fashion",
  "Food & Beverage",
  "Health & Fitness",
  "Beauty",
  "Entertainment",
  "Finance",
  "Education",
  "Travel",
  "Automotive",
  "Real Estate",
  "Other",
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      ratePerView: 0.5,
      submissionDeadlineDays: 7,
      paymentType: "per_view",
      paymentViewsThreshold: 1000,
      targetViewRange: { min: 1000, max: 10000 },
    },
  });

  const createMutation = useCampaignsControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getCampaignsControllerFindAllQueryKey(),
        });
        router.push("/admin/campaigns");
      },
    },
  });

  const onSubmit = (data: CampaignFormData) => {
    createMutation.mutate({ data: data as CreateCampaignDto });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/campaigns">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Campaign</h1>
          <p className="text-muted-foreground">
            Create a new campaign for clients
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details of the campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brandName">
                  Brand Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="brandName"
                  placeholder="Enter brand name"
                  {...register("brandName")}
                  className={errors.brandName ? "border-destructive" : ""}
                />
                {errors.brandName && (
                  <p className="text-xs text-destructive">
                    {errors.brandName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  placeholder="Enter campaign title"
                  {...register("title")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Enter campaign description"
                {...register("description")}
                className="flex min-h-[100px] w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm shadow-sm transition-all placeholder:text-muted-foreground/70 hover:border-border focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="industry">
                  Industry <span className="text-destructive">*</span>
                </Label>
                <select
                  id="industry"
                  {...register("industry")}
                  className={`flex h-11 w-full rounded-xl border bg-background px-4 py-2 text-sm shadow-sm transition-all hover:border-border focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20 ${errors.industry ? "border-destructive" : "border-border/60"}`}
                >
                  <option value="">Select industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="text-xs text-destructive">
                    {errors.industry.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">
                  Target Audience <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Young adults 18-35"
                  {...register("targetAudience")}
                  className={errors.targetAudience ? "border-destructive" : ""}
                />
                {errors.targetAudience && (
                  <p className="text-xs text-destructive">
                    {errors.targetAudience.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget & Timeline</CardTitle>
            <CardDescription>
              Set the budget and campaign duration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="budget">
                  Budget (GH₵) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="5000"
                  {...register("budget", { valueAsNumber: true })}
                  className={errors.budget ? "border-destructive" : ""}
                />
                {errors.budget && (
                  <p className="text-xs text-destructive">
                    {errors.budget.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                  className={errors.startDate ? "border-destructive" : ""}
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  End Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  className={errors.endDate ? "border-destructive" : ""}
                />
                {errors.endDate && (
                  <p className="text-xs text-destructive">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="targetViewRange.min">
                  Min Target Views <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="targetViewRange.min"
                  type="number"
                  placeholder="1000"
                  {...register("targetViewRange.min", { valueAsNumber: true })}
                  className={
                    errors.targetViewRange?.min ? "border-destructive" : ""
                  }
                />
                {errors.targetViewRange?.min && (
                  <p className="text-xs text-destructive">
                    {errors.targetViewRange.min.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetViewRange.max">
                  Max Target Views <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="targetViewRange.max"
                  type="number"
                  placeholder="10000"
                  {...register("targetViewRange.max", { valueAsNumber: true })}
                  className={
                    errors.targetViewRange?.max ? "border-destructive" : ""
                  }
                />
                {errors.targetViewRange?.max && (
                  <p className="text-xs text-destructive">
                    {errors.targetViewRange.max.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>
              Configure payment rates for influencers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="paymentType">Payment Type</Label>
                <select
                  id="paymentType"
                  {...register("paymentType")}
                  className="flex h-11 w-full rounded-xl border border-border/60 bg-background px-4 py-2 text-sm shadow-sm transition-all hover:border-border focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20"
                >
                  <option value="per_view">Per View</option>
                  <option value="per_views">Per Views Threshold</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratePerView">Rate per View (GH₵)</Label>
                <Input
                  id="ratePerView"
                  type="number"
                  step="0.01"
                  placeholder="0.50"
                  {...register("ratePerView", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="paymentViewsThreshold">
                  Views Threshold (for per_views type)
                </Label>
                <Input
                  id="paymentViewsThreshold"
                  type="number"
                  placeholder="1000"
                  {...register("paymentViewsThreshold", {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="submissionDeadlineDays">
                  Submission Deadline (days)
                </Label>
                <Input
                  id="submissionDeadlineDays"
                  type="number"
                  placeholder="7"
                  {...register("submissionDeadlineDays", {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/campaigns">Cancel</Link>
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Create Campaign
          </Button>
        </div>

        {createMutation.isError && (
          <p className="text-sm text-destructive text-center">
            Failed to create campaign. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}
