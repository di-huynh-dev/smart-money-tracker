// Fake Data for MoneyFlow App
// Copy và paste đoạn code này vào Console của trình duyệt (F12)

const fakeData = {
  transactions: [],
  categories: [
    { id: "cat-1", name: "Ăn uống", type: "expense", isHidden: false },
    { id: "cat-2", name: "Di chuyển", type: "expense", isHidden: false },
    { id: "cat-3", name: "Giải trí", type: "expense", isHidden: false },
    { id: "cat-4", name: "Quần áo", type: "expense", isHidden: false },
    { id: "cat-5", name: "Sinh hoạt", type: "expense", isHidden: false },
    { id: "cat-6", name: "Trà sữa", type: "expense", isHidden: false },
    { id: "cat-7", name: "Mua online", type: "expense", isHidden: false },
    { id: "cat-8", name: "AIU", type: "expense", isHidden: false },
    { id: "cat-9", name: "Lương", type: "income", isHidden: false },
    { id: "cat-10", name: "Tiền phụ", type: "income", isHidden: false },
    { id: "cat-11", name: "Side job", type: "income", isHidden: false },
  ],
  debtLoans: [
    {
      id: "debt-1",
      type: "debt",
      title: "Vay mua laptop",
      amount: 15000000,
      paidAmount: 5000000,
      person: "Anh Nam",
      dueDate: new Date("2026-01-15").toISOString(),
      note: "Trả góp 3 tháng",
      isPaid: false,
      payments: [
        { date: new Date("2025-12-01").toISOString(), amount: 5000000 },
      ],
    },
    {
      id: "loan-1",
      type: "loan",
      title: "Cho bạn vay",
      amount: 5000000,
      paidAmount: 2000000,
      person: "Hùng",
      dueDate: new Date("2025-12-25").toISOString(),
      note: "Đã thu về 2tr",
      isPaid: false,
      payments: [
        { date: new Date("2025-12-10").toISOString(), amount: 2000000 },
      ],
    },
  ],
  subscriptions: [
    {
      id: "sub-1",
      name: "Netflix",
      amount: 260000,
      billingCycle: "monthly",
      nextBillingDate: new Date("2026-01-01").toISOString(),
      category: "Giải trí",
      isActive: true,
      autoRenew: true,
    },
    {
      id: "sub-2",
      name: "Spotify",
      amount: 59000,
      billingCycle: "monthly",
      nextBillingDate: new Date("2025-12-20").toISOString(),
      category: "Giải trí",
      isActive: true,
      autoRenew: true,
    },
  ],
  wishlist: [
    {
      id: "wish-1",
      name: "iPhone 15 Pro",
      targetAmount: 30000000,
      savedAmount: 12000000,
      category: "Điện tử",
      priority: "high",
      deadline: new Date("2026-06-01").toISOString(),
      note: "Mua vào sinh nhật",
    },
    {
      id: "wish-2",
      name: "Du lịch Đà Lạt",
      targetAmount: 5000000,
      savedAmount: 3000000,
      category: "Du lịch",
      priority: "medium",
      deadline: new Date("2026-03-01").toISOString(),
      note: "Đi vào tháng 3",
    },
  ],
};

// Generate transactions for December 2025
const categories = {
  expense: [
    "Ăn uống",
    "Di chuyển",
    "Giải trí",
    "Trà sữa",
    "Mua online",
    "AIU",
    "Sinh hoạt",
  ],
  income: ["Lương", "Tiền phụ", "Side job"],
};

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

// Generate transactions for the past 30 days
for (let i = 0; i < 30; i++) {
  const date = new Date(currentYear, currentMonth, now.getDate() - i);

  // 2-4 expense transactions per day
  const numExpenses = Math.floor(Math.random() * 3) + 2;
  for (let j = 0; j < numExpenses; j++) {
    const category =
      categories.expense[Math.floor(Math.random() * categories.expense.length)];
    let amount;

    // Different amount ranges based on category
    switch (category) {
      case "Ăn uống":
        amount = Math.floor(Math.random() * 150000) + 30000; // 30k-180k
        break;
      case "Trà sữa":
        amount = Math.floor(Math.random() * 50000) + 25000; // 25k-75k
        break;
      case "Di chuyển":
        amount = Math.floor(Math.random() * 100000) + 20000; // 20k-120k
        break;
      case "Giải trí":
        amount = Math.floor(Math.random() * 300000) + 100000; // 100k-400k
        break;
      case "Mua online":
        amount = Math.floor(Math.random() * 500000) + 100000; // 100k-600k
        break;
      case "AIU":
        amount = Math.floor(Math.random() * 2000000) + 1000000; // 1tr-3tr
        break;
      default:
        amount = Math.floor(Math.random() * 200000) + 50000;
    }

    const hour = Math.floor(Math.random() * 14) + 7; // 7am - 9pm
    const minute = Math.floor(Math.random() * 60);
    date.setHours(hour, minute, 0, 0);

    fakeData.transactions.push({
      id: `tx-e-${i}-${j}-${Date.now()}`,
      type: "expense",
      amount: amount,
      category: category,
      date: new Date(date).toISOString(),
      note: "",
    });
  }
}

// Add some income transactions
const incomeDates = [1, 5, 15, 20, 25]; // Days when income comes
incomeDates.forEach((day, idx) => {
  if (day <= now.getDate()) {
    const date = new Date(currentYear, currentMonth, day, 9, 0, 0);
    const category = categories.income[idx % categories.income.length];
    let amount;

    switch (category) {
      case "Lương":
        amount = 15000000; // 15tr
        break;
      case "Tiền phụ":
        amount = Math.floor(Math.random() * 2000000) + 1000000; // 1tr-3tr
        break;
      case "Side job":
        amount = Math.floor(Math.random() * 5000000) + 2000000; // 2tr-7tr
        break;
      default:
        amount = 5000000;
    }

    fakeData.transactions.push({
      id: `tx-i-${idx}-${Date.now()}`,
      type: "income",
      amount: amount,
      category: category,
      date: date.toISOString(),
      note: "",
    });
  }
});

// Import to localStorage
console.log("🚀 Importing fake data...");

localStorage.setItem(
  "transaction-storage",
  JSON.stringify({
    state: { transactions: fakeData.transactions },
    version: 0,
  })
);

localStorage.setItem(
  "category-storage",
  JSON.stringify({
    state: { categories: fakeData.categories },
    version: 0,
  })
);

localStorage.setItem(
  "debt-loan-storage",
  JSON.stringify({
    state: { items: fakeData.debtLoans },
    version: 0,
  })
);

localStorage.setItem(
  "subscription-storage",
  JSON.stringify({
    state: { subscriptions: fakeData.subscriptions },
    version: 0,
  })
);

localStorage.setItem(
  "wishlist-storage",
  JSON.stringify({
    state: { items: fakeData.wishlist },
    version: 0,
  })
);

localStorage.setItem(
  "streak-storage",
  JSON.stringify({
    state: {
      currentStreak: 5,
      longestStreak: 12,
      lastUpdateDate: new Date().toISOString(),
    },
    version: 0,
  })
);

console.log("✅ Fake data imported successfully!");
console.log("📊 Summary:");
console.log(`- Transactions: ${fakeData.transactions.length}`);
console.log(`- Categories: ${fakeData.categories.length}`);
console.log(`- Debt/Loans: ${fakeData.debtLoans.length}`);
console.log(`- Subscriptions: ${fakeData.subscriptions.length}`);
console.log(`- Wishlist: ${fakeData.wishlist.length}`);
console.log("\n🔄 Reload trang để xem dữ liệu mới!");
