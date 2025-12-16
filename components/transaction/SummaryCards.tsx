"use client";

import { useMemo } from "react";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, getFiscalMonth, getCurrentMonth } from "@/lib/helpers";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { ArrowDownIcon, ArrowUpIcon, Wallet } from "lucide-react";

export function SummaryCards() {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Income</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full dark:bg-green-900/20">
              <ArrowUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expense</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totalExpense)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full dark:bg-red-900/20">
              <ArrowDownIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/20">
              <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
