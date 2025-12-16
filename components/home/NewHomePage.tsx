"use client";

import { useMemo, useEffect, useState } from "react";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useStreakStore } from "@/stores/useStreakStore";
import { useDebtLoanStore } from "@/stores/useDebtLoanStore";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getFiscalMonth } from "@/lib/helpers";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  TrendingUp,
  Calendar,
  Flame,
  Bell,
  AlertCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";

export function NewHomePage() {
  const [isMounted, setIsMounted] = useState(false);

  const transactions = useTransactionStore((state) => state.transactions);
  const startDayOfMonth = useSettingsStore(
    (state) => state.settings.startDayOfMonth
  );

  const currentStreak = useStreakStore((state) => state.currentStreak);
  const longestStreak = useStreakStore((state) => state.longestStreak);
  const getStreakIcon = useStreakStore((state) => state.getStreakIcon);
  const getStreakMessage = useStreakStore((state) => state.getStreakMessage);
  const updateStreak = useStreakStore((state) => state.updateStreak);

  const getTotalDebt = useDebtLoanStore((state) => state.getTotalDebt);
  const getTotalLoan = useDebtLoanStore((state) => state.getTotalLoan);
  const getDueSoonDebtLoans = useDebtLoanStore((state) => state.getDueSoon);

  const getDueToday = useSubscriptionStore((state) => state.getDueToday);
  const getDueSoonSubs = useSubscriptionStore((state) => state.getDueSoon);

  const totalDebt = useMemo(() => getTotalDebt(), [getTotalDebt]);
  const totalLoan = useMemo(() => getTotalLoan(), [getTotalLoan]);
  const dueSoonDebtLoans = useMemo(
    () => getDueSoonDebtLoans(7),
    [getDueSoonDebtLoans]
  );
  const dueTodaySubscriptions = useMemo(() => getDueToday(), [getDueToday]);
  const dueSoonSubscriptions = useMemo(
    () => getDueSoonSubs(3),
    [getDueSoonSubs]
  );

  const { start, end } = useMemo(
    () => getFiscalMonth(new Date(), startDayOfMonth),
    [startDayOfMonth]
  );

  const currentMonthTransactions = useMemo(
    () =>
      transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= start && tDate <= end;
      }),
    [transactions, start, end]
  );

  const totalIncome = useMemo(
    () =>
      currentMonthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [currentMonthTransactions]
  );

  const totalExpense = useMemo(
    () =>
      currentMonthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [currentMonthTransactions]
  );

  // Calculate today's spending
  const todayTransactions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      tDate.setHours(0, 0, 0, 0);
      return tDate.getTime() === today.getTime();
    });
  }, [transactions]);

  const todaySpending = useMemo(
    () =>
      todayTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [todayTransactions]
  );

  // Calculate daily budget from remaining balance
  const dailyBudget = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();
    const remainingDays = daysInMonth - now.getDate() + 1;
    const remainingBudget = totalIncome - totalExpense;
    return remainingDays > 0 ? Math.max(0, remainingBudget / remainingDays) : 0;
  }, [totalIncome, totalExpense]);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update streak daily
  useEffect(() => {
    if (isMounted) {
      updateStreak(todaySpending, dailyBudget);
    }
  }, [isMounted, todaySpending, dailyBudget, updateStreak]);

  const balance = totalIncome - totalExpense;

  const currentMonth = new Date().toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  // Prevent hydration mismatch by not rendering store data until mounted
  if (!isMounted) {
    return (
      <main className="max-w-md mx-auto p-4 space-y-4 pb-24">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <p className="text-sm text-white/80 mb-2">Tổng số dư</p>
            <h1 className="text-4xl font-bold mb-1">{formatCurrency(0)}</h1>
            <p className="text-xs text-white/70">{currentMonth}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto p-4 space-y-5 pb-24">
      {/* Streak Card - Đặt lên đầu để nổi bật */}
      <Link href="/streak">
        <Card className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white border-0 cursor-pointer hover:shadow-2xl transition-all hover:scale-[1.02] shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-5xl animate-pulse">{getStreakIcon()}</div>
                <div>
                  <p className="text-xs opacity-90 mb-1 font-medium">
                    Chuỗi hiện tại
                  </p>
                  <p className="text-3xl font-bold">{currentStreak} ngày</p>
                  <p className="text-xs opacity-90 mt-1">
                    {getStreakMessage()}
                  </p>
                </div>
              </div>
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-3 min-w-[70px]">
                <p className="text-xs opacity-80 font-medium">Kỷ lục</p>
                <p className="text-2xl font-bold">{longestStreak}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-white/80 font-medium">Tổng số dư</p>
              <h1 className="text-4xl font-bold mt-1">
                {formatCurrency(balance)}
              </h1>
              <p className="text-xs text-white/70 mt-1">{currentMonth}</p>
            </div>
            <div className="text-6xl opacity-20">💎</div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      {(dueTodaySubscriptions.length > 0 ||
        dueSoonSubscriptions.length > 0 ||
        dueSoonDebtLoans.length > 0) && (
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:border-amber-800 dark:from-amber-950/30 dark:to-orange-950/30 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
                <Bell className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              </div>
              <div className="flex-1 space-y-2">
                {dueTodaySubscriptions.map((sub) => (
                  <p
                    key={sub.id}
                    className="text-sm text-amber-800 dark:text-amber-200"
                  >
                    🔔 <strong>{sub.name}</strong> - Hôm nay thanh toán{" "}
                    {formatCurrency(sub.amount)}
                  </p>
                ))}
                {dueSoonSubscriptions.map((sub) => (
                  <p
                    key={sub.id}
                    className="text-sm text-amber-700 dark:text-amber-300"
                  >
                    ⏰ <strong>{sub.name}</strong> sắp đến hạn thanh toán
                  </p>
                ))}
                {dueSoonDebtLoans.map((item) => (
                  <p
                    key={item.id}
                    className="text-sm text-amber-700 dark:text-amber-300"
                  >
                    💰 Nhắc nhở: {item.type === "debt" ? "Trả nợ" : "Thu nợ"}{" "}
                    <strong>{item.person}</strong> -{" "}
                    {formatCurrency(item.amount - item.paidAmount)}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Income & Expense Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Income Card */}
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-white/20">
                <ArrowDownIcon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Thu nhập</span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-xs opacity-90">Tháng này</p>
          </CardContent>
        </Card>

        {/* Expense Card */}
        <Card className="bg-gradient-to-br from-rose-500 to-pink-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-white/20">
                <ArrowUpIcon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Chi tiêu</span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {formatCurrency(totalExpense)}
            </p>
            <p className="text-xs opacity-90">Tháng này</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4">
        <Link href="/add">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <Plus className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Thêm mới</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reports">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Báo cáo</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/calendar">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium">Lịch sử</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* New Features */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Tính Năng Mới</h3>
          <div className="grid grid-cols-3 gap-4">
            <Link href="/wishlist">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="text-4xl mb-2">🎁</div>
                  <span className="text-xs font-medium text-center">
                    Danh sách mong muốn
                  </span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/subscriptions">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="text-4xl mb-2">🔄</div>
                  <span className="text-xs font-medium text-center">
                    Đăng ký
                  </span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/debt-loan">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="text-4xl mb-2">💳</div>
                  <span className="text-xs font-medium text-center">
                    Nợ/Cho vay
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Daily Safe to Spend */}
      <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-2 border-blue-100 dark:border-blue-900 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  An toàn để tiêu hôm nay
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Còn lại từ ngân sách
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {formatCurrency(Math.max(0, dailyBudget - todaySpending))}
            </p>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              / {formatCurrency(dailyBudget)}
            </span>
          </div>
          {todaySpending > dailyBudget ? (
            <div className="bg-rose-100 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 rounded-lg p-3">
              <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">
                ⚠️ Đã vượt ngân sách hôm nay{" "}
                {formatCurrency(todaySpending - dailyBudget)}
              </p>
            </div>
          ) : (
            <div className="bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-lg p-3">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                ✅ Tiếp tục giữ vững để duy trì chuỗi!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
