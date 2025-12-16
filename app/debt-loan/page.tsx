"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDebtLoanStore } from "@/stores/useDebtLoanStore";
import { formatCurrency, formatDate } from "@/lib/helpers";
import {
  ArrowLeft,
  Plus,
  DollarSign,
  User,
  Calendar,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AddDebtLoanDialog } from "@/components/debt-loan/AddDebtLoanDialog";
import { PaymentDialog } from "@/components/debt-loan/PaymentDialog";

export default function DebtLoanPage() {
  const { items, getTotalDebt, getTotalLoan, getDueSoon } = useDebtLoanStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const debts = items.filter((item) => item.type === "debt" && !item.isPaid);
  const loans = items.filter((item) => item.type === "loan" && !item.isPaid);
  const dueSoon = getDueSoon(7);

  const handlePayment = (id: string) => {
    setSelectedItem(id);
    setIsPaymentDialogOpen(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pb-24">
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
          <h1 className="text-2xl font-bold">Nợ & Cho vay</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4" />
                <p className="text-sm opacity-90">Tổng nợ</p>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(getTotalDebt())}
              </p>
              <p className="text-xs opacity-75 mt-1">{debts.length} khoản nợ</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4" />
                <p className="text-sm opacity-90">Tổng cho vay</p>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(getTotalLoan())}
              </p>
              <p className="text-xs opacity-75 mt-1">
                {loans.length} khoản vay
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Due Soon Alert */}
        {dueSoon.length > 0 && (
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                  Sắp đến hạn
                </h3>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {dueSoon.length} khoản sắp đến hạn trong 7 ngày tới
              </p>
            </CardContent>
          </Card>
        )}

        {/* Add Button */}
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Thêm nợ/cho vay mới
        </Button>

        {/* Debts Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-rose-600" />
            Khoản nợ của tôi
          </h2>
          {debts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>Không có khoản nợ nào</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {debts.map((debt) => (
                <Card
                  key={debt.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{debt.description}</h3>
                          {debt.dueDate &&
                            new Date(debt.dueDate) <
                              new Date(
                                Date.now() + 7 * 24 * 60 * 60 * 1000
                              ) && (
                              <Badge variant="destructive" className="text-xs">
                                Sắp đến hạn
                              </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <User className="h-4 w-4" />
                          <span>Nợ {debt.person}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-rose-600">
                          {formatCurrency(debt.amount - debt.paidAmount)}
                        </p>
                        {debt.paidAmount > 0 && (
                          <p className="text-xs text-gray-500">
                            Đã trả {formatCurrency(debt.paidAmount)}
                          </p>
                        )}
                      </div>
                    </div>

                    {debt.dueDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>Đến hạn: {formatDate(debt.dueDate)}</span>
                      </div>
                    )}

                    <Button
                      onClick={() => handlePayment(debt.id)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Thanh toán
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Loans Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Khoản cho vay
          </h2>
          {loans.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>Không có khoản cho vay nào</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {loans.map((loan) => (
                <Card
                  key={loan.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{loan.description}</h3>
                          {loan.dueDate &&
                            new Date(loan.dueDate) <
                              new Date(
                                Date.now() + 7 * 24 * 60 * 60 * 1000
                              ) && (
                              <Badge variant="secondary" className="text-xs">
                                Sắp đến hạn
                              </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <User className="h-4 w-4" />
                          <span>Cho {loan.person} vay</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-emerald-600">
                          {formatCurrency(loan.amount - loan.paidAmount)}
                        </p>
                        {loan.paidAmount > 0 && (
                          <p className="text-xs text-gray-500">
                            Đã nhận {formatCurrency(loan.paidAmount)}
                          </p>
                        )}
                      </div>
                    </div>

                    {loan.dueDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>Đến hạn: {formatDate(loan.dueDate)}</span>
                      </div>
                    )}

                    <Button
                      onClick={() => handlePayment(loan.id)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Ghi nhận thanh toán
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddDebtLoanDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
      <PaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        itemId={selectedItem}
      />
    </main>
  );
}
