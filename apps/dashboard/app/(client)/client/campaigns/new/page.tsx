"use client";

import { useState } from "react";
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
import axios from "axios";

export default function CreateClientCampaignPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);

  const createMutation = useCampaignsControllerCreate({
    mutation: {
      onSuccess: async (response, variables) => {
        // If there's a file, upload it after campaign creation
        const file = (variables as any).file;
        if (file && response.id) {
          setIsUploadingAsset(true);
          try {
            const formData = new FormData();
            formData.append("asset", file);

            const apiUrl =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            await axios.post(
              `${apiUrl}/api/campaigns/${response.id}/upload-asset`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } catch (error) {
            console.error("Error uploading asset:", error);
          } finally {
            setIsUploadingAsset(false);
          }
        }

        queryClient.invalidateQueries({
          queryKey: getCampaignsControllerGetClientCampaignsQueryKey(),
        });
        router.push("/client/campaigns");
      },
      onError: (error) => {
        console.error("Error creating campaign:", error);
      },
    },
  });

  const onSubmit = (data: CampaignFormData, file?: File) => {
    // Create campaign with JSON data only
    const campaignData: CreateCampaignDto = {
      ...data,
    } as CreateCampaignDto;

    // Store file reference for upload after creation
    createMutation.mutate({ data: campaignData, file } as any);
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
        isSubmitting={createMutation.isPending || isUploadingAsset}
        onSubmit={onSubmit}
        isError={createMutation.isError}
        errorText="Failed to create campaign. Please check your details and try again."
        showBudgetEstimate
        containerClassName="space-y-6"
      />
    </div>
  );
}
