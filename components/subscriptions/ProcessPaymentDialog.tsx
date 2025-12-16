"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { Calendar, DollarSign, CheckCircle } from "lucide-react";

interface ProcessPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionId: string | null;
}

export function ProcessPaymentDialog({
  open,
  onOpenChange,
  subscriptionId,
}: ProcessPaymentDialogProps) {
  const { subscriptions, processPayment, cancelSubscription } =
    useSubscriptionStore();
  const { addTransaction } = useTransactionStore();

  const subscription = subscriptions.find((s) => s.id === subscriptionId);

  const handleProcessPayment = (createTransaction: boolean) => {
    if (!subscriptionId || !subscription) return;

    processPayment(subscriptionId);

    if (createTransaction) {
      // Create a transaction for this payment
      addTransaction({
        amount: subscription.amount,
        type: "expense",
        category: "Dịch vụ",
        date: new Date(),
        note: `Thanh toán ${subscription.name} - Đăng ký ${subscription.billingCycle}`,
      });
    }

    onOpenChange(false);
  };

  const handleCancelSubscription = () => {
    if (!subscriptionId) return;

    cancelSubscription(subscriptionId);
    onOpenChange(false);
  };

  if (!subscription) return null;

  const getBillingCycleLabel = (cycle: string) => {
    switch (cycle) {
      case "daily":
        return "hàng ngày";
      case "weekly":
        return "hàng tuần";
      case "monthly":
        return "hàng tháng";
      case "yearly":
        return "hàng năm";
      default:
        return cycle;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Xử lý thanh toán</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Subscription Info */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-4 rounded-lg space-y-2">
            <h3 className="text-lg font-semibold">{subscription.name}</h3>
            {subscription.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subscription.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-purple-200 dark:border-purple-800">
              <span className="text-sm">Số tiền:</span>
              <span className="text-2xl font-bold text-purple-600">
                {formatCurrency(subscription.amount)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>
                Chu kỳ: {getBillingCycleLabel(subscription.billingCycle)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>
                Kỳ tiếp theo: {formatDate(subscription.nextBillingDate)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={() => handleProcessPayment(true)}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Xác nhận thanh toán & Tạo giao dịch
            </Button>

            <Button
              onClick={() => handleProcessPayment(false)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Chỉ cập nhật ngày kỳ tiếp
            </Button>

            <div className="pt-4 border-t">
              <Button
                onClick={handleCancelSubscription}
                variant="destructive"
                className="w-full"
              >
                Hủy đăng ký
              </Button>
            </div>

            <Button
              onClick={() => onOpenChange(false)}
              variant="ghost"
              className="w-full"
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
