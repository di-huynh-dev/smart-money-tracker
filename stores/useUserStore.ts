import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserState, Badge } from "@/types";

interface UserStore extends UserState {
  unlockBadge: (badgeId: string) => void;
  initializeBadges: () => void;
}

const defaultBadges: Badge[] = [
  {
    id: "first-transaction",
    name: "Getting Started",
    description: "Added your first transaction",
    icon: "🎯",
    unlockedAt: null,
    isUnlocked: false,
  },
  {
    id: "under-budget-7",
    name: "Budget Master",
    description: "Stayed under budget for 7 consecutive days",
    icon: "💪",
    unlockedAt: null,
    isUnlocked: false,
  },
  {
    id: "under-budget-30",
    name: "Money Saver",
    description: "Stayed under budget for 30 consecutive days",
    icon: "🏆",
    unlockedAt: null,
    isUnlocked: false,
  },
  {
    id: "no-expense-day",
    name: "Zero Spending",
    description: "Had a day with no expenses",
    icon: "🌟",
    unlockedAt: null,
    isUnlocked: false,
  },
  {
    id: "tracker-week",
    name: "Consistent Tracker",
    description: "Logged transactions for 7 consecutive days",
    icon: "📊",
    unlockedAt: null,
    isUnlocked: false,
  },
];

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      isPremium: false,
      badges: [],
      joinedDate: new Date(),

      unlockBadge: (badgeId) => {
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === badgeId && !b.isUnlocked
              ? { ...b, isUnlocked: true, unlockedAt: new Date() }
              : b
          ),
        }));
      },

      initializeBadges: () => {
        const existingBadges = get().badges;
        if (existingBadges.length === 0) {
          set({ badges: defaultBadges });
        }
      },
    }),
    {
      name: "user-storage",
    }
  )
);
