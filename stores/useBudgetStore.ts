import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Budget } from "@/types";

interface BudgetStore {
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, "id" | "spent" | "createdAt">) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  updateSpent: (categoryId: string, month: string, amount: number) => void;
  getBudgetByCategory: (
    categoryId: string,
    month: string
  ) => Budget | undefined;
  getBudgetsByMonth: (month: string) => Budget[];
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      budgets: [],

      addBudget: (budget) => {
        const newBudget: Budget = {
          ...budget,
          id: crypto.randomUUID(),
          spent: 0,
          createdAt: new Date(),
        };
        set((state) => ({
          budgets: [...state.budgets, newBudget],
        }));
      },

      updateBudget: (id, updates) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        }));
      },

      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        }));
      },

      updateSpent: (categoryId, month, amount) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.categoryId === categoryId && b.month === month
              ? { ...b, spent: b.spent + amount }
              : b
          ),
        }));
      },

      getBudgetByCategory: (categoryId, month) => {
        return get().budgets.find(
          (b) => b.categoryId === categoryId && b.month === month
        );
      },

      getBudgetsByMonth: (month) => {
        return get().budgets.filter((b) => b.month === month);
      },
    }),
    {
      name: "budget-storage",
    }
  )
);
