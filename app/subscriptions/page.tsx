"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { formatCurrency, formatDate } from "@/lib/helpers";
import {
  ArrowLeft,
  Plus,
  Calendar,
  DollarSign,
  Clock,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AddSubscriptionDialog } from "@/components/subscriptions/AddSubscriptionDialog";
import { ProcessPaymentDialog } from "@/components/subscriptions/ProcessPaymentDialog";

export default function SubscriptionsPage() {
  const { subscriptions, getTotalMonthly, getDueToday, getDueSoon } =
    useSubscriptionStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<
    string | null
  >(null);

  const activeSubscriptions = subscriptions.filter((s) => s.isActive);
  const dueToday = getDueToday();
  const dueSoon = getDueSoon(7);

  const handleProcessPayment = (id: string) => {
    setSelectedSubscription(id);
    setIsPaymentDialogOpen(true);
  };

  const getBillingCycleLabel = (cycle: string) => {
    switch (cycle) {
      case "daily":
        return "Hàng ngày";
      case "weekly":
        return "Hàng tuần";
      case "monthly":
        return "Hàng tháng";
      case "yearly":
        return "Hàng năm";
      default:
        return cycle;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Đăng ký</h1>
        </div>

        {/* Summary Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4" />
              <p className="text-sm opacity-90">Chi phí hàng tháng</p>
            </div>
            <p className="text-3xl font-bold">
              {formatCurrency(getTotalMonthly())}
            </p>
            <p className="text-xs opacity-75 mt-1">
              {activeSubscriptions.length} đăng ký đang hoạt động
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 space-y-6">
        {/* Due Today Alert */}
        {dueToday.length > 0 && (
          <Card className="border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-5 w-5 text-rose-600" />
                <h3 className="font-semibold text-rose-900 dark:text-rose-100">
                  Đến hạn hôm nay
                </h3>
              </div>
              <p className="text-sm text-rose-800 dark:text-rose-200">
                {dueToday.length} đăng ký cần thanh toán hôm nay
              </p>
            </CardContent>
          </Card>
        )}

        {/* Due Soon Alert */}
        {dueSoon.length > 0 && (
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                  Sắp đến hạn
                </h3>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {dueSoon.length} đăng ký sắp đến hạn trong 7 ngày tới
              </p>
            </CardContent>
          </Card>
        )}

        {/* Add Button */}
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Thêm đăng ký mới
        </Button>

        {/* Active Subscriptions */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Đăng ký đang hoạt động
          </h2>
          {activeSubscriptions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>Không có đăng ký nào</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeSubscriptions.map((sub) => {
                const isDueToday = dueToday.some((s) => s.id === sub.id);
                const isDueSoon = dueSoon.some((s) => s.id === sub.id);

                return (
                  <Card
                    key={sub.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{sub.name}</h3>
                            {isDueToday && (
                              <Badge variant="destructive" className="text-xs">
                                Đến hạn hôm nay
                              </Badge>
                            )}
                            {!isDueToday && isDueSoon && (
                              <Badge variant="secondary" className="text-xs">
                                Sắp đến hạn
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {sub.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {getBillingCycleLabel(sub.billingCycle)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Kỳ tiếp: {formatDate(sub.nextBillingDate)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xl font-bold text-purple-600">
                            {formatCurrency(sub.amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            /
                            {getBillingCycleLabel(
                              sub.billingCycle
                            ).toLowerCase()}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleProcessPayment(sub.id)}
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                      >
                        Xử lý thanh toán
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Inactive Subscriptions */}
        {subscriptions.filter((s) => !s.isActive).length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-500">
              Đăng ký đã hủy
            </h2>
            <div className="space-y-3 opacity-60">
              {subscriptions
                .filter((s) => !s.isActive)
                .map((sub) => (
                  <Card key={sub.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold line-through">
                            {sub.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {sub.description}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold line-through">
                            {formatCurrency(sub.amount)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>

      <AddSubscriptionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
      <ProcessPaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        subscriptionId={selectedSubscription}
      />
    </main>
  );
}
