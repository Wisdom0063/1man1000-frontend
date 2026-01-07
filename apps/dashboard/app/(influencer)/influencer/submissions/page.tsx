"use client";

import { useState } from "react";
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
import {
  Upload,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileImage,
} from "lucide-react";

const submissions = [
  {
    id: "1",
    campaign: "Summer Product Launch",
    status: "approved",
    views: 3200,
    submittedAt: "Dec 28, 2025",
    reviewedAt: "Dec 29, 2025",
  },
  {
    id: "2",
    campaign: "Brand Awareness Q4",
    status: "pending",
    views: 1500,
    submittedAt: "Dec 30, 2025",
    reviewedAt: null,
  },
  {
    id: "3",
    campaign: "Holiday Promotion",
    status: "rejected",
    views: 500,
    submittedAt: "Dec 25, 2025",
    reviewedAt: "Dec 26, 2025",
    reason: "Screenshot unclear",
  },
  {
    id: "4",
    campaign: "Fall Collection",
    status: "approved",
    views: 5200,
    submittedAt: "Dec 15, 2025",
    reviewedAt: "Dec 16, 2025",
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

export default function InfluencerSubmissionsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredSubmissions = submissions.filter((s) => {
    if (activeTab === "all") return true;
    return s.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Submissions</h1>
          <p className="text-muted-foreground">
            Track your campaign submissions and their status
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          New Submission
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Submissions
            </CardTitle>
            <FileImage className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.filter((s) => s.status === "approved").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.filter((s) => s.status === "pending").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
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
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => {
                  const StatusIcon =
                    statusIcons[submission.status as keyof typeof statusIcons];
                  return (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-24 rounded-lg bg-muted flex items-center justify-center">
                          <FileImage className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{submission.campaign}</p>
                          <p className="text-sm text-muted-foreground">
                            Submitted {submission.submittedAt}
                          </p>
                          {submission.status === "rejected" &&
                            submission.reason && (
                              <p className="text-xs text-destructive">
                                Reason: {submission.reason}
                              </p>
                            )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">
                            {submission.views.toLocaleString()} views
                          </p>
                          {submission.reviewedAt && (
                            <p className="text-xs text-muted-foreground">
                              Reviewed {submission.reviewedAt}
                            </p>
                          )}
                        </div>
                        <Badge
                          className={
                            statusColors[
                              submission.status as keyof typeof statusColors
                            ]
                          }
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {submission.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
