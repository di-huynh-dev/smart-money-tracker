"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebtLoanStore } from "@/stores/useDebtLoanStore";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/helpers";
import { DollarSign } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string | null;
}

export function PaymentDialog({
  open,
  onOpenChange,
  itemId,
}: PaymentDialogProps) {
  const { items, addPayment, markAsPaid } = useDebtLoanStore();
  const [amount, setAmount] = useState("");

  const item = items.find((i) => i.id === itemId);
  const remaining = item ? item.amount - item.paidAmount : 0;

  useEffect(() => {
    if (open && item) {
      setAmount(remaining.toString());
    }
  }, [open, item, remaining]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemId || !amount) return;

    const paymentAmount = parseFloat(amount);

    if (paymentAmount >= remaining) {
      markAsPaid(itemId);
    } else {
      addPayment(itemId, paymentAmount);
    }

    setAmount("");
    onOpenChange(false);
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thanh toán</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Info */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">{item.description}</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>
                {item.type === "debt" ? "Nợ" : "Cho vay"}: {item.person}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm">Tổng số tiền:</span>
              <span className="font-semibold">
                {formatCurrency(item.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Đã thanh toán:</span>
              <span className="font-semibold">
                {formatCurrency(item.paidAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="font-semibold">Còn lại:</span>
              <span className="text-xl font-bold text-indigo-600">
                {formatCurrency(remaining)}
              </span>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Số tiền thanh toán</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="payment-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="pl-10"
                  max={remaining}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount((remaining / 2).toString())}
                >
                  50%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount((remaining / 4).toString())}
                >
                  25%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(remaining.toString())}
                >
                  Toàn bộ
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Xác nhận thanh toán
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
