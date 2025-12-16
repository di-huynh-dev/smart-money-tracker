import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DebtLoan } from "@/types";

interface DebtLoanStore {
  items: DebtLoan[];
  addItem: (
    item: Omit<
      DebtLoan,
      "id" | "createdAt" | "isPaid" | "paidAt" | "paidAmount"
    >
  ) => void;
  updateItem: (id: string, updates: Partial<DebtLoan>) => void;
  deleteItem: (id: string) => void;
  markAsPaid: (id: string) => void;
  addPayment: (id: string, amount: number) => void;
  getActiveDebts: () => DebtLoan[];
  getActiveLoans: () => DebtLoan[];
  getDueSoon: (days: number) => DebtLoan[];
  getTotalDebt: () => number;
  getTotalLoan: () => number;
}

export const useDebtLoanStore = create<DebtLoanStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const newItem: DebtLoan = {
          ...item,
          dueDate: item.dueDate ? new Date(item.dueDate) : null,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          isPaid: false,
          paidAt: null,
          paidAmount: 0,
        };
        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      markAsPaid: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  isPaid: true,
                  paidAt: new Date(),
                  paidAmount: item.amount,
                }
              : item
          ),
        }));
      },

      addPayment: (id, amount) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const newPaidAmount = Math.min(
                item.amount,
                item.paidAmount + amount
              );
              return {
                ...item,
                paidAmount: newPaidAmount,
                isPaid: newPaidAmount >= item.amount,
                paidAt: newPaidAmount >= item.amount ? new Date() : null,
              };
            }
            return item;
          }),
        }));
      },

      getActiveDebts: () => {
        return get().items.filter(
          (item) => item.type === "debt" && !item.isPaid
        );
      },

      getActiveLoans: () => {
        return get().items.filter(
          (item) => item.type === "loan" && !item.isPaid
        );
      },

      getDueSoon: (days) => {
        const now = new Date();
        const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

        return get().items.filter((item) => {
          if (item.isPaid || !item.dueDate) return false;
          const dueDate = new Date(item.dueDate);
          return dueDate >= now && dueDate <= futureDate;
        });
      },

      getTotalDebt: () => {
        return get()
          .items.filter((item) => item.type === "debt" && !item.isPaid)
          .reduce((sum, item) => sum + (item.amount - item.paidAmount), 0);
      },

      getTotalLoan: () => {
        return get()
          .items.filter((item) => item.type === "loan" && !item.isPaid)
          .reduce((sum, item) => sum + (item.amount - item.paidAmount), 0);
      },
    }),
    {
      name: "debt-loan-storage",
    }
  )
);
