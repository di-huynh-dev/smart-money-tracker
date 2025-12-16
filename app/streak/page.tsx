"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStreakStore } from "@/stores/useStreakStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { formatCurrency } from "@/lib/helpers";
import { ArrowLeft, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { startOfDay, format, subDays } from "date-fns";

export default function StreakPage() {
  const {
    currentStreak,
    longestStreak,
    updateStreak,
    getStreakIcon,
    getStreakMessage,
  } = useStreakStore();
  const { budgets } = useBudgetStore();
  const { transactions } = useTransactionStore();

  const today = useMemo(() => startOfDay(new Date()), []);

  // Calculate total monthly budget from all budgets
  const totalMonthlyBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const dailyBudget = totalMonthlyBudget / 30;

  // Calculate today's spending
  const todaySpending = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          startOfDay(new Date(t.date)).getTime() === today.getTime()
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, today]);

  // Update streak on mount
  useEffect(() => {
    updateStreak(todaySpending, dailyBudget);
  }, [todaySpending, dailyBudget, updateStreak]);

  // Get last 30 days history
  const last30Days = useMemo(() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dateString = startOfDay(date).getTime();

      const daySpending = transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            startOfDay(new Date(t.date)).getTime() === dateString
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const isWithinBudget = daySpending <= dailyBudget;

      days.push({
        date,
        spending: daySpending,
        isWithinBudget,
      });
    }
    return days;
  }, [transactions, today, dailyBudget]);

  const daysWithinBudget = last30Days.filter((d) => d.isWithinBudget).length;
  const daysOverBudget = 30 - daysWithinBudget;
  const successRate = ((daysWithinBudget / 30) * 100).toFixed(1);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
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
          <h1 className="text-2xl font-bold">Chuỗi tiết kiệm</h1>
        </div>

        {/* Main Streak Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">{getStreakIcon()}</div>
            <h2 className="text-4xl font-bold mb-2">{currentStreak} ngày</h2>
            <p className="text-lg opacity-90 mb-4">{getStreakMessage()}</p>
            <div className="flex items-center justify-center gap-2 text-sm opacity-75">
              <Calendar className="h-4 w-4" />
              <span>Kỷ lục: {longestStreak} ngày</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 space-y-6">
        {/* Today's Progress */}
        <Card className="border-2 border-orange-200 dark:border-orange-900">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Hôm nay
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Đã chi tiêu:
                </span>
                <span className="text-lg font-bold">
                  {formatCurrency(todaySpending)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Ngân sách hàng ngày:
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(dailyBudget)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="font-semibold">Còn lại:</span>
                <span
                  className={`text-xl font-bold ${
                    todaySpending <= dailyBudget
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {formatCurrency(Math.max(0, dailyBudget - todaySpending))}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="relative h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                    todaySpending <= dailyBudget
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                      : "bg-gradient-to-r from-rose-400 to-rose-600"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (todaySpending / dailyBudget) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 30-Day Statistics */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Thống kê 30 ngày
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  {daysWithinBudget}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Ngày đạt mục tiêu
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-600">
                  {daysOverBudget}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Ngày vượt ngân sách
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">
                  {successRate}%
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Tỷ lệ thành công
                </p>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {last30Days.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${
                    day.isWithinBudget
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200"
                      : "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200"
                  }`}
                  title={`${format(day.date, "dd/MM")}: ${formatCurrency(
                    day.spending
                  )}`}
                >
                  <span className="font-semibold">{format(day.date, "d")}</span>
                  {day.isWithinBudget ? "✓" : "✗"}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-900">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              💡 Mẹo duy trì chuỗi
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Kiểm tra ngân sách hàng ngày vào buổi sáng</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Ghi chép mọi khoản chi tiêu ngay lập tức</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  Ưu tiên chi tiêu cần thiết, hạn chế chi tiêu tự phát
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Đặt mục tiêu tiết kiệm rõ ràng để có động lực</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
