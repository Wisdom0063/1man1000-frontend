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
  Users,
  Megaphone,
  FileImage,
  CreditCard,
  TrendingUp,
  Clock,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Active Campaigns",
    value: "56",
    change: "+8%",
    icon: Megaphone,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Pending Submissions",
    value: "23",
    change: "-5%",
    icon: FileImage,
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Total Payments",
    value: "GH₵45,678",
    change: "+15%",
    icon: CreditCard,
    color: "text-violet-600",
    bgColor: "bg-violet-500/10",
  },
];

const recentActivity = [
  {
    action: "New influencer registered",
    user: "John Doe",
    time: "2 minutes ago",
  },
  { action: "Campaign approved", user: "ABC Company", time: "15 minutes ago" },
  { action: "Submission reviewed", user: "Jane Smith", time: "1 hour ago" },
  { action: "Payment processed", user: "Mike Johnson", time: "2 hours ago" },
  { action: "Survey completed", user: "Sarah Wilson", time: "3 hours ago" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform performance
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                    stat.change.startsWith("+")
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-red-500/10 text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="ml-2">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Platform Growth
            </CardTitle>
            <CardDescription>
              User registrations over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center rounded-xl bg-muted/50 border border-border/50">
              <div className="text-center">
                <TrendingUp className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Chart visualization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 mt-1.5 shadow-sm" />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Influencer Applications</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Campaign Reviews</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Submission Reviews</span>
                <Badge variant="secondary">23</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Influencers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Jane Smith", "Mike Johnson", "Sarah Wilson"].map((name, i) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">
                      {1000 - i * 200} views delivered
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Surveys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Running</span>
                <Badge className="bg-green-100 text-green-800">15</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Approval</span>
                <Badge className="bg-yellow-100 text-yellow-800">5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed Today</span>
                <Badge className="bg-blue-100 text-blue-800">8</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
