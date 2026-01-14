"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCampaignsControllerGetAvailableCampaigns } from "@workspace/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Search,
  Eye,
  Target,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

type Campaign = {
  id: string;
  brandName: string;
  title?: string;
  description?: string;
  budget: number;
  targetViewRange: { min: number; max: number };
  status: string;
  ratePerView?: number;
  startDate: string;
  endDate: string;
  client?: { name: string; company?: string };
  _count?: { assignments: number; submissions: number };
  createdAt: string;
};

export default function AvailableCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useCampaignsControllerGetAvailableCampaigns({ page, limit });

  const campaigns = (response?.data || []) as Campaign[];
  const totalPages = response?.meta?.totalPages || 1;

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  if (isLoading) {
    return <LoadingState text="Loading available campaigns..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load campaigns"
        message="There was an error loading available campaigns. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Available Campaigns
        </h1>
        <p className="text-muted-foreground">
          Browse and request to participate in active campaigns
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {campaigns.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              GH₵
              {campaigns
                .reduce((sum, c) => sum + (c.budget || 0), 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Rate per View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              GH₵
              {campaigns.length > 0
                ? (
                    campaigns.reduce(
                      (sum, c) => sum + (c.ratePerView || 0),
                      0
                    ) / campaigns.length
                  ).toFixed(3)
                : "0.000"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Campaigns Available
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "No campaigns match your search. Try different keywords."
                : "There are no available campaigns at the moment. Check back later!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg line-clamp-1">
                      {campaign.title || campaign.brandName}
                    </CardTitle>
                    <StatusBadge status={campaign.status} />
                  </div>
                  <CardDescription className="line-clamp-1">
                    {campaign.client?.company ||
                      campaign.client?.name ||
                      campaign.brandName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {campaign.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {campaign.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Target className="h-3.5 w-3.5" />
                        Target Views
                      </p>
                      <p className="text-sm font-semibold">
                        {campaign.targetViewRange?.min?.toLocaleString()} -{" "}
                        {campaign.targetViewRange?.max?.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" />
                        Rate per View
                      </p>
                      <p className="text-sm font-semibold text-emerald-600">
                        GH₵{campaign.ratePerView?.toFixed(3) || "0.000"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Campaign Period
                    </p>
                    <p className="text-sm">
                      {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  {campaign._count && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {campaign._count.assignments} influencers
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link
                        href={`/influencer/campaigns/available/${campaign.id}`}
                      >
                        <Eye className="mr-1.5 h-4 w-4" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {(totalPages as number) > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages as number}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((p) => Math.min(totalPages as number, p + 1))
                }
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
