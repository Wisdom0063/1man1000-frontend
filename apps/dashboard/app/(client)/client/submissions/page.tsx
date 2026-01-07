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
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Eye, CheckCircle, XCircle, Clock, FileImage } from "lucide-react";

const submissions = [
  {
    id: "1",
    influencer: "John Doe",
    campaign: "Summer Product Launch",
    status: "pending",
    views: 1500,
    submittedAt: "2 hours ago",
  },
  {
    id: "2",
    influencer: "Jane Smith",
    campaign: "Summer Product Launch",
    status: "pending",
    views: 2300,
    submittedAt: "5 hours ago",
  },
  {
    id: "3",
    influencer: "Mike Johnson",
    campaign: "Brand Awareness Q4",
    status: "approved",
    views: 3200,
    submittedAt: "1 day ago",
  },
  {
    id: "4",
    influencer: "Sarah Wilson",
    campaign: "Brand Awareness Q4",
    status: "rejected",
    views: 500,
    submittedAt: "2 days ago",
  },
  {
    id: "5",
    influencer: "John Doe",
    campaign: "Brand Awareness Q4",
    status: "approved",
    views: 4100,
    submittedAt: "3 days ago",
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ClientSubmissionsPage() {
  const [activeTab, setActiveTab] = useState("pending");

  const filteredSubmissions = submissions.filter((s) => {
    if (activeTab === "all") return true;
    return s.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
        <p className="text-muted-foreground">
          Review influencer submissions for your campaigns
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
              Total Views
            </CardTitle>
            <FileImage className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions
                .filter((s) => s.status === "approved")
                .reduce((acc, s) => acc + s.views, 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2">
              {submissions.filter((s) => s.status === "pending").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Submissions</CardTitle>
              <CardDescription>
                {filteredSubmissions.length} submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-24 rounded-lg bg-muted flex items-center justify-center">
                        <FileImage className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {submission.influencer.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-medium">{submission.influencer}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {submission.campaign}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {submission.submittedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          {submission.views.toLocaleString()} views
                        </p>
                        <Badge
                          className={
                            statusColors[
                              submission.status as keyof typeof statusColors
                            ]
                          }
                        >
                          {submission.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {submission.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600"
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive"
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
