"use client";

import { useState } from "react";
import {
  usePaymentsControllerFindAll,
  usePaymentsControllerUpdateStatus,
  type PaymentResponseDto,
  type UpdatePaymentStatusDto,
} from "@workspace/client";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Search,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
};

export default function AdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentResponseDto | null>(null);

  const statusParam =
    activeTab === "all" ? undefined : (activeTab as "pending" | "paid");

  const {
    data: paymentsResponse,
    isLoading,
    isError,
    refetch,
  } = usePaymentsControllerFindAll(
    statusParam ? { status: statusParam } : undefined,
    {
      query: {
        staleTime: 10_000,
      },
    },
  );

  const { mutateAsync: updatePaymentStatus, isPending: isUpdatingStatus } =
    usePaymentsControllerUpdateStatus();

  if (isLoading) {
    return <LoadingState text="Loading payments..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load payments"
        message="There was an error loading the payments queue."
        onRetry={() => refetch()}
      />
    );
  }

  const typedPayments = (paymentsResponse || []) as PaymentResponseDto[];

  const queryLower = searchQuery.trim().toLowerCase();
  const filteredPayments = typedPayments.filter((payment) => {
    if (!queryLower) return true;
    const influencerName = (payment.influencer?.name as never as string) || "";
    const campaignName = payment.campaign?.brandName || "";
    return (
      influencerName.toLowerCase().includes(queryLower) ||
      campaignName.toLowerCase().includes(queryLower)
    );
  });

  const totalPaid = typedPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  const pendingPayouts = typedPayments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  const now = new Date();
  const paidThisMonth = typedPayments
    .filter((p) => {
      if (p.status !== "paid") return false;
      const dt = p.paymentDate || p.updatedAt || p.createdAt;
      if (!dt) return false;
      const d = new Date(dt);
      return (
        d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      );
    })
    .reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  const pendingCount = typedPayments.filter(
    (p) => p.status === "pending",
  ).length;

  const selectedInfluencerName =
    selectedPayment?.influencer?.name || "Influencer";
  const selectedCampaignName =
    selectedPayment?.campaign?.brandName || "Campaign";
  const selectedAmount = (selectedPayment?.totalAmount || 0).toFixed(2);

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
              GH₵{totalPaid.toLocaleString()}
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
              GH₵{pendingPayouts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingCount} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting payout</p>
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
              GH₵{paidThisMonth.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {now.toLocaleString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </p>
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
              {pendingCount}
            </Badge>
          </TabsTrigger>
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
              {filteredPayments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p className="text-sm">No payments found</p>
                  <p className="text-xs mt-1">
                    Try adjusting your search or filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPayments.map((payment) => {
                    const influencerName =
                      (payment.influencer?.name as never as string) ||
                      "Influencer";
                    const avatarText = influencerName.slice(0, 2).toUpperCase();
                    const campaignName = payment.campaign?.title || "Campaign";

                    const dateSource =
                      payment.status === "paid"
                        ? payment.paymentDate || payment.updatedAt
                        : payment.createdAt;
                    const dateLabel = dateSource
                      ? new Date(dateSource).toLocaleDateString()
                      : "";

                    return (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>{avatarText}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {influencerName as string}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {campaignName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold">
                              GH₵{(payment.totalAmount || 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {payment.status === "paid"
                                ? `Paid ${dateLabel}`
                                : `Created ${dateLabel}`}
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
                            <Button
                              size="sm"
                              disabled={isUpdatingStatus}
                              onClick={async () => {
                                setSelectedPayment(payment);
                                setConfirmOpen(true);
                              }}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setSelectedPayment(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark payment as paid?</AlertDialogTitle>
            <AlertDialogDescription>
              This will set the payment status to paid for{" "}
              {selectedInfluencerName as string} on {selectedCampaignName} (GH₵
              {selectedAmount}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdatingStatus}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={!selectedPayment || isUpdatingStatus}
              onClick={async () => {
                if (!selectedPayment) return;
                const payload: UpdatePaymentStatusDto = { status: "paid" };
                await updatePaymentStatus({
                  id: selectedPayment.id,
                  data: payload,
                });
                await refetch();
                setConfirmOpen(false);
                setSelectedPayment(null);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
