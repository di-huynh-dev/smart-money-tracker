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
import { useDebtLoanStore } from "@/stores/useDebtLoanStore";
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

interface AddDebtLoanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDebtLoanDialog({
  open,
  onOpenChange,
}: AddDebtLoanDialogProps) {
  const { addItem } = useDebtLoanStore();
  const [type, setType] = useState<"debt" | "loan">("debt");
  const [amount, setAmount] = useState("");
  const [person, setPerson] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !person || !description) return;

    addItem({
      type,
      amount: parseFloat(amount),
      person,
      description,
      dueDate: dueDate || null,
      note,
    });

    // Reset form
    setAmount("");
    setPerson("");
    setDescription("");
    setDueDate(undefined);
    setNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm nợ/cho vay mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label>Loại</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={type === "debt" ? "default" : "outline"}
                onClick={() => setType("debt")}
                className={cn(
                  type === "debt" && "bg-rose-600 hover:bg-rose-700"
                )}
              >
                💸 Khoản nợ
              </Button>
              <Button
                type="button"
                variant={type === "loan" ? "default" : "outline"}
                onClick={() => setType("loan")}
                className={cn(
                  type === "loan" && "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                💰 Cho vay
              </Button>
            </div>
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

          {/* Person */}
          <div className="space-y-2">
            <Label htmlFor="person">
              {type === "debt" ? "Người cho vay *" : "Người vay *"}
            </Label>
            <Input
              id="person"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              placeholder="Nhập tên..."
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả *</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Vd: Vay mua xe máy"
              required
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Ngày đến hạn</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "dd/MM/yyyy") : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
              className={cn(
                "flex-1",
                type === "debt"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              )}
            >
              Thêm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
