"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Megaphone,
  Eye,
  FileImage,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useCampaignsControllerGetDashboardStats } from "@workspace/client";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

export default function ClientDashboard() {
  const { data, isLoading, isError, refetch } =
    useCampaignsControllerGetDashboardStats();

  if (isLoading) return <LoadingState text="Loading dashboard..." />;

  if (isError || !data) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="There was an error loading your dashboard data."
        onRetry={() => refetch()}
      />
    );
  }

  const stats = [
    {
      title: "Active Campaigns",
      value: data.stats.activeCampaigns.toString(),
      icon: Megaphone,
      color: "text-blue-600",
    },
    {
      title: "Total Views",
      value: data.stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Submissions",
      value: data.stats.submissions.toString(),
      icon: FileImage,
      color: "text-orange-600",
    },
    {
      title: "Conversion Rate",
      value: data.stats.conversionRate,
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Client Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your campaigns and track performance
          </p>
        </div>
        <Button asChild>
          <Link href="/client/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Campaigns</CardTitle>
              <CardDescription>Track your active campaigns</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/client/campaigns">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentCampaigns.length > 0 ? (
                data.recentCampaigns.map((campaign) => {
                  const targetMax = (campaign.targetViewRange?.max ||
                    1) as number;
                  const progress = (campaign.totalViews / targetMax) * 100;

                  return (
                    <div key={campaign.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {campaign.title || campaign.brandName}
                        </span>
                        <Badge
                          variant={
                            campaign.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {campaign.totalViews.toLocaleString()} /{" "}
                        {targetMax.toLocaleString()} views
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No campaigns yet. Create your first campaign to get started!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Latest influencer submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentSubmissions.length > 0 ? (
                data.recentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-sm font-medium">
                      {(submission.influencer?.id || "INF")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {submission.influencer?.id || "Unknown Influencer"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {submission.campaign?.title ||
                          submission.campaign?.brandName}
                      </p>
                    </div>
                    <Badge variant="outline">{submission.status}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No submissions yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Views and engagement over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chart placeholder - Performance analytics will be displayed here
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
