import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserSettings } from "@/types";

interface SettingsStore {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        currency: "VND",
        startDayOfMonth: 1,
        theme: "system",
        accentColor: "blue",
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },
    }),
    {
      name: "settings-storage",
    }
  )
);
