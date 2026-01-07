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
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  Wallet,
} from "lucide-react";

const earnings = [
  {
    id: "1",
    campaign: "Fall Collection",
    amount: 400,
    status: "paid",
    date: "Dec 20, 2025",
  },
  {
    id: "2",
    campaign: "Summer Product Launch",
    amount: 250,
    status: "paid",
    date: "Dec 15, 2025",
  },
  {
    id: "3",
    campaign: "Brand Awareness Q4",
    amount: 180,
    status: "pending",
    date: "Dec 30, 2025",
  },
  {
    id: "4",
    campaign: "Holiday Promotion",
    amount: 320,
    status: "pending",
    date: "Jan 5, 2026",
  },
  {
    id: "5",
    campaign: "Tech Launch",
    amount: 280,
    status: "paid",
    date: "Nov 28, 2025",
  },
];

const stats = {
  totalEarnings: 1430,
  pendingPayments: 500,
  paidThisMonth: 650,
  campaignsCompleted: 5,
};

export default function InfluencerEarningsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
        <p className="text-muted-foreground">
          Track your earnings and payment history
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GH₵{stats.totalEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GH₵{stats.pendingPayments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paid This Month
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GH₵{stats.paidThisMonth.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">December 2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Campaigns Completed
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.campaignsCompleted}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {earnings.map((earning) => (
                <div
                  key={earning.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{earning.campaign}</p>
                    <p className="text-xs text-muted-foreground">
                      {earning.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-semibold ${earning.status === "paid" ? "text-green-600" : "text-yellow-600"}`}
                    >
                      GH₵{earning.amount}
                    </span>
                    <Badge
                      variant={
                        earning.status === "paid" ? "default" : "secondary"
                      }
                    >
                      {earning.status === "paid" ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" /> Paid
                        </>
                      ) : (
                        <>
                          <Clock className="mr-1 h-3 w-3" /> Pending
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>Your mobile money details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network</span>
                <span className="text-sm font-medium">MTN Mobile Money</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Phone Number
                </span>
                <span className="text-sm font-medium">024 XXX XXXX</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Account Name
                </span>
                <span className="text-sm font-medium">John Doe</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Update Payment Details
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
