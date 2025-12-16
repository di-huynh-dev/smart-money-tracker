"use client";

import { useMemo } from "react";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, getFiscalMonth } from "@/lib/helpers";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/components/layout/BottomNav";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function WalletPage() {
  const transactions = useTransactionStore((state) => state.transactions);
  const startDayOfMonth = useSettingsStore(
    (state) => state.settings.startDayOfMonth
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

  const balance = totalIncome - totalExpense;

  const allTimeIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const allTimeExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const allTimeBalance = allTimeIncome - allTimeExpense;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-md mx-auto pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
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
            <h1 className="text-2xl font-bold">Ví tiền</h1>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-5 w-5" />
                <p className="text-sm opacity-90">Số dư hiện tại</p>
              </div>
              <p className="text-4xl font-bold">{formatCurrency(balance)}</p>
              <p className="text-xs opacity-75 mt-2">
                {format(start, "dd MMM", { locale: vi })} -{" "}
                {format(end, "dd MMM yyyy", { locale: vi })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Current Month Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5" />
                <h3 className="font-semibold">Tháng này</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Thu nhập
                      </p>
                      <p className="text-xl font-bold text-emerald-600">
                        {formatCurrency(totalIncome)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
                      <TrendingDown className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Chi tiêu
                      </p>
                      <p className="text-xl font-bold text-rose-600">
                        {formatCurrency(totalExpense)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2 border-indigo-200 dark:border-indigo-800">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Số dư
                    </p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {formatCurrency(balance)}
                    </p>
                  </div>
                  <div className="text-4xl">💎</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Time Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Tổng cộng (toàn thời gian)</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tổng thu nhập
                  </span>
                  <span className="font-semibold text-emerald-600">
                    +{formatCurrency(allTimeIncome)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tổng chi tiêu
                  </span>
                  <span className="font-semibold text-rose-600">
                    -{formatCurrency(allTimeExpense)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="font-semibold">Tổng số dư</span>
                  <span className="text-xl font-bold text-indigo-600">
                    {formatCurrency(allTimeBalance)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/add?type=income">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                <TrendingUp className="h-4 w-4 mr-2" />
                Thêm thu nhập
              </Button>
            </Link>
            <Link href="/add?type=expense">
              <Button className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                <TrendingDown className="h-4 w-4 mr-2" />
                Thêm chi tiêu
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
