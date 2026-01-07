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
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Active Campaigns",
    value: "3",
    icon: Megaphone,
    color: "text-blue-600",
  },
  { title: "Total Views", value: "8,234", icon: Eye, color: "text-green-600" },
  {
    title: "Earnings",
    value: "₵1,256",
    icon: CreditCard,
    color: "text-purple-600",
  },
  { title: "Rating", value: "4.8", icon: Star, color: "text-yellow-600" },
];

const activeCampaigns = [
  {
    name: "Summer Product Launch",
    brand: "ABC Company",
    deadline: "5 days left",
    status: "in_progress",
  },
  {
    name: "Brand Awareness Q4",
    brand: "XYZ Corp",
    deadline: "12 days left",
    status: "pending_submission",
  },
  {
    name: "Holiday Promotion",
    brand: "123 Brand",
    deadline: "20 days left",
    status: "assigned",
  },
];

const earnings = [
  { campaign: "Spring Collection", amount: 250, date: "Dec 28, 2025" },
  { campaign: "Tech Launch", amount: 180, date: "Dec 20, 2025" },
  { campaign: "Food Festival", amount: 320, date: "Dec 15, 2025" },
];

export default function InfluencerDashboard() {
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <div className="space-y-4">
              {activeCampaigns.map((campaign) => (
                <div
                  key={campaign.name}
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
                      <Button size="sm" variant="outline">
                        <Upload className="mr-1 h-3 w-3" />
                        Submit
                      </Button>
                    ) : (
                      <Badge
                        variant={
                          campaign.status === "in_progress"
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
          </CardContent>
        </Card>

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
            <div className="space-y-4">
              {earnings.map((earning) => (
                <div
                  key={earning.campaign}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{earning.campaign}</p>
                    <p className="text-xs text-muted-foreground">
                      {earning.date}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    +₵{earning.amount}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Earnings</span>
                <span className="text-lg font-bold">₵1,256</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Surveys</CardTitle>
          <CardDescription>
            Complete surveys to earn extra income
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg border space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">₵{5 + i * 2}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {10 - i * 2} min
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">Consumer Survey {i}</p>
                  <p className="text-xs text-muted-foreground">
                    Brand Research Study
                  </p>
                </div>
                <Button size="sm" className="w-full" variant="outline">
                  Start Survey
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
