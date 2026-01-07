"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useSubmissionsControllerFindAll,
  useSubmissionsControllerReview,
  getSubmissionsControllerFindAllQueryKey,
  ReviewSubmissionDtoApprovalStatus,
} from "@workspace/client";
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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Label } from "@workspace/ui/components/label";
import {
  Search,
  CheckCircle,
  XCircle,
  ExternalLink,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

type Submission = {
  id: string;
  campaignId: string;
  influencerId: string;
  campaign?: { id: string; brandName: string; title?: string };
  influencer?: { id: string; name: string; email: string; avatarUrl?: string };
  screenshotUrl: string;
  extractedViewCount: number;
  approvalStatus: string;
  reviewNote?: string;
  createdAt: string;
};

export default function AdminSubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [reviewingSubmission, setReviewingSubmission] =
    useState<Submission | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useSubmissionsControllerFindAll();
  const submissions = (response?.data || []) as Submission[];

  const reviewMutation = useSubmissionsControllerReview({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getSubmissionsControllerFindAllQueryKey(),
        });
        setReviewingSubmission(null);
        setReviewNote("");
      },
    },
  });

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.influencer?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      submission.campaign?.brandName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      submission.campaign?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" || submission.approvalStatus === activeTab;
    return matchesSearch && matchesTab;
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

  const handleApprove = (submission: Submission) => {
    reviewMutation.mutate({
      id: submission.id,
      data: {
        approvalStatus: ReviewSubmissionDtoApprovalStatus.approved,
        reviewNotes: reviewNote,
      },
    });
  };

  const handleReject = (submission: Submission) => {
    setReviewingSubmission(submission);
  };

  const confirmReject = () => {
    if (reviewingSubmission) {
      reviewMutation.mutate({
        id: reviewingSubmission.id,
        data: {
          approvalStatus: ReviewSubmissionDtoApprovalStatus.rejected,
          reviewNotes: reviewNote,
        },
      });
    }
  };

  if (isLoading) {
    return <LoadingState text="Loading submissions..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load submissions"
        message="There was an error loading the submissions. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Submissions
        </h1>
        <p className="text-muted-foreground">
          Review and approve influencer submissions
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

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
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
          <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission Review</CardTitle>
              <CardDescription>
                {filteredSubmissions.length} submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredSubmissions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No submissions found
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-28 rounded-lg bg-muted overflow-hidden border border-border/60">
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
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-7 w-7">
                              <AvatarImage
                                src={submission.influencer?.avatarUrl}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs">
                                {submission.influencer?.name
                                  ?.slice(0, 2)
                                  .toUpperCase() || "??"}
                              </AvatarFallback>
                            </Avatar>
                            <p className="font-semibold">
                              {submission.influencer?.name || "Unknown"}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {submission.campaign?.title ||
                              submission.campaign?.brandName ||
                              "Unknown Campaign"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(submission.createdAt).toLocaleString()}
                          </p>
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
                          {submission.approvalStatus === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                onClick={() => handleApprove(submission)}
                                disabled={reviewMutation.isPending}
                              >
                                {reviewMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="mr-1 h-4 w-4" />
                                    Approve
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive border-red-200 hover:bg-red-50"
                                onClick={() => handleReject(submission)}
                                disabled={reviewMutation.isPending}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            </>
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

      <Dialog
        open={!!reviewingSubmission}
        onOpenChange={() => setReviewingSubmission(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this submission.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reviewNote">Rejection Reason</Label>
              <textarea
                id="reviewNote"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="flex min-h-[100px] w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm shadow-sm transition-all placeholder:text-muted-foreground/70 hover:border-border focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewingSubmission(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={reviewMutation.isPending}
            >
              {reviewMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Reject Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
