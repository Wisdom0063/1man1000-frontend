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
  CreditCard,
  Star,
  ArrowRight,
  Upload,
  Clock,
  ClipboardList,
  Target,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import {
  useSurveysControllerGetAvailableSurveys,
  useSurveysControllerGetInfluencerStats,
  useCampaignsControllerGetInfluencerCampaigns,
  useCampaignsControllerGetAvailableCampaigns,
  usePaymentsControllerGetInfluencerPayments,
} from "@workspace/client";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

export default function InfluencerDashboard() {
  const {
    data: availableSurveysResponse,
    isLoading: isLoadingSurveys,
    isError: isErrorSurveys,
    refetch: refetchSurveys,
  } = useSurveysControllerGetAvailableSurveys();
  const {
    data: surveyStatsResponse,
    isLoading: isLoadingSurveyStats,
    isError: isErrorSurveyStats,
    refetch: refetchSurveyStats,
  } = useSurveysControllerGetInfluencerStats();
  const {
    data: campaignsResponse,
    isLoading: isLoadingMyCampaigns,
    isError: isErrorMyCampaigns,
    refetch: refetchMyCampaigns,
  } = useCampaignsControllerGetInfluencerCampaigns();
  const {
    data: availableCampaignsResponse,
    isLoading: isLoadingAvailableCampaigns,
    isError: isErrorAvailableCampaigns,
    refetch: refetchAvailableCampaigns,
  } = useCampaignsControllerGetAvailableCampaigns({ page: 1, limit: 6 });
  const {
    data: paymentsResponse,
    isLoading: isLoadingPayments,
    isError: isErrorPayments,
    refetch: refetchPayments,
  } = usePaymentsControllerGetInfluencerPayments();

  if (
    isLoadingSurveys ||
    isLoadingSurveyStats ||
    isLoadingMyCampaigns ||
    isLoadingAvailableCampaigns ||
    isLoadingPayments
  ) {
    return <LoadingState text="Loading dashboard..." />;
  }

  if (
    isErrorSurveys ||
    isErrorSurveyStats ||
    isErrorMyCampaigns ||
    isErrorAvailableCampaigns ||
    isErrorPayments
  ) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="There was an error loading your dashboard."
        onRetry={() => {
          refetchSurveys();
          refetchSurveyStats();
          refetchMyCampaigns();
          refetchAvailableCampaigns();
          refetchPayments();
        }}
      />
    );
  }

  const availableSurveys = (availableSurveysResponse || []) as Array<any>;
  const surveyStats = surveyStatsResponse || {
    completedSurveys: 0,
    totalEarnings: 0,
    averageRating: 0,
    inProgressCount: 0,
    availableCount: 0,
  };

  const campaigns = campaignsResponse?.data || [];
  const activeCampaignsCount = campaigns.filter(
    (c) => c.status === "active" || c.status === "approved",
  ).length;

  const availableCampaigns = availableCampaignsResponse?.data || [];
  const availableCampaignsPreview = availableCampaigns.slice(0, 3).map((c) => {
    const potentialMin = (c.targetViewRange?.min || 0) * (c.ratePerView || 0);
    const potentialMax = (c.targetViewRange?.max || 0) * (c.ratePerView || 0);
    return {
      id: c.id,
      name: c.title || c.brandName,
      brand: c.client?.name || c.client?.name || c.brandName,
      ratePerView: c.ratePerView || 0,
      potential: { min: potentialMin, max: potentialMax },
      status: c.status,
    };
  });

  const activeCampaigns = campaigns
    .filter((c: any) => c.status === "active" || c.status === "approved")
    .slice(0, 3)
    .map((c: any) => {
      const endDate = new Date(c.endDate);
      const now = new Date();
      const daysLeft = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      return {
        id: c.id,
        name: c.title || c.brandName,
        brand: c.brandName,
        deadline: daysLeft > 0 ? `${daysLeft} days left` : "Expired",
        status: c.assignmentStatus || "assigned",
      };
    });

  const payments = (paymentsResponse || []) as Array<any>;
  const earnings = payments
    .filter((p: any) => p.status === "paid")
    .slice(0, 3)
    .map((p: any) => ({
      campaign: p.campaign?.title || p.campaign?.brandName || "Campaign",
      amount: p.totalAmount,
      date: new Date(p.paymentDate || p.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }));

  const totalEarnings = payments
    .filter((p: any) => p.status === "paid")
    .reduce((sum: number, p: any) => sum + (p.totalAmount || 0), 0);

  const totalViews = campaigns.reduce(
    (sum: number, c: any) => sum + (c.totalViews || 0),
    0,
  );

  const stats = [
    {
      title: "Active Campaigns",
      value: activeCampaignsCount.toString(),
      icon: Megaphone,
      color: "text-blue-600",
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Earnings",
      value: `GH₵${totalEarnings.toFixed(2)}`,
      icon: CreditCard,
      color: "text-purple-600",
    },
    {
      title: "Rating",
      value: surveyStats.averageRating.toFixed(1),
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Influencer Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your campaigns and earnings
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Surveys
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {surveyStats.completedSurveys}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              GH₵{surveyStats.totalEarnings} earned
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>Campaigns you're working on</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/influencer/campaigns">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activeCampaigns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No active campaigns</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {campaign.brand}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {campaign.deadline}
                      </span>
                      {campaign.status === "pending_submission" ? (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/influencer/campaigns/${campaign.id}`}>
                            <Upload className="mr-1 h-3 w-3" />
                            Submit
                          </Link>
                        </Button>
                      ) : (
                        <Badge
                          variant={
                            campaign.status === "in_progress" ||
                            campaign.status === "accepted"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {campaign.status.replace("_", " ")}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Available Campaigns</CardTitle>
              <CardDescription>New campaigns you can join</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/influencer/campaigns/available">
                Browse
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {availableCampaignsPreview.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No campaigns available right now</p>
                <p className="text-xs mt-1">
                  Check back soon for new opportunities.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableCampaignsPreview.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {campaign.name as string}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {campaign.brand as string}
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          GH₵{Number(campaign.ratePerView || 0).toFixed(3)}/view
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          GH₵{campaign.potential.min.toFixed(2)} - GH₵
                          {campaign.potential.max.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link
                          href={`/influencer/campaigns/available/${campaign.id}`}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Earnings</CardTitle>
            <CardDescription>Your payment history</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/influencer/earnings">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {earnings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No earnings yet</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {earnings.map((earning, index) => (
                  <div
                    key={`${earning.campaign}-${index}`}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{earning.campaign}</p>
                      <p className="text-xs text-muted-foreground">
                        {earning.date}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      +GH₵{earning.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Earnings</span>
                  <span className="text-lg font-bold">
                    GH₵{totalEarnings.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Available Surveys</CardTitle>
            <CardDescription>
              Complete surveys to earn extra income
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/influencer/surveys">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {availableSurveys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No surveys available at the moment</p>
              <p className="text-xs mt-1">
                Check back later for new opportunities!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {availableSurveys.slice(0, 3).map((survey: any) => (
                <div
                  key={survey.id}
                  className="p-4 rounded-lg border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-green-600">
                      GH₵{survey.paymentPerResponse || 0}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {survey._count?.questions || 0} questions
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">
                      {survey.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {survey.client?.name || "Anonymous Client"}
                    </p>
                  </div>
                  <Button size="sm" className="w-full" asChild>
                    <Link href={`/influencer/surveys/${survey.id}/take`}>
                      Start Survey
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
