"use client";

import { useState } from "react";
import Link from "next/link";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Search, Upload, Eye, Clock, CheckCircle } from "lucide-react";

const campaigns = [
  {
    id: "1",
    name: "Summer Product Launch",
    brand: "ABC Company",
    status: "in_progress",
    deadline: "Jan 15, 2026",
    reward: 250,
    views: 1500,
    target: 5000,
  },
  {
    id: "2",
    name: "Brand Awareness Q4",
    brand: "XYZ Corp",
    status: "pending_submission",
    deadline: "Jan 10, 2026",
    reward: 180,
    views: 0,
    target: 3000,
  },
  {
    id: "3",
    name: "Holiday Promotion",
    brand: "123 Brand",
    status: "assigned",
    deadline: "Jan 20, 2026",
    reward: 320,
    views: 0,
    target: 4000,
  },
  {
    id: "4",
    name: "Fall Collection",
    brand: "Fashion Inc",
    status: "completed",
    deadline: "Dec 15, 2025",
    reward: 400,
    views: 5200,
    target: 5000,
  },
];

const statusColors = {
  assigned: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  pending_submission: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
};

const statusLabels = {
  assigned: "Assigned",
  in_progress: "In Progress",
  pending_submission: "Submit Now",
  completed: "Completed",
};

export default function InfluencerCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  const activeCampaigns = campaigns.filter((c) => c.status !== "completed");
  const completedCampaigns = campaigns.filter((c) => c.status === "completed");

  const filteredCampaigns = (
    activeTab === "active" ? activeCampaigns : completedCampaigns
  ).filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Campaigns</h1>
        <p className="text-muted-foreground">
          View and manage your assigned campaigns
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">
            Active
            <Badge variant="secondary" className="ml-2">
              {activeCampaigns.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <Badge
                      className={
                        statusColors[
                          campaign.status as keyof typeof statusColors
                        ]
                      }
                    >
                      {
                        statusLabels[
                          campaign.status as keyof typeof statusLabels
                        ]
                      }
                    </Badge>
                  </div>
                  <CardDescription>{campaign.brand}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {campaign.status !== "assigned" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Your Progress
                        </span>
                        <span className="font-medium">
                          {campaign.views.toLocaleString()} /{" "}
                          {campaign.target.toLocaleString()} views
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{
                            width: `${Math.min((campaign.views / campaign.target) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Due {campaign.deadline}
                    </div>
                    <div className="font-medium text-green-600">
                      GH₵{campaign.reward}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/influencer/campaigns/${campaign.id}`}>
                        <Eye className="mr-1 h-4 w-4" />
                        Details
                      </Link>
                    </Button>
                    {campaign.status === "pending_submission" && (
                      <Button size="sm" className="flex-1">
                        <Upload className="mr-1 h-4 w-4" />
                        Submit
                      </Button>
                    )}
                    {campaign.status === "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Paid
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
