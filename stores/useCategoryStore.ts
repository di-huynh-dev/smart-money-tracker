import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Category, TransactionType } from "@/types";

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  toggleCategoryVisibility: (id: string) => void;
  getCategoriesByType: (type: TransactionType) => Category[];
  initializeDefaultCategories: () => void;
}

const defaultExpenseCategories = [
  "Food & Beverage",
  "Daily Living",
  "Clothing",
  "Cosmetics",
  "Transportation",
  "Healthcare",
  "Entertainment",
  "Education",
  "Housing",
  "Utilities",
  "Insurance",
  "Shopping",
  "Others",
];

const defaultIncomeCategories = [
  "Salary",
  "Allowance",
  "Side Hustle",
  "Investment",
  "Gift",
  "Others",
];

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],

      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      toggleCategoryVisibility: (id) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, isHidden: !c.isHidden } : c
          ),
        }));
      },

      getCategoriesByType: (type) => {
        return get().categories.filter((c) => c.type === type && !c.isHidden);
      },

      initializeDefaultCategories: () => {
        const existingCategories = get().categories;
        if (existingCategories.length > 0) return;

        const expenseCategories: Category[] = defaultExpenseCategories.map(
          (name) => ({
            id: crypto.randomUUID(),
            name,
            type: "expense" as TransactionType,
            isDefault: true,
            isHidden: false,
          })
        );

        const incomeCategories: Category[] = defaultIncomeCategories.map(
          (name) => ({
            id: crypto.randomUUID(),
            name,
            type: "income" as TransactionType,
            isDefault: true,
            isHidden: false,
          })
        );

        set({ categories: [...expenseCategories, ...incomeCategories] });
      },
    }),
    {
      name: "category-storage",
    }
  )
);
