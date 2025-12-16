import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WishlistItem } from "@/types";

interface WishlistStore {
  items: WishlistItem[];
  addItem: (
    item: Omit<
      WishlistItem,
      | "id"
      | "createdAt"
      | "savedAmount"
      | "isPurchased"
      | "purchasedAt"
      | "isCancelled"
    >
  ) => void;
  updateItem: (id: string, updates: Partial<WishlistItem>) => void;
  deleteItem: (id: string) => void;
  purchaseItem: (id: string) => void;
  cancelItem: (id: string) => void;
  updateSavedAmount: (id: string, amount: number) => void;
  getWaitingItems: () => WishlistItem[];
  getReadyToBuyItems: () => WishlistItem[];
  getPurchasedItems: () => WishlistItem[];
}

const WAITING_DAYS = 30;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const newItem: WishlistItem = {
          ...item,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          savedAmount: 0,
          isPurchased: false,
          purchasedAt: null,
          isCancelled: false,
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

      purchaseItem: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, isPurchased: true, purchasedAt: new Date() }
              : item
          ),
        }));
      },

      cancelItem: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, isCancelled: true } : item
          ),
        }));
      },

      updateSavedAmount: (id, amount) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, savedAmount: amount } : item
          ),
        }));
      },

      getWaitingItems: () => {
        const now = new Date();
        return get().items.filter((item) => {
          if (item.isPurchased || item.isCancelled) return false;
          const daysSinceCreated = Math.floor(
            (now.getTime() - new Date(item.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return daysSinceCreated < WAITING_DAYS;
        });
      },

      getReadyToBuyItems: () => {
        const now = new Date();
        return get().items.filter((item) => {
          if (item.isPurchased || item.isCancelled) return false;
          const daysSinceCreated = Math.floor(
            (now.getTime() - new Date(item.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return daysSinceCreated >= WAITING_DAYS;
        });
      },

      getPurchasedItems: () => {
        return get().items.filter((item) => item.isPurchased);
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);
