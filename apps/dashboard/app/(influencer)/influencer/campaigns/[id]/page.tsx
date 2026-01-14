"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CampaignAssetModal } from "@/components/campaign-asset-modal";
import { useCampaignsControllerFindOne } from "@workspace/client";
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
  Building2,
  Upload,
  Clock,
  Download,
  FileImage,
} from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import Link from "next/link";

type Campaign = {
  id: string;
  brandName: string;
  title?: string;
  description?: string;
  budget: number;
  targetViewRange: { min: number; max: number };
  targetAudience: string;
  industry: string;
  status: string;
  ratePerView?: number;
  startDate: string;
  endDate: string;
  campaignAsset?: string;
  submissionDeadlineDays?: number;
  adCreatives?: string[];
  client?: { id: string; name: string; email: string; company?: string };
  _count?: { assignments: number; submissions: number };
  createdAt: string;
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  approved: "bg-green-100 text-green-800",
};

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const [showAssetModal, setShowAssetModal] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useCampaignsControllerFindOne(campaignId);
  const campaign = response as Campaign | undefined;

  if (isLoading) {
    return <LoadingState text="Loading campaign details..." />;
  }

  if (isError || !campaign) {
    return (
      <ErrorState
        title="Failed to load campaign"
        message="There was an error loading the campaign details."
        onRetry={() => refetch()}
      />
    );
  }

  const potentialEarnings = {
    min: (campaign.targetViewRange?.min || 0) * (campaign.ratePerView || 0),
    max: (campaign.targetViewRange?.max || 0) * (campaign.ratePerView || 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/influencer/campaigns">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {campaign.title || campaign.brandName}
              </h1>
              <Badge
                className={
                  statusColors[campaign.status as keyof typeof statusColors] ||
                  "bg-gray-100 text-gray-800"
                }
              >
                {campaign.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {campaign.client?.company ||
                campaign.client?.name ||
                campaign.brandName}
            </p>
          </div>
        </div>
        <Button size="lg" asChild>
          <Link href={`/influencer/campaigns/${campaignId}/submit`}>
            <Upload className="h-4 w-4 mr-2" />
            Submit Work
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Target Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {campaign.targetViewRange?.min?.toLocaleString()} -{" "}
              {campaign.targetViewRange?.max?.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rate per View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-emerald-600">
              GH₵{campaign.ratePerView?.toFixed(3) || "0.000"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Potential Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              GH₵{potentialEarnings.min.toFixed(2)} - GH₵
              {potentialEarnings.max.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Campaign Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              GH₵{campaign.budget?.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {campaign.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Description
              </h3>
              <p className="text-sm">{campaign.description}</p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Target Audience
              </h3>
              <p className="text-sm">{campaign.targetAudience}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Industry
              </h3>
              <p className="text-sm">{campaign.industry}</p>
            </div>

            {campaign.submissionDeadlineDays && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Submission Deadline
                </h3>
                <p className="text-sm">
                  {campaign.submissionDeadlineDays} days after assignment
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                {new Date(campaign.endDate).toLocaleDateString()}
              </span>
            </div>
            {campaign._count && (
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{campaign._count.assignments} influencers assigned</span>
              </div>
            )}
            {campaign.client?.company && (
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                <span>{campaign.client.company}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {campaign.campaignAsset && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setShowAssetModal(true)}
              >
                {campaign.campaignAsset.match(/\.(mp4|webm|ogg)$/i) ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black/80">
                    <video
                      src={campaign.campaignAsset}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-4">
                        <svg
                          className="w-12 h-12 text-black"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={campaign.campaignAsset}
                    alt="Campaign asset"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAssetModal(true)}
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  View Full Size
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = campaign.campaignAsset!;
                    link.download = `${campaign.title || campaign.brandName}-asset`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Asset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {campaign.adCreatives && campaign.adCreatives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ad Creatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {campaign.adCreatives.map((url, index) => (
                <div
                  key={index}
                  className="aspect-video rounded-lg border overflow-hidden bg-muted"
                >
                  <img
                    src={url}
                    alt={`Ad creative ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-emerald-900">Ready to submit?</p>
              <p className="text-sm text-emerald-700">
                Once you have completed the campaign requirements and have your
                view count screenshot ready, click the &quot;Submit Work&quot;
                button to submit your work for review and earn your rewards.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {campaign.campaignAsset && showAssetModal && (
        <CampaignAssetModal
          assetUrl={campaign.campaignAsset}
          campaignTitle={campaign.title || campaign.brandName}
          isOpen={showAssetModal}
          onClose={() => setShowAssetModal(false)}
        />
      )}
    </div>
  );
}
