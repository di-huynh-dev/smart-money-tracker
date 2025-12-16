export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: Date;
  category: string;
  note: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  isDefault: boolean;
  isHidden: boolean;
  icon?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  spent: number;
  month: string; // Format: YYYY-MM
  createdAt: Date;
}

export interface RecurringTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  frequency: "daily" | "weekly" | "monthly";
  nextDueDate: Date;
  isActive: boolean;
}

export interface UserSettings {
  currency: string;
  startDayOfMonth: number;
  theme: "light" | "dark" | "system";
  accentColor: "blue" | "green" | "violet" | "orange" | "red";
}

export interface UserState {
  isPremium: boolean;
  badges: Badge[];
  joinedDate: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date | null;
  isUnlocked: boolean;
}

export interface MonthlyReport {
  month: string; // Format: YYYY-MM
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expensesByCategory: { [category: string]: number };
}

export interface DailyTotal {
  date: string; // Format: YYYY-MM-DD
  totalIncome: number;
  totalExpense: number;
  transactions: Transaction[];
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
  createdAt: Date;
  savedAmount: number;
  isPurchased: boolean;
  purchasedAt: Date | null;
  isCancelled: boolean;
}

export interface DebtLoan {
  id: string;
  type: "debt" | "loan"; // debt: bạn nợ người khác, loan: người khác nợ bạn
  person: string;
  amount: number;
  paidAmount: number;
  description: string;
  createdAt: Date;
  dueDate: Date | null;
  isPaid: boolean;
  paidAt: Date | null;
  note?: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  description?: string;
  billingCycle: "daily" | "weekly" | "monthly" | "yearly";
  nextBillingDate: Date;
  isActive: boolean;
  category?: string;
  createdAt: Date;
}

export interface DailyStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // Format: YYYY-MM-DD
  totalSavingDays: number;
  totalOverspendDays: number;
}
