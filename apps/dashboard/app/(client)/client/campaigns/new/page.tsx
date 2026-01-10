"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCampaignsControllerCreate,
  getCampaignsControllerGetClientCampaignsQueryKey,
  CreateCampaignDto,
} from "@workspace/client";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CampaignForm } from "@/components/campaign-form";
import { type CampaignFormData } from "@/lib/schemas";

export default function CreateClientCampaignPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useCampaignsControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getCampaignsControllerGetClientCampaignsQueryKey(),
        });
        router.push("/client/campaigns");
      },
    },
  });

  const onSubmit = (data: CampaignFormData) => {
    createMutation.mutate({ data: data as CreateCampaignDto });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/client/campaigns">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create New Campaign
          </h1>
          <p className="text-muted-foreground">
            Launch a new marketing campaign to reach your audience
          </p>
        </div>
      </div>

      <CampaignForm
        submitLabel="Create Campaign"
        cancelHref="/client/campaigns"
        isSubmitting={createMutation.isPending}
        onSubmit={onSubmit}
        isError={createMutation.isError}
        errorText="Failed to create campaign. Please check your details and try again."
        showBudgetEstimate
        containerClassName="space-y-6"
      />
    </div>
  );
}
