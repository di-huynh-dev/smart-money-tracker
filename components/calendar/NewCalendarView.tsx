"use client";

import { useState, useMemo } from "react";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/helpers";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { vi } from "date-fns/locale";

export function NewCalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const transactions = useTransactionStore((state) => state.transactions);

  // Get all dates with transactions
  const transactionDates = useMemo(
    () =>
      new Set(
        transactions.map((t) => new Date(t.date).toISOString().split("T")[0])
      ),
    [transactions]
  );

  const selectedTransactions = useMemo(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return transactions
      .filter((t) => {
        const tDateStr = new Date(t.date).toISOString().split("T")[0];
        return tDateStr === dateStr;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedDate, transactions]);

  // Monthly statistics
  const monthlyStats = useMemo(() => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= start && tDate <= end;
    });

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
      transactionCount: monthTransactions.length,
      daysWithTransactions: new Set(
        monthTransactions.map(
          (t) => new Date(t.date).toISOString().split("T")[0]
        )
      ).size,
    };
  }, [selectedDate, transactions]);

  const totalIncome = selectedTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = selectedTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Ăn uống": "🍔",
      "Di chuyển": "🚗",
      "Giải trí": "🎮",
      "Quần áo": "👕",
      "Sinh hoạt": "🏠",
      "Trà sữa": "🧋",
      Lương: "💰",
      "Tiền phụ": "💵",
      "Side job": "💼",
      "Đầu tư": "📈",
    };
    return icons[category] || "💰";
  };

  return (
    <main className="max-w-md mx-auto p-4 space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lịch sử</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Xem giao dịch theo ngày
          </p>
        </div>
        <CalendarIcon className="h-8 w-8 text-purple-600" />
      </div>

      {/* Monthly Summary */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
        <CardContent className="p-5">
          <h3 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">
            Tháng {format(selectedDate, "MM/yyyy")}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Thu nhập
              </p>
              <p className="text-lg font-bold text-emerald-600">
                {formatCurrency(monthlyStats.income)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Chi tiêu
              </p>
              <p className="text-lg font-bold text-rose-600">
                {formatCurrency(monthlyStats.expense)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Số dư
              </p>
              <p className="text-lg font-bold text-purple-600">
                {formatCurrency(monthlyStats.balance)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Giao dịch
              </p>
              <p className="text-lg font-bold text-blue-600">
                {monthlyStats.transactionCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={vi}
            modifiers={{
              transaction: (date) =>
                transactionDates.has(date.toISOString().split("T")[0]),
            }}
            modifiersClassNames={{
              transaction:
                "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-purple-500 font-semibold",
            }}
            className="rounded-md"
          />
        </CardContent>
      </Card>

      {/* Selected Date Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {format(selectedDate, "dd MMMM yyyy", { locale: vi })}
          </h2>
          <Badge variant="outline" className="text-xs">
            {selectedTransactions.length} giao dịch
          </Badge>
        </div>

        {/* Income and Expense Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Thu nhập
                </span>
                <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-500">
                {formatCurrency(totalIncome)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200 dark:border-rose-800">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-rose-700 dark:text-rose-400">
                  Chi tiêu
                </span>
                <ArrowDownIcon className="h-4 w-4 text-rose-500" />
              </div>
              <p className="text-lg font-bold text-rose-600 dark:text-rose-500">
                {formatCurrency(totalExpense)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Net Balance */}
        {(totalIncome > 0 || totalExpense > 0) && (
          <Card
            className={cn(
              "border-2",
              totalIncome - totalExpense >= 0
                ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-400"
                : "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-400"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {totalIncome - totalExpense >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-rose-600" />
                  )}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Số dư ròng
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xl font-bold",
                    totalIncome - totalExpense >= 0
                      ? "text-emerald-600"
                      : "text-rose-600"
                  )}
                >
                  {formatCurrency(totalIncome - totalExpense)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Transactions List */}
      {selectedTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Danh sách giao dịch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                  transaction.type === "expense"
                    ? "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border-rose-200 dark:border-rose-800/50"
                    : "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800/50"
                )}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm",
                      transaction.type === "expense"
                        ? "bg-rose-100 dark:bg-rose-900/30"
                        : "bg-emerald-100 dark:bg-emerald-900/30"
                    )}
                  >
                    {getCategoryIcon(transaction.category)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {transaction.category}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span>
                        {new Date(transaction.date).toLocaleTimeString(
                          "vi-VN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                      {transaction.note && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">
                            {transaction.note}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "font-bold text-lg",
                      transaction.type === "expense"
                        ? "text-rose-600 dark:text-rose-500"
                        : "text-emerald-600 dark:text-emerald-500"
                    )}
                  >
                    {transaction.type === "expense" ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {selectedTransactions.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Không có giao dịch
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chưa có giao dịch nào trong ngày này
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
