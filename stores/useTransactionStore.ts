import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction, TransactionType } from "@/types";

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByDate: (date: Date) => Transaction[];
  getTransactionsByMonth: (month: string) => Transaction[];
  getTransactionsByCategory: (
    category: string,
    type?: TransactionType
  ) => Transaction[];
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      updateTransaction: (id, updatedData) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updatedData } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      getTransactionsByDate: (date) => {
        const dateStr = date.toISOString().split("T")[0];
        return get().transactions.filter((t) => {
          const tDateStr = new Date(t.date).toISOString().split("T")[0];
          return tDateStr === dateStr;
        });
      },

      getTransactionsByMonth: (month) => {
        return get().transactions.filter((t) => {
          const tMonth = new Date(t.date).toISOString().slice(0, 7);
          return tMonth === month;
        });
      },

      getTransactionsByCategory: (category, type) => {
        return get().transactions.filter((t) => {
          const matchesCategory = t.category === category;
          const matchesType = !type || t.type === type;
          return matchesCategory && matchesType;
        });
      },
    }),
    {
      name: "transaction-storage",
    }
  )
);
