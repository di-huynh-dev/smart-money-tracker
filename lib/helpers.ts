/**
 * Format number with thousand separators for VND currency
 */
export function formatCurrency(amount: number, currency = "VND"): string {
  // Ensure amount is a valid number
  const validAmount = Number(amount) || 0;

  if (currency === "VND") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(validAmount);
  }
  return validAmount.toLocaleString();
}

/**
 * Parse currency string to number
 * Removes all non-numeric characters except decimal point
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format number input with thousand separators while typing
 */
export function formatNumberInput(value: string): string {
  const numericValue = value.replace(/[^0-9]/g, "");
  if (!numericValue) return "";
  return parseInt(numericValue).toLocaleString("vi-VN");
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Format date to readable format
 */
export function formatReadableDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Get current month in YYYY-MM format
 */
export function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

/**
 * Get start and end dates of a fiscal month based on start day
 */
export function getFiscalMonth(
  date: Date,
  startDay: number
): { start: Date; end: Date } {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  let startDate: Date;
  let endDate: Date;

  if (day >= startDay) {
    // Current fiscal month starts on startDay of current month
    startDate = new Date(year, month, startDay);
    endDate = new Date(year, month + 1, startDay - 1);
  } else {
    // Current fiscal month started in previous month
    startDate = new Date(year, month - 1, startDay);
    endDate = new Date(year, month, startDay - 1);
  }

  return { start: startDate, end: endDate };
}

/**
 * Calculate budget percentage
 */
export function calculateBudgetPercentage(
  spent: number,
  limit: number
): number {
  if (limit === 0) return 0;
  return (spent / limit) * 100;
}

/**
 * Get budget status color
 */
export function getBudgetStatus(
  percentage: number
): "success" | "warning" | "danger" {
  if (percentage >= 100) return "danger";
  if (percentage >= 80) return "warning";
  return "success";
}

/**
 * Generate encouraging messages
 */
export function getEncouragingMessage(): string {
  const messages = [
    "Great job staying on track! 🎉",
    "You're doing amazing with your budget! 💪",
    "Keep up the excellent work! ⭐",
    "Your financial discipline is inspiring! 🌟",
    "Smart spending today, wealthy tomorrow! 💰",
    "You're a budget master! 🏆",
    "Every penny saved is a penny earned! 💵",
    "Financial freedom is within reach! 🚀",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
