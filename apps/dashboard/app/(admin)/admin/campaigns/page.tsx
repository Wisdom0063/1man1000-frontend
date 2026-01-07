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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";

const campaigns = [
  {
    id: "1",
    name: "Summer Product Launch",
    client: "ABC Company",
    status: "active",
    influencers: 12,
    views: 45000,
    target: 100000,
    createdAt: "Dec 1, 2025",
  },
  {
    id: "2",
    name: "Brand Awareness Q4",
    client: "XYZ Corp",
    status: "active",
    influencers: 8,
    views: 32000,
    target: 50000,
    createdAt: "Nov 15, 2025",
  },
  {
    id: "3",
    name: "Holiday Promotion",
    client: "123 Brand",
    status: "pending",
    influencers: 0,
    views: 0,
    target: 80000,
    createdAt: "Dec 28, 2025",
  },
  {
    id: "4",
    name: "New Year Campaign",
    client: "ABC Company",
    status: "pending",
    influencers: 0,
    views: 0,
    target: 60000,
    createdAt: "Dec 30, 2025",
  },
  {
    id: "5",
    name: "Fall Collection",
    client: "Fashion Inc",
    status: "completed",
    influencers: 15,
    views: 120000,
    target: 100000,
    createdAt: "Sep 1, 2025",
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
        <p className="text-muted-foreground">
          Manage and monitor all platform campaigns
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

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            {filteredCampaigns.length} campaigns found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="p-4 rounded-lg border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {campaign.client}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        statusColors[
                          campaign.status as keyof typeof statusColors
                        ]
                      }
                    >
                      {campaign.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          Manage Influencers
                        </DropdownMenuItem>
                        {campaign.status === "pending" && (
                          <>
                            <DropdownMenuItem className="text-green-600">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{campaign.influencers} influencers</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Views: </span>
                    <span className="font-medium">
                      {campaign.views.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      / {campaign.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    Created {campaign.createdAt}
                  </div>
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
