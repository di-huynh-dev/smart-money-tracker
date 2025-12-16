"use client";

import { useMemo, useState } from "react";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, getFiscalMonth } from "@/lib/helpers";
import { ArrowLeft, TrendingDown, Filter } from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/components/layout/BottomNav";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

type PeriodType = "day" | "week" | "month";

export default function ExpensesPage() {
  const [periodType, setPeriodType] = useState<PeriodType>("month");
  const transactions = useTransactionStore((state) => state.transactions);

  // Get date range based on period
  const dateRange = useMemo(() => {
    const now = new Date();
    switch (periodType) {
      case "day":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "week":
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
        };
      case "month":
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  }, [periodType]);

  const expenseTransactions = useMemo(
    () =>
      transactions
        .filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            t.type === "expense" &&
            transactionDate >= dateRange.start &&
            transactionDate <= dateRange.end
          );
        })
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
    [transactions, dateRange]
  );

  const totalExpense = useMemo(
    () => expenseTransactions.reduce((sum, t) => sum + t.amount, 0),
    [expenseTransactions]
  );

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Ăn uống": "🍔",
      "Di chuyển": "🚗",
      "Giải trí": "🎮",
      "Quần áo": "👕",
      "Sinh hoạt": "🏠",
      "Trà sữa": "🧋",
      "Mua online": "🛒",
      AIU: "🎓",
    };
    return icons[category] || "💰";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-md mx-auto pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-6">
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
            <h1 className="text-2xl font-bold">Chi tiêu</h1>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5" />
                <p className="text-sm opacity-90">Tổng chi tiêu</p>
              </div>
              <p className="text-4xl font-bold">
                {formatCurrency(totalExpense)}
              </p>
              <p className="text-xs opacity-75 mt-2">
                {expenseTransactions.length} giao dịch
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Period Filter */}
          <Card>
            <CardContent className="p-3">
              <Tabs
                value={periodType}
                onValueChange={(v) => setPeriodType(v as PeriodType)}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="day" className="flex-1">
                    Hôm nay
                  </TabsTrigger>
                  <TabsTrigger value="week" className="flex-1">
                    Tuần này
                  </TabsTrigger>
                  <TabsTrigger value="month" className="flex-1">
                    Tháng này
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Filter */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Tất cả giao dịch</h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {expenseTransactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 flex items-center justify-center text-xl">
                        {getCategoryIcon(transaction.category)}
                      </div>
                      <div>
                        <p className="font-semibold">{transaction.category}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {format(
                            new Date(transaction.date),
                            "dd MMM yyyy, HH:mm",
                            {
                              locale: vi,
                            }
                          )}
                        </p>
                        {transaction.note && (
                          <p className="text-xs text-gray-500 mt-1">
                            {transaction.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-bold text-lg text-rose-600">
                      -{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {expenseTransactions.length === 0 && (
              <Card className="border-2 border-dashed">
                <CardContent className="py-12 text-center">
                  <div className="text-6xl mb-4">💸</div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Chưa có chi tiêu
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Các giao dịch chi tiêu sẽ hiển thị ở đây
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
