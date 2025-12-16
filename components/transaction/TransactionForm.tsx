"use client";

import { useState, useMemo } from "react";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useUserStore } from "@/stores/useUserStore";
import { TransactionType } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatCurrency, getCurrentMonth } from "@/lib/helpers";

export function TransactionForm() {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const allCategories = useCategoryStore((state) => state.categories);
  const categories = useMemo(
    () => allCategories.filter((c) => c.type === type && !c.isHidden),
    [allCategories, type]
  );
  const updateBudgetSpent = useBudgetStore((state) => state.updateSpent);
  const getBudgetByCategory = useBudgetStore(
    (state) => state.getBudgetByCategory
  );
  const unlockBadge = useUserStore((state) => state.unlockBadge);
  const transactions = useTransactionStore((state) => state.transactions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse amount - loại bỏ tất cả ký tự không phải số
    const cleanAmount = amount.replace(/[^0-9]/g, "");
    const amountNum = parseFloat(cleanAmount);

    if (!cleanAmount || !amountNum || amountNum <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (!category) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    // Add transaction
    addTransaction({
      type,
      amount: amountNum,
      date,
      category,
      note,
    });

    // Update budget if expense
    if (type === "expense") {
      const month = getCurrentMonth();
      const budget = getBudgetByCategory(category, month);

      if (budget) {
        updateBudgetSpent(category, month, amountNum);

        const newSpent = budget.spent + amountNum;
        const percentage = (newSpent / budget.limit) * 100;

        if (percentage >= 100) {
          toast.error(`Vượt ngân sách cho ${category}! 🚨`, {
            description: `Bạn đã chi ${formatCurrency(
              newSpent
            )} / ${formatCurrency(budget.limit)}`,
          });
        } else if (percentage >= 80) {
          toast.warning(`Cảnh báo ngân sách cho ${category}`, {
            description: `Bạn đã dùng ${percentage.toFixed(0)}% ngân sách`,
          });
        }
      }
    }

    // Unlock first transaction badge
    if (transactions.length === 0) {
      unlockBadge("first-transaction");
      toast.success("Đạt được huy hiệu: Bắt đầu! 🎯");
    }

    toast.success(
      `${type === "income" ? "Thu nhập" : "Chi tiêu"} đã được thêm!`
    );

    // Reset form
    setAmount("");
    setCategory("");
    setNote("");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ cho phép số
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Thêm giao dịch
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={type} onValueChange={(v) => setType(v as TransactionType)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">Chi tiêu</TabsTrigger>
            <TabsTrigger value="income">Thu nhập</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Số tiền (VND)</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={amount}
                  onChange={handleAmountChange}
                  className="text-lg font-semibold pr-16"
                />
                {amount && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    {formatCurrency(parseFloat(amount) || 0)}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ngày</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Chọn ngày</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú (Tùy chọn)</Label>
              <Textarea
                id="note"
                placeholder="Thêm ghi chú..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Thêm {type === "income" ? "thu nhập" : "chi tiêu"}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
