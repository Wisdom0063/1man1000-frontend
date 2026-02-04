"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CampaignAssetModal } from "@/components/campaign-asset-modal";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCampaignsControllerFindOne,
  useCampaignsControllerUpdate,
  useCampaignsControllerDelete,
  getCampaignsControllerFindOneQueryKey,
  getCampaignsControllerFindAllQueryKey,
  UpdateCampaignDtoStatus,
} from "@workspace/client";
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
  DollarSign,
  Target,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  UserPlus,
  Loader2,
  Download,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import Link from "next/link";
import VideoPlayerComponent from "@/components/video-player";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import Image from "next/image";

type Campaign = {
  id: string;
  brandName: string;
  title?: string;
  description?: string;
  client?: { id: string; name: string; email: string };
  budget: number;
  targetViewRange: { min: number; max: number };
  targetAudience: string;
  industry: string;
  status: string;
  ratePerView?: number;
  paymentType?: string;
  paymentViewsThreshold?: number;
  submissionDeadlineDays?: number;
  adCreatives?: string[];
  campaignAsset?: string;
  assignments?: Array<{
    id: string;
    influencer?: { id: string; name: string; email: string };
  }>;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const campaignId = params.id as string;
  const [showAssetModal, setShowAssetModal] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useCampaignsControllerFindOne(campaignId);
  const campaign = response;

  const updateMutation = useCampaignsControllerUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getCampaignsControllerFindOneQueryKey(campaignId),
        });
        queryClient.invalidateQueries({
          queryKey: getCampaignsControllerFindAllQueryKey(),
        });
      },
    },
  });

  const deleteMutation = useCampaignsControllerDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getCampaignsControllerFindAllQueryKey(),
        });
        router.push("/admin/campaigns");
      },
    },
  });

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

  const c = campaign as Campaign;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/campaigns">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {c.title || c.brandName}
              </h1>
              <StatusBadge status={c.status} />
            </div>
            <p className="text-muted-foreground">
              {c.brandName} • {c.client?.name || "Unknown Client"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {c.status === "pending" && (
            <>
              <Button
                variant="outline"
                className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                onClick={() =>
                  updateMutation.mutate({
                    id: campaignId,
                    data: { status: UpdateCampaignDtoStatus.approved },
                  })
                }
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Approve
              </Button>
              <Button
                variant="outline"
                className="text-destructive border-destructive hover:bg-destructive/10"
                onClick={() =>
                  updateMutation.mutate({
                    id: campaignId,
                    data: { status: UpdateCampaignDtoStatus.rejected },
                  })
                }
                disabled={updateMutation.isPending}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          <Button variant="outline" asChild>
            <Link href={`/admin/campaigns/${campaignId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this campaign? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate({ id: campaignId })}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              <span className="text-2xl font-bold">
                GH₵{c.budget?.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Target Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">
                {c.targetViewRange?.min?.toLocaleString()} -{" "}
                {c.targetViewRange?.max?.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Influencers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-600" />
              <span className="text-2xl font-bold">
                {c.assignments?.length || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span className="text-lg font-semibold">
                {new Date(c.startDate).toLocaleDateString()} -{" "}
                {new Date(c.endDate).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {c.description && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </h4>
                <p className="text-sm">{c.description}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Industry
                </h4>
                <Badge variant="outline">{c.industry}</Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Target Audience
                </h4>
                <p className="text-sm">{c.targetAudience}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Rate per View
                </h4>
                <p className="text-sm font-medium">
                  GH₵{c.ratePerView?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Payment Type
                </h4>
                <p className="text-sm font-medium capitalize">
                  {c.paymentType?.replace("_", " ") || "Per View"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Submission Deadline
                </h4>
                <p className="text-sm font-medium">
                  {c.submissionDeadlineDays || 7} days
                </p>
              </div>
            </div>

            {c.campaignAsset && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Campaign Asset
                </h4>
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-lg bg-muted max-w-2xl">
                    {c.campaignAsset.match(/\.(mp4|webm|ogg)$/i) ? (
                      <VideoPlayerComponent src={c.campaignAsset} />
                    ) : (
                      <img
                        src={c.campaignAsset}
                        alt="Campaign asset"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = c.campaignAsset!;
                      link.download = `${c.title || c.brandName}-asset`;
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
            )}

            {c.adCreatives && c.adCreatives.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Ad Creatives
                </h4>
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
                  {c.adCreatives.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg overflow-hidden border hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={url}
                        alt={`Creative ${index + 1}`}
                        className="w-full h-24 object-cover"
                        width={500}
                        height={500}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Assigned Influencers</CardTitle>
            <Button size="sm" asChild>
              <Link href={`/admin/campaigns/${campaignId}/influencers`}>
                <UserPlus className="h-4 w-4 mr-2" />
                Assign
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {!c.assignments || c.assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No influencers assigned yet
              </p>
            ) : (
              <div className="space-y-3">
                {c.assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-semibold">
                      {assignment.influencer?.name?.slice(0, 2).toUpperCase() ||
                        "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {assignment.influencer?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {assignment.influencer?.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {c.campaignAsset && showAssetModal && (
        <CampaignAssetModal
          assetUrl={c.campaignAsset}
          campaignTitle={c.title || c.brandName}
          isOpen={showAssetModal}
          onClose={() => setShowAssetModal(false)}
        />
      )}
    </div>
  );
}
