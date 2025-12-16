import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Subscription } from "@/types";

interface SubscriptionStore {
  subscriptions: Subscription[];
  addSubscription: (sub: Omit<Subscription, "id" | "createdAt">) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  toggleActive: (id: string) => void;
  cancelSubscription: (id: string) => void;
  processPayment: (id: string) => void;
  getDueToday: () => Subscription[];
  getDueSoon: (days: number) => Subscription[];
  getTotalMonthly: () => number;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      subscriptions: [],

      addSubscription: (sub) => {
        const newSub: Subscription = {
          ...sub,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          nextBillingDate: new Date(sub.nextBillingDate),
        };
        set((state) => ({
          subscriptions: [...state.subscriptions, newSub],
        }));
      },

      updateSubscription: (id, updates) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, ...updates } : sub
          ),
        }));
      },

      deleteSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        }));
      },

      toggleActive: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, isActive: !sub.isActive } : sub
          ),
        }));
      },

      cancelSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, isActive: false } : sub
          ),
        }));
      },

      processPayment: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) => {
            if (sub.id === id) {
              const nextDate = new Date(sub.nextBillingDate);

              switch (sub.billingCycle) {
                case "daily":
                  nextDate.setDate(nextDate.getDate() + 1);
                  break;
                case "weekly":
                  nextDate.setDate(nextDate.getDate() + 7);
                  break;
                case "monthly":
                  nextDate.setMonth(nextDate.getMonth() + 1);
                  break;
                case "yearly":
                  nextDate.setFullYear(nextDate.getFullYear() + 1);
                  break;
              }

              return { ...sub, nextBillingDate: nextDate };
            }
            return sub;
          }),
        }));
      },

      getDueToday: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().subscriptions.filter((sub) => {
          if (!sub.isActive) return false;
          const dueDate = new Date(sub.nextBillingDate)
            .toISOString()
            .split("T")[0];
          return dueDate === today;
        });
      },

      getDueSoon: (days) => {
        const now = new Date();
        const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

        return get().subscriptions.filter((sub) => {
          if (!sub.isActive) return false;
          const dueDate = new Date(sub.nextBillingDate);
          return dueDate >= now && dueDate <= futureDate;
        });
      },

      getTotalMonthly: () => {
        return get()
          .subscriptions.filter((sub) => sub.isActive)
          .reduce((sum, sub) => {
            let monthlyAmount = sub.amount;

            switch (sub.billingCycle) {
              case "daily":
                monthlyAmount = sub.amount * 30;
                break;
              case "weekly":
                monthlyAmount = sub.amount * 4;
                break;
              case "yearly":
                monthlyAmount = sub.amount / 12;
                break;
            }

            return sum + monthlyAmount;
          }, 0);
      },
    }),
    {
      name: "subscription-storage",
    }
  )
);
