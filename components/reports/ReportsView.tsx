"use client";

import { useMemo } from "react";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { formatCurrency, getFiscalMonth, getCurrentMonth } from "@/lib/helpers";
import { TrendingUp, PieChartIcon, BarChart3, Activity } from "lucide-react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
];

export function ReportsView() {
  const transactions = useTransactionStore((state) => state.transactions);
  const startDayOfMonth = useSettingsStore(
    (state) => state.settings.startDayOfMonth
  );

  const { start, end } = useMemo(
    () => getFiscalMonth(new Date(), startDayOfMonth),
    [startDayOfMonth]
  );
  const currentMonth = getCurrentMonth();

  // Current month transactions
  const currentMonthTransactions = useMemo(
    () =>
      transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= start && tDate <= end;
      }),
    [transactions, start, end]
  );

  // Expense by category
  const expensesByCategory = useMemo(
    () =>
      currentMonthTransactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>),
    [currentMonthTransactions]
  );

  const pieData = useMemo(
    () =>
      Object.entries(expensesByCategory).map(([name, value]) => ({
        name,
        value,
      })),
    [expensesByCategory]
  );

  // Monthly comparison (last 6 months)
  const last6Months = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return date.toISOString().slice(0, 7);
      }),
    []
  );

  const monthlyData = useMemo(
    () =>
      last6Months.map((month) => {
        const monthTransactions = transactions.filter(
          (t) => new Date(t.date).toISOString().slice(0, 7) === month
        );

        const income = monthTransactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);

        const expense = monthTransactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          month: new Date(month).toLocaleDateString("en-US", {
            month: "short",
          }),
          income,
          expense,
        };
      }),
    [last6Months, transactions]
  );

  // Cashflow trend
  const cashflowData = useMemo(
    () =>
      monthlyData.map((m) => ({
        month: m.month,
        balance: m.income - m.expense,
      })),
    [monthlyData]
  );

  return (
    <div className="space-y-6">
      {/* Expense Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Expense Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No expenses yet this month
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Income vs Expense */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Income vs Expense (Last 6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="income" fill="#00C49F" name="Income" />
              <Bar dataKey="expense" fill="#FF8042" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cashflow Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Cashflow Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={cashflowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#8884d8"
                strokeWidth={2}
                name="Balance"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
