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
import { Input } from "@workspace/ui/components/input";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Search, CheckCircle, XCircle, Eye, ExternalLink } from "lucide-react";

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
    campaign: "Brand Awareness Q4",
    status: "pending",
    views: 2300,
    submittedAt: "5 hours ago",
  },
  {
    id: "3",
    influencer: "Mike Johnson",
    campaign: "Summer Product Launch",
    status: "approved",
    views: 3200,
    submittedAt: "1 day ago",
  },
  {
    id: "4",
    influencer: "Sarah Wilson",
    campaign: "Holiday Promotion",
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

export default function AdminSubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.influencer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.campaign.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || submission.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
        <p className="text-muted-foreground">
          Review and approve influencer submissions
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
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
              <CardTitle>Submission Review</CardTitle>
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
                        <Eye className="h-6 w-6 text-muted-foreground" />
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
                          <ExternalLink className="h-4 w-4" />
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
