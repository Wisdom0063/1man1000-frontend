"use client";

import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Megaphone,
  FileImage,
  CreditCard,
  TrendingUp,
  Clock,
} from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

type AdminDashboardResponse = {
  stats: {
    totalUsers: number;
    activeCampaigns: number;
    pendingSubmissions: number;
    totalPaidPayments: number;
    pendingInfluencerApplications: number;
    pendingCampaignReviews: number;
  };
  pendingApprovals: {
    influencerApplications: number;
    campaignReviews: number;
    submissionReviews: number;
  };
  topInfluencers: Array<{ name: string; views: number }>;
  surveyStats: {
    running: number;
    pendingApproval: number;
    completedToday: number;
  };
  recentActivity: Array<{ action: string; user: string; createdAt: string }>;
};

export default function AdminDashboard() {
  const { data, isLoading, isError, refetch } =
    useQuery<AdminDashboardResponse>({
      queryKey: ["adminDashboard"],
      queryFn: async () => {
        const res = await axios.get<AdminDashboardResponse>(
          "/api/admin/dashboard",
        );
        return res.data;
      },
    });

  if (isLoading) return <LoadingState text="Loading admin dashboard..." />;

  if (isError || !data) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="There was an error loading admin dashboard data."
        onRetry={() => refetch()}
      />
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: data.stats.totalUsers.toLocaleString(),
      change: "—",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Campaigns",
      value: data.stats.activeCampaigns.toLocaleString(),
      change: "—",
      icon: Megaphone,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Pending Submissions",
      value: data.stats.pendingSubmissions.toLocaleString(),
      change: "—",
      icon: FileImage,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Total Payments",
      value: `GH₵${data.stats.totalPaidPayments.toLocaleString()}`,
      change: "—",
      icon: CreditCard,
      color: "text-violet-600",
      bgColor: "bg-violet-500/10",
    },
  ];

  const recentActivity = data.recentActivity.map((a) => ({
    action: a.action,
    user: a.user,
    time: new Date(a.createdAt).toLocaleString(),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform performance
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                    stat.change.startsWith("+")
                      ? "bg-emerald-500/10 text-emerald-600"
                      : stat.change.startsWith("-")
                        ? "bg-red-500/10 text-red-600"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="ml-2">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Platform Growth
            </CardTitle>
            <CardDescription>
              User registrations over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center rounded-xl bg-muted/50 border border-border/50">
              <div className="text-center">
                <TrendingUp className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Chart visualization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 mt-1.5 shadow-sm" />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">
                  Influencer Applications
                </span>
                <Badge className="bg-orange-500/15 text-orange-600 border-0">
                  {data.pendingApprovals.influencerApplications}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">Campaign Reviews</span>
                <Badge className="bg-blue-500/15 text-blue-600 border-0">
                  {data.pendingApprovals.campaignReviews}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">Submission Reviews</span>
                <Badge className="bg-violet-500/15 text-violet-600 border-0">
                  {data.pendingApprovals.submissionReviews}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Influencers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topInfluencers.map((inf, i) => (
                <div
                  key={`${inf.name}-${i}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white text-sm font-bold shadow-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{inf.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {inf.views.toLocaleString()} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Surveys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">Running</span>
                <Badge className="bg-emerald-500/15 text-emerald-600 border-0">
                  {data.surveyStats.running}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">Pending Approval</span>
                <Badge className="bg-yellow-500/15 text-yellow-600 border-0">
                  {data.surveyStats.pendingApproval}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">Completed Today</span>
                <Badge className="bg-blue-500/15 text-blue-600 border-0">
                  {data.surveyStats.completedToday}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
