"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Bell, Check, CheckCheck } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

const notifications = [
  {
    id: 1,
    title: "New campaign assigned",
    message: "You have been assigned to 'Summer Product Launch'",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "Submission approved",
    message: "Your submission for 'Brand Awareness Q4' has been approved",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    title: "Payment received",
    message: "You received ₵150 for completed campaign",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    title: "New survey available",
    message: "Complete the Consumer Survey to earn ₵10",
    time: "1 day ago",
    read: true,
  },
  {
    id: 5,
    title: "Profile reminder",
    message: "Complete your profile to get more campaign opportunities",
    time: "2 days ago",
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your latest activities
            </p>
          </div>
          <Button variant="outline" size="sm">
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              All Notifications
              <Badge variant="secondary" className="ml-2">
                {notifications.filter((n) => !n.read).length} unread
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-muted/50 ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div
                    className={`mt-1 h-2 w-2 rounded-full ${!notification.read ? "bg-primary" : "bg-transparent"}`}
                  />
                  <div className="flex-1 space-y-1">
                    <p
                      className={`text-sm ${!notification.read ? "font-medium" : ""}`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button variant="ghost" size="sm">
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
