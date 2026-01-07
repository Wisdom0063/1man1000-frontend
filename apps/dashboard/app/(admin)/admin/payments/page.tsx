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
import {
  Search,
  CreditCard,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const payments = [
  {
    id: "1",
    influencer: "John Doe",
    campaign: "Summer Product Launch",
    amount: 250,
    status: "pending",
    dueDate: "Jan 5, 2026",
  },
  {
    id: "2",
    influencer: "Jane Smith",
    campaign: "Brand Awareness Q4",
    amount: 180,
    status: "pending",
    dueDate: "Jan 8, 2026",
  },
  {
    id: "3",
    influencer: "Mike Johnson",
    campaign: "Holiday Promotion",
    amount: 320,
    status: "processing",
    dueDate: "Jan 3, 2026",
  },
  {
    id: "4",
    influencer: "Sarah Wilson",
    campaign: "Fall Collection",
    amount: 400,
    status: "paid",
    paidDate: "Dec 28, 2025",
  },
  {
    id: "5",
    influencer: "John Doe",
    campaign: "Tech Launch",
    amount: 280,
    status: "paid",
    paidDate: "Dec 20, 2025",
  },
];

const stats = {
  totalPaid: 45680,
  pendingPayouts: 750,
  processingCount: 1,
  paidThisMonth: 12500,
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
};

export default function AdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.influencer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.campaign.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || payment.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Manage influencer payments and payouts
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Paid
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GH₵{stats.totalPaid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payouts
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GH₵{stats.pendingPayouts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {payments.filter((p) => p.status === "pending").length} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Processing
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processingCount}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GH₵{stats.paidThisMonth.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">December 2025</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
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
              {payments.filter((p) => p.status === "pending").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Queue</CardTitle>
              <CardDescription>
                {filteredPayments.length} payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {payment.influencer.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{payment.influencer}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.campaign}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">GH₵{payment.amount}</p>
                        <p className="text-xs text-muted-foreground">
                          {payment.status === "paid"
                            ? `Paid ${payment.paidDate}`
                            : `Due ${payment.dueDate}`}
                        </p>
                      </div>
                      <Badge
                        className={
                          statusColors[
                            payment.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {payment.status}
                      </Badge>
                      {payment.status === "pending" && (
                        <Button size="sm">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Process
                        </Button>
                      )}
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
