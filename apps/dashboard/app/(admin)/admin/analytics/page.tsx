"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  TrendingUp,
  Users,
  Megaphone,
  Eye,
  DollarSign,
  BarChart3,
} from "lucide-react";

const platformStats = {
  totalUsers: 1234,
  totalInfluencers: 890,
  totalClients: 344,
  activeCampaigns: 56,
  totalViews: 2450000,
  totalPayouts: 145680,
};

const monthlyData = [
  { month: "Jul", users: 45, campaigns: 8, views: 120000 },
  { month: "Aug", users: 62, campaigns: 12, views: 180000 },
  { month: "Sep", users: 78, campaigns: 15, views: 220000 },
  { month: "Oct", users: 95, campaigns: 18, views: 280000 },
  { month: "Nov", users: 120, campaigns: 22, views: 350000 },
  { month: "Dec", users: 145, campaigns: 28, views: 420000 },
];

const topCampaigns = [
  {
    name: "Summer Product Launch",
    client: "ABC Company",
    views: 120000,
    conversion: 3.2,
  },
  {
    name: "Fall Collection",
    client: "Fashion Inc",
    views: 98000,
    conversion: 2.8,
  },
  {
    name: "Brand Awareness Q4",
    client: "XYZ Corp",
    views: 85000,
    conversion: 2.5,
  },
  { name: "Tech Launch", client: "Tech Co", views: 72000, conversion: 3.0 },
  {
    name: "Holiday Promotion",
    client: "123 Brand",
    views: 65000,
    conversion: 2.2,
  },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Platform performance and insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {platformStats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {platformStats.totalInfluencers} influencers •{" "}
              {platformStats.totalClients} clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Campaigns
            </CardTitle>
            <Megaphone className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {platformStats.activeCampaigns}
            </div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Views
            </CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(platformStats.totalViews / 1000000).toFixed(2)}M
            </div>
            <p className="text-xs text-green-600">+18% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Payouts
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GH₵{platformStats.totalPayouts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8%</div>
            <p className="text-xs text-green-600">+0.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Platform Growth
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24%</div>
            <p className="text-xs text-muted-foreground">Month over month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Top Campaigns</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>
                Key metrics over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chart placeholder - Platform metrics visualization
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Campaigns</CardTitle>
              <CardDescription>
                Campaigns with highest engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCampaigns.map((campaign, index) => (
                  <div
                    key={campaign.name}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.client}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-medium">
                          {campaign.views.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">views</p>
                      </div>
                      <Badge variant="outline">
                        {campaign.conversion}% CVR
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
              <CardDescription>
                User and campaign growth over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data) => (
                  <div key={data.month} className="flex items-center gap-4">
                    <span className="w-12 text-sm font-medium">
                      {data.month}
                    </span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${(data.users / 150) * 100}%` }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {data.users} users
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${(data.campaigns / 30) * 100}%` }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {data.campaigns} campaigns
                        </span>
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
