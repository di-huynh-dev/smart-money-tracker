import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DailyStreak } from "@/types";

interface StreakStore extends DailyStreak {
  updateStreak: (dailySpending: number, dailyBudget: number) => void;
  resetStreak: () => void;
  getStreakIcon: () => string;
  getStreakMessage: () => string;
}

export const useStreakStore = create<StreakStore>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: "",
      totalSavingDays: 0,
      totalOverspendDays: 0,

      updateStreak: (dailySpending, dailyBudget) => {
        const today = new Date().toISOString().split("T")[0];
        const state = get();

        // Nếu đã update hôm nay rồi thì không làm gì
        if (state.lastActiveDate === today) return;

        const isSaving = dailySpending <= dailyBudget;
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

        let newCurrentStreak = state.currentStreak;

        if (isSaving) {
          // Nếu hôm qua có streak, tăng lên
          if (state.lastActiveDate === yesterday) {
            newCurrentStreak += 1;
          } else {
            // Bắt đầu streak mới
            newCurrentStreak = 1;
          }
        } else {
          // Mất streak
          newCurrentStreak = 0;
        }

        const newLongestStreak = Math.max(
          newCurrentStreak,
          state.longestStreak
        );

        set({
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          lastActiveDate: today,
          totalSavingDays: isSaving
            ? state.totalSavingDays + 1
            : state.totalSavingDays,
          totalOverspendDays: !isSaving
            ? state.totalOverspendDays + 1
            : state.totalOverspendDays,
        });
      },

      resetStreak: () => {
        set({
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: "",
          totalSavingDays: 0,
          totalOverspendDays: 0,
        });
      },

      getStreakIcon: () => {
        const streak = get().currentStreak;
        if (streak >= 30) return "🏆";
        if (streak >= 21) return "💎";
        if (streak >= 14) return "⭐";
        if (streak >= 7) return "🔥";
        if (streak >= 3) return "✨";
        if (streak >= 1) return "👍";
        return "😢";
      },

      getStreakMessage: () => {
        const streak = get().currentStreak;
        if (streak >= 30) return "Huyền thoại! Kỷ luật tài chính xuất sắc!";
        if (streak >= 21) return "Tuyệt vời! Bạn đang làm rất tốt!";
        if (streak >= 14) return "Ấn tượng! Tiếp tục phát huy nhé!";
        if (streak >= 7) return "Tốt lắm! Một tuần hoàn hảo!";
        if (streak >= 3) return "Khởi đầu tốt! Cố gắng duy trì!";
        if (streak >= 1) return "Tốt! Hãy tiếp tục!";
        return "Hôm nay hơi quá ngân sách rồi!";
      },
    }),
    {
      name: "streak-storage",
    }
  )
);
