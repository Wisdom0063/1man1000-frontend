"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCampaignsControllerCreate,
  getCampaignsControllerFindAllQueryKey,
  CreateCampaignDto,
} from "@workspace/client";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CampaignForm } from "@/components/campaign-form";
import { type CampaignFormData } from "@/lib/schemas";

export default function CreateCampaignPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

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

      <CampaignForm
        submitLabel="Create Campaign"
        cancelHref="/admin/campaigns"
        isSubmitting={createMutation.isPending}
        onSubmit={onSubmit}
        isError={createMutation.isError}
        errorText="Failed to create campaign. Please try again."
      />
    </div>
  );
}
