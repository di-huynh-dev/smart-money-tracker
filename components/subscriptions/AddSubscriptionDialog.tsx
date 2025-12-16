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
import { Textarea } from "@/components/ui/textarea";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddSubscriptionDialog({
  open,
  onOpenChange,
}: AddSubscriptionDialogProps) {
  const { addSubscription } = useSubscriptionStore();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");
  const [nextBillingDate, setNextBillingDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !amount) return;

    addSubscription({
      name,
      amount: parseFloat(amount),
      billingCycle,
      nextBillingDate: nextBillingDate,
      description,
      isActive: true,
    });

    // Reset form
    setName("");
    setAmount("");
    setBillingCycle("monthly");
    setNextBillingDate(new Date());
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm đăng ký mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên dịch vụ *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vd: Netflix, Spotify..."
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền *</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              required
            />
          </div>

          {/* Billing Cycle */}
          <div className="space-y-2">
            <Label>Chu kỳ thanh toán</Label>
            <div className="grid grid-cols-4 gap-2">
              <Button
                type="button"
                variant={billingCycle === "daily" ? "default" : "outline"}
                onClick={() => setBillingCycle("daily")}
                size="sm"
              >
                Ngày
              </Button>
              <Button
                type="button"
                variant={billingCycle === "weekly" ? "default" : "outline"}
                onClick={() => setBillingCycle("weekly")}
                size="sm"
              >
                Tuần
              </Button>
              <Button
                type="button"
                variant={billingCycle === "monthly" ? "default" : "outline"}
                onClick={() => setBillingCycle("monthly")}
                size="sm"
              >
                Tháng
              </Button>
              <Button
                type="button"
                variant={billingCycle === "yearly" ? "default" : "outline"}
                onClick={() => setBillingCycle("yearly")}
                size="sm"
              >
                Năm
              </Button>
            </div>
          </div>

          {/* Next Billing Date */}
          <div className="space-y-2">
            <Label>Ngày thanh toán kỳ tiếp</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(nextBillingDate, "dd/MM/yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={nextBillingDate}
                  onSelect={(date) => date && setNextBillingDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ghi chú thêm..."
              rows={3}
            />
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
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Thêm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
