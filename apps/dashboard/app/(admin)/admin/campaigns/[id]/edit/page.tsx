"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCampaignsControllerFindOne,
  useCampaignsControllerUpdate,
  getCampaignsControllerFindAllQueryKey,
  getCampaignsControllerFindOneQueryKey,
  UpdateCampaignDto,
} from "@workspace/client";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CampaignForm } from "@/components/campaign-form";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { type CampaignFormData } from "@/lib/schemas";

export default function AdminEditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const campaignId = params.id as string;

  const {
    data: campaign,
    isLoading,
    isError,
    refetch,
  } = useCampaignsControllerFindOne(campaignId);

  const updateMutation = useCampaignsControllerUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getCampaignsControllerFindOneQueryKey(campaignId),
        });
        queryClient.invalidateQueries({
          queryKey: getCampaignsControllerFindAllQueryKey(),
        });
        router.push(`/admin/campaigns/${campaignId}`);
      },
    },
  });

  const defaultValues = useMemo((): Partial<CampaignFormData> | undefined => {
    if (!campaign) return undefined;

    const toDateInput = (value?: string | Date) => {
      if (!value) return undefined;
      const d = typeof value === "string" ? new Date(value) : value;
      if (Number.isNaN(d.getTime())) return undefined;
      return d.toISOString().slice(0, 10);
    };

    return {
      brandName: campaign.brandName,
      title: campaign.title || undefined,
      description: campaign.description || undefined,
      budget: campaign.budget,
      startDate: toDateInput(campaign.startDate),
      endDate: toDateInput(campaign.endDate),
      targetViewRange: campaign.targetViewRange as any,
      targetAudience: campaign.targetAudience,
      industry: campaign.industry,
      adCreatives: (campaign.adCreatives as any) || [],
      ratePerView: campaign.ratePerView,
      submissionDeadlineDays: campaign.submissionDeadlineDays,
      paymentType: campaign.paymentType as any,
      paymentViewsThreshold: campaign.paymentViewsThreshold,
    };
  }, [campaign]);

  if (isLoading) return <LoadingState text="Loading campaign..." />;

  if (isError || !campaign) {
    return (
      <ErrorState
        title="Failed to load campaign"
        message="There was an error loading the campaign."
        onRetry={() => refetch()}
      />
    );
  }

  const onSubmit = (data: CampaignFormData) => {
    updateMutation.mutate({
      id: campaignId,
      data: data as unknown as UpdateCampaignDto,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/campaigns/${campaignId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Campaign</h1>
          <p className="text-muted-foreground">Update your campaign details</p>
        </div>
      </div>

      <CampaignForm
        defaultValues={defaultValues}
        submitLabel="Save Changes"
        cancelHref={`/admin/campaigns/${campaignId}`}
        isSubmitting={updateMutation.isPending}
        onSubmit={onSubmit}
        isError={updateMutation.isError}
        errorText="Failed to update campaign. Please try again."
      />
    </div>
  );
}
