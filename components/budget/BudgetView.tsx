"use client";

import { useState, useMemo } from "react";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  formatCurrency,
  getCurrentMonth,
  calculateBudgetPercentage,
  getBudgetStatus,
} from "@/lib/helpers";
import { Target, Plus, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function BudgetView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [limit, setLimit] = useState("");

  const budgets = useBudgetStore((state) => state.budgets);
  const addBudget = useBudgetStore((state) => state.addBudget);
  const allCategories = useCategoryStore((state) => state.categories);
  const categories = useMemo(
    () => allCategories.filter((c) => c.type === "expense" && !c.isHidden),
    [allCategories]
  );
  const transactions = useTransactionStore((state) => state.transactions);

  const currentMonth = getCurrentMonth();
  const currentBudgets = useMemo(
    () => budgets.filter((b) => b.month === currentMonth),
    [budgets, currentMonth]
  );

  // Calculate actual spent for each budget
  const budgetsWithSpent = currentBudgets.map((budget) => {
    const category = categories.find((c) => c.id === budget.categoryId);
    const spent = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === category?.name &&
          new Date(t.date).toISOString().slice(0, 7) === currentMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      ...budget,
      categoryName: category?.name || "Unknown",
      actualSpent: spent,
    };
  });

  const handleAddBudget = () => {
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    const limitNum = parseFloat(limit.replace(/,/g, ""));
    if (!limitNum || limitNum <= 0) {
      toast.error("Please enter a valid limit");
      return;
    }

    // Check if budget already exists
    const exists = currentBudgets.some(
      (b) => b.categoryId === selectedCategory
    );
    if (exists) {
      toast.error("Budget already exists for this category");
      return;
    }

    addBudget({
      categoryId: selectedCategory,
      limit: limitNum,
      month: currentMonth,
    });

    toast.success("Budget added successfully!");
    setIsDialogOpen(false);
    setSelectedCategory("");
    setLimit("");
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      const formatted = parseInt(value).toLocaleString();
      setLimit(formatted);
    } else {
      setLimit("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Current Month Budgets</h2>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
              <DialogDescription>
                Set a spending limit for a category
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="limit">Monthly Limit (VND)</Label>
                <Input
                  id="limit"
                  placeholder="0"
                  value={limit}
                  onChange={handleLimitChange}
                />
              </div>
              <Button onClick={handleAddBudget} className="w-full">
                Create Budget
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {budgetsWithSpent.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No budgets set yet. Create your first budget to start tracking!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {budgetsWithSpent.map((budget) => {
            const percentage = calculateBudgetPercentage(
              budget.actualSpent,
              budget.limit
            );
            const status = getBudgetStatus(percentage);

            return (
              <Card key={budget.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{budget.categoryName}</span>
                    <span
                      className={cn(
                        "text-sm font-normal",
                        status === "success" && "text-green-600",
                        status === "warning" && "text-yellow-600",
                        status === "danger" && "text-red-600"
                      )}
                    >
                      {percentage.toFixed(0)}%
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress
                    value={Math.min(percentage, 100)}
                    className={cn(
                      "h-3",
                      status === "success" && "[&>div]:bg-green-500",
                      status === "warning" && "[&>div]:bg-yellow-500",
                      status === "danger" && "[&>div]:bg-red-500"
                    )}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="font-semibold">
                        {formatCurrency(budget.actualSpent)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Limit</p>
                      <p className="font-semibold">
                        {formatCurrency(budget.limit)}
                      </p>
                    </div>
                  </div>
                  {status === "danger" && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        ⚠️ Budget exceeded by{" "}
                        {formatCurrency(budget.actualSpent - budget.limit)}
                      </p>
                    </div>
                  )}
                  {status === "warning" && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                        ⚡ Approaching budget limit
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
