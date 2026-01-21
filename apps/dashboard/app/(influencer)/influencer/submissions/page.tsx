"use client";

import { useState } from "react";
import { useSubmissionsControllerGetInfluencerSubmissions } from "@workspace/client";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { ExternalLink, ImageIcon, Upload } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

type Submission = {
  id: string;
  campaignId: string;
  campaign?: { id: string; brandName: string; title?: string };
  screenshotUrl: string;
  extractedViewCount: number;
  approvalStatus: string;
  reviewNote?: string;
  reviewedAt?: string;
  createdAt: string;
};

export default function InfluencerSubmissionsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useSubmissionsControllerGetInfluencerSubmissions();
  const submissions = (response || []) as Submission[];

  const filteredSubmissions = submissions.filter((s) => {
    if (activeTab === "all") return true;
    return s.approvalStatus === activeTab;
  });

  const pendingCount = submissions.filter(
    (s) => s.approvalStatus === "pending"
  ).length;
  const approvedCount = submissions.filter(
    (s) => s.approvalStatus === "approved"
  ).length;
  const rejectedCount = submissions.filter(
    (s) => s.approvalStatus === "rejected"
  ).length;

  if (isLoading) {
    return <LoadingState text="Loading your submissions..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load submissions"
        message="There was an error loading your submissions. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          My Submissions
        </h1>
        <p className="text-muted-foreground">
          Track your campaign submissions and their status
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {approvedCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {rejectedCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {pendingCount > 0 && (
              <Badge className="ml-2 bg-yellow-500/15 text-yellow-600 border-0">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission History</CardTitle>
              <CardDescription>
                {filteredSubmissions.length} submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredSubmissions.length === 0 ? (
                <div className="py-12 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    No submissions found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "all"
                      ? "You haven't submitted any campaigns yet. Start by browsing available campaigns!"
                      : activeTab === "pending"
                        ? "You don't have any pending submissions."
                        : activeTab === "approved"
                          ? "You don't have any approved submissions yet."
                          : "You don't have any rejected submissions."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-24 rounded-lg bg-muted overflow-hidden border border-border/60">
                          {submission.screenshotUrl ? (
                            <img
                              src={submission.screenshotUrl}
                              alt="Screenshot"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold">
                            {submission.campaign?.title ||
                              submission.campaign?.brandName ||
                              "Unknown Campaign"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Submitted{" "}
                            {new Date(
                              submission.createdAt
                            ).toLocaleDateString()}
                          </p>
                          {submission.approvalStatus === "rejected" &&
                            submission.reviewNote && (
                              <p className="text-xs text-destructive">
                                Reason: {submission.reviewNote}
                              </p>
                            )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {submission.extractedViewCount?.toLocaleString() ||
                              0}
                          </p>
                          <p className="text-xs text-muted-foreground">views</p>
                        </div>
                        <StatusBadge status={submission.approvalStatus} />
                        <div className="flex items-center gap-2">
                          {submission.screenshotUrl && (
                            <Button variant="outline" size="icon-sm" asChild>
                              <a
                                href={submission.screenshotUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
