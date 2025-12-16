"use client";

import { useMemo, useState } from "react";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, getCurrentMonth } from "@/lib/helpers";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function NewBudgetView() {
  const transactions = useTransactionStore((state) => state.transactions);
  const budgets = useBudgetStore((state) => state.budgets);
  const allCategories = useCategoryStore((state) => state.categories);
  const settings = useSettingsStore((state) => state.settings);

  const currentMonth = getCurrentMonth();

  const currentBudgets = useMemo(
    () => budgets.filter((b) => b.month === currentMonth),
    [budgets, currentMonth]
  );

  const categories = useMemo(
    () => allCategories.filter((c) => c.type === "expense" && !c.isHidden),
    [allCategories]
  );

  // Calculate budget data
  const budgetsWithSpent = useMemo(() => {
    return currentBudgets.map((budget) => {
      const category = categories.find((c) => c.id === budget.categoryId);
      const spent = transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            t.category === category?.name &&
            new Date(t.date).toISOString().slice(0, 7) === currentMonth
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const percentage = (spent / budget.limit) * 100;

      return {
        ...budget,
        categoryName: category?.name || "",
        spent,
        percentage,
      };
    });
  }, [currentBudgets, categories, transactions, currentMonth]);

  // Calculate daily safe to spend
  const monthlyIncome = 15000000; // From settings
  const savingsGoal = 3000000;
  const fixedExpenses = 5000000;
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();
  const daysRemaining = daysInMonth - new Date().getDate() + 1;

  const totalSpent = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        new Date(t.date).toISOString().slice(0, 7) === currentMonth
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const availableToSpend = monthlyIncome - savingsGoal - fixedExpenses;
  const remainingBudget = availableToSpend - totalSpent;
  const dailySafeToSpend = Math.max(0, remainingBudget / daysRemaining);

  // Calculate days until payday
  const today = new Date();
  const payDay = new Date(today.getFullYear(), today.getMonth() + 1, 4);
  const daysUntilPayday = Math.ceil(
    (payDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Recent transactions
  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .filter(
          (t) => new Date(t.date).toISOString().slice(0, 7) === currentMonth
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [transactions, currentMonth]
  );

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Food & Beverage": "🍔",
      Transportation: "🚗",
      Entertainment: "🎮",
      Clothing: "👕",
      "Daily Living": "🏠",
      "Bubble Tea": "🧋",
    };
    return icons[category] || "💰";
  };

  return (
    <main className="max-w-md mx-auto p-4 space-y-4">
      {/* Daily Safe to Spend */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💰</span>
            <h3 className="font-semibold">Hôm nay bạn an toàn để tiêu</h3>
          </div>
          <p className="text-4xl font-bold text-purple-600 mb-2">
            {formatCurrency(dailySafeToSpend)}
          </p>
          <p className="text-sm text-gray-600">
            Dựa trên thu nhập, chi phí cố định và mục tiêu tiết kiệm của bạn
          </p>
        </CardContent>
      </Card>

      {/* Payday Countdown */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📅</span>
            <h3 className="font-semibold">Dự báo "Ngày cháy túi" 🔥</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ổn định</p>
              <p className="text-3xl font-bold text-blue-600">
                {daysUntilPayday} ngày
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Với tốc độ tiêu hiện tại, bạn sẽ hết tiền vào:
            </p>
            <p className="text-lg font-semibold text-blue-700">
              Thứ Tư, 04 tháng 03 2026
            </p>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t">
              <div>
                <p className="text-xs text-gray-600">
                  Chi tiêu TB/ngày (7 ngày qua)
                </p>
                <p className="text-lg font-bold">{formatCurrency(146429)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Số dư hiện tại</p>
                <p className="text-lg font-bold">
                  {formatCurrency(remainingBudget)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Budget Overview</h3>
            <span className="text-sm text-gray-600">
              {budgetsWithSpent.length} active
            </span>
          </div>

          <div className="space-y-4">
            {budgetsWithSpent.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No budgets set. Add one to start tracking!
              </p>
            ) : (
              budgetsWithSpent.map((budget) => (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getCategoryIcon(budget.categoryName)}
                      </span>
                      <span className="font-medium">{budget.categoryName}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatCurrency(budget.spent)} /{" "}
                      {formatCurrency(budget.limit)}
                    </span>
                  </div>
                  <Progress
                    value={budget.percentage}
                    className={`h-2 ${
                      budget.percentage >= 100
                        ? "bg-red-100"
                        : budget.percentage >= 80
                        ? "bg-yellow-100"
                        : "bg-gray-100"
                    }`}
                  />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Recent Transactions</h3>
            <Link href="/calendar">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No transactions yet
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <span className="text-xl">
                        {getCategoryIcon(transaction.category)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "numeric",
                            month: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === "expense"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {transaction.type === "expense" ? "-" : "+"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    {transaction.note && (
                      <p className="text-xs text-gray-500">
                        📝 {transaction.note}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
