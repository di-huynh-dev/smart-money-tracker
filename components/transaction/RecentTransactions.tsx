"use client";

import { useMemo } from "react";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatReadableDate } from "@/lib/helpers";
import { ArrowDownIcon, ArrowUpIcon, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecentTransactions({ limit = 10 }: { limit?: number }) {
  const transactions = useTransactionStore((state) => state.transactions);

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit),
    [transactions, limit]
  );

  if (recentTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No transactions yet. Add your first transaction above!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    transaction.type === "income"
                      ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  )}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpIcon className="h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.category}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatReadableDate(new Date(transaction.date))}
                  </p>
                  {transaction.note && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {transaction.note}
                    </p>
                  )}
                </div>
              </div>
              <div
                className={cn(
                  "font-semibold",
                  transaction.type === "income"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
