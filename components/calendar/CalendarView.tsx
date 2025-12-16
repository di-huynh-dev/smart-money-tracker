"use client";

import { useState, useMemo } from "react";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatReadableDate } from "@/lib/helpers";
import { CalendarIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const transactions = useTransactionStore((state) => state.transactions);

  // Get all dates with transactions
  const transactionDates = useMemo(
    () =>
      new Set(
        transactions.map((t) => new Date(t.date).toISOString().split("T")[0])
      ),
    [transactions]
  );

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsSheetOpen(true);
    }
  };

  const selectedTransactions = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split("T")[0];
    return transactions.filter((t) => {
      const tDateStr = new Date(t.date).toISOString().split("T")[0];
      return tDateStr === dateStr;
    });
  }, [selectedDate, transactions]);

  const totalIncome = selectedTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = selectedTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Transaction Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border w-full"
            modifiers={{
              hasTransaction: (date) =>
                transactionDates.has(date.toISOString().split("T")[0]),
            }}
            modifiersClassNames={{
              hasTransaction: "bg-primary/10 font-bold",
            }}
          />
          <p className="text-sm text-muted-foreground mt-4">
            Dates with transactions are highlighted. Click a date to see
            details.
          </p>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>
              {selectedDate && formatReadableDate(selectedDate)}
            </SheetTitle>
          </SheetHeader>

          {selectedTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No transactions on this date
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <ArrowUpIcon className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">Income</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(totalIncome)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <ArrowDownIcon className="h-4 w-4 text-red-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">Expense</p>
                        <p className="text-lg font-semibold text-red-600">
                          {formatCurrency(totalExpense)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Transactions</h3>
                {selectedTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{transaction.category}</p>
                        <Badge
                          variant={
                            transaction.type === "income"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </div>
                      {transaction.note && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {transaction.note}
                        </p>
                      )}
                    </div>
                    <div
                      className={cn(
                        "font-semibold",
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
