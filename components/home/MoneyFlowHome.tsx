"use client";

import { useMemo, useEffect, useState } from "react";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useStreakStore } from "@/stores/useStreakStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getFiscalMonth } from "@/lib/helpers";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Settings,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Flame,
  Menu,
  PieChart,
  CreditCard,
  Calendar as CalendarIcon,
  Heart,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  format,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PeriodType = "day" | "week" | "month";
type ChartTab = "expense" | "both" | "income";

export function MoneyFlowHome() {
  const [isMounted, setIsMounted] = useState(false);
  const [periodType, setPeriodType] = useState<PeriodType>("month");
  const [chartTab, setChartTab] = useState<ChartTab>("expense");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const transactions = useTransactionStore((state) => state.transactions);
  const categories = useCategoryStore((state) => state.categories);
  const startDayOfMonth = useSettingsStore(
    (state) => state.settings.startDayOfMonth
  );
  const currentStreak = useStreakStore((state) => state.currentStreak);
  const getStreakIcon = useStreakStore((state) => state.getStreakIcon);

  useEffect(() => {
    // Set mounted flag after first render to avoid hydration mismatch
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Get date range based on period type
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
        return getFiscalMonth(now, startDayOfMonth);
    }
  }, [periodType, startDayOfMonth]);

  // Filter transactions by period
  const periodTransactions = useMemo(
    () =>
      transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= dateRange.start && tDate <= dateRange.end;
      }),
    [transactions, dateRange]
  );

  const totalIncome = useMemo(
    () =>
      periodTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [periodTransactions]
  );

  const totalExpense = useMemo(
    () =>
      periodTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [periodTransactions]
  );

  // Get category totals
  const categoryTotals = useMemo(() => {
    const totals = new Map<string, number>();
    periodTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const current = totals.get(t.category) || 0;
        totals.set(t.category, current + t.amount);
      });

    const sorted = Array.from(totals.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage:
          totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return sorted.slice(0, 5);
  }, [periodTransactions, totalExpense]);

  // Get recent transactions
  const recentTransactions = useMemo(() => {
    return [...periodTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [periodTransactions]);

  // Chart data for bar chart
  const chartData = useMemo(() => {
    if (periodType === "month") {
      // Group by day of month
      const dailyData = new Map<number, { income: number; expense: number }>();

      periodTransactions.forEach((t) => {
        const day = new Date(t.date).getDate();
        const current = dailyData.get(day) || { income: 0, expense: 0 };
        if (t.type === "income") {
          current.income += t.amount;
        } else {
          current.expense += t.amount;
        }
        dailyData.set(day, current);
      });

      const daysInMonth = endOfMonth(dateRange.start).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const data = dailyData.get(day) || { income: 0, expense: 0 };
        return {
          name: day.toString().padStart(2, "0"),
          Chi: data.expense / 1000,
          Thu: data.income / 1000,
        };
      });
    }
    return [];
  }, [periodTransactions, periodType, dateRange]);

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
      Lương: "💰",
      "Tiền phụ": "💵",
      "Side job": "💼",
      "Đầu tư": "📈",
    };
    return icons[category] || "💰";
  };

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-md mx-auto p-4 space-y-4 pb-24">
          <div className="h-8" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-md mx-auto pb-24">
        {/* Header with Logo */}
        <div className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-2">
                    <Link href="/reports" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <PieChart className="h-5 w-5 mr-3" />
                        Báo cáo & Thống kê
                      </Button>
                    </Link>
                    <Link href="/calendar" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <CalendarIcon className="h-5 w-5 mr-3" />
                        Lịch sử giao dịch
                      </Button>
                    </Link>
                    <Link
                      href="/debt-loan"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        <CreditCard className="h-5 w-5 mr-3" />
                        Nợ & Cho vay
                      </Button>
                    </Link>
                    <Link
                      href="/subscriptions"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        <TrendingDown className="h-5 w-5 mr-3" />
                        Dịch vụ định kỳ
                      </Button>
                    </Link>
                    <Link href="/wishlist" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Heart className="h-5 w-5 mr-3" />
                        Danh sách mong muốn
                      </Button>
                    </Link>
                    <Link href="/streak" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Flame className="h-5 w-5 mr-3" />
                        Streak tiết kiệm
                      </Button>
                    </Link>
                    <Link href="/settings" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="h-5 w-5 mr-3" />
                        Cài đặt
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">$</span>
              </div>
              <span className="font-semibold text-lg">MoneyFlow</span>
            </div>
            <Link href="/streak">
              <Button variant="ghost" size="sm" className="gap-2">
                <span className="text-xl">{getStreakIcon()}</span>
                <span className="font-bold">{currentStreak}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Greeting & Settings */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Xin chào!
              </p>
              <h1 className="text-xl font-bold">Quản lý chi tiêu</h1>
            </div>
          </div>

          {/* Income & Expense Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownIcon className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    Thu nhập
                  </span>
                </div>
                <p className="text-xl font-bold text-emerald-600">
                  {formatCurrency(totalIncome)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200 dark:border-rose-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpIcon className="h-4 w-4 text-rose-600" />
                  <span className="text-xs font-medium text-rose-700 dark:text-rose-400">
                    Chi tiêu
                  </span>
                </div>
                <p className="text-xl font-bold text-rose-600">
                  {formatCurrency(totalExpense)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Time Period Selector */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Select
                    value={periodType}
                    onValueChange={(v) => setPeriodType(v as PeriodType)}
                  >
                    <SelectTrigger className="w-[140px] border-0 shadow-none pl-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Hôm nay</SelectItem>
                      <SelectItem value="week">Tuần này</SelectItem>
                      <SelectItem value="month">Tháng này</SelectItem>
                    </SelectContent>
                  </Select>

                  <Tabs
                    value={periodType}
                    onValueChange={(v) => setPeriodType(v as PeriodType)}
                  >
                    <TabsList className="h-8">
                      <TabsTrigger value="day" className="text-xs px-3">
                        Ngày
                      </TabsTrigger>
                      <TabsTrigger value="week" className="text-xs px-3">
                        Tuần
                      </TabsTrigger>
                      <TabsTrigger value="month" className="text-xs px-3">
                        Tháng
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(dateRange.start, "MMMM yyyy", { locale: vi })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart Section */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    <h3 className="font-semibold">Biểu đồ</h3>
                  </div>

                  <Tabs
                    value={chartTab}
                    onValueChange={(v) => setChartTab(v as ChartTab)}
                  >
                    <TabsList className="h-8">
                      <TabsTrigger value="expense" className="text-xs px-3">
                        Chi
                      </TabsTrigger>
                      <TabsTrigger value="both" className="text-xs px-3">
                        Cả 2
                      </TabsTrigger>
                      <TabsTrigger value="income" className="text-xs px-3">
                        Thu
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Bar Chart */}
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10 }}
                        stroke="#999"
                      />
                      <YAxis hide />
                      <Tooltip
                        formatter={(value: number | undefined) =>
                          formatCurrency((value || 0) * 1000)
                        }
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      {chartTab === "expense" && (
                        <Bar
                          dataKey="Chi"
                          fill="#f43f5e"
                          radius={[4, 4, 0, 0]}
                        />
                      )}
                      {chartTab === "income" && (
                        <Bar
                          dataKey="Thu"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                        />
                      )}
                      {chartTab === "both" && (
                        <>
                          <Bar
                            dataKey="Chi"
                            fill="#f43f5e"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="Thu"
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                          />
                        </>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Chi tiêu
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Thu nhập
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <span className="text-rose-600">
                      -{formatCurrency(totalExpense)}
                    </span>
                    <span className="text-emerald-600">
                      +{formatCurrency(totalIncome)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Danh mục hàng đầu</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {categoryTotals.length} danh mục
                  </span>
                </div>

                <div className="space-y-3">
                  {categoryTotals.map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center text-lg">
                            {getCategoryIcon(item.category)}
                          </div>
                          <span className="font-medium">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(item.amount)}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {item.percentage}%
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Giao dịch gần đây</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {recentTransactions.length} giao dịch
                  </span>
                </div>

                <div className="space-y-2">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 flex items-center justify-center text-lg">
                          {getCategoryIcon(transaction.category)}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.category}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {format(
                              new Date(transaction.date),
                              "dd MMM, HH:mm",
                              {
                                locale: vi,
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <p
                        className={cn(
                          "font-semibold",
                          transaction.type === "income"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        )}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
