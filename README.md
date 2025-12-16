# Project Specification: Personal Finance Management Web App

## 1. Project Overview

A responsive web application for personal finance management (PFM). The app allows users to track income/expenses, set budgets, view reports, and manage daily financial activities.
**Target Platform:** Mobile-first Web App (PWA ready).

## 2. Tech Stack

- **Frontend:** ReactJS (Vite), TypeScript.
- **UI Framework:** Tailwind CSS.
- **Component Library:** **shadcn/ui** (Critical requirement).
- **State Management:** Zustand or React Context API.
- **Charts:** Recharts or Chart.js.
- **Date Handling:** date-fns.
- **Icons:** Lucide React.
- **Data Export:** xlsx (for Excel), jspdf (for PDF).

## 3. Core Features & Requirements

### 3.1. Onboarding & Settings

- **Theme:** Support Light/Dark mode using `shadcn/ui` theme toggle. Allow selecting "Accent Colors" (e.g., Blue, Green, Violet).
- **Fiscal Settings:** User can select the **Start Day of the Month** (e.g., Start on the 1st or the 15th).
- **Currency:** Default to VND (Vietnam Dong).

### 3.2. Transaction Management (Core)

- **Input UI:**
  - Use a **Tabs Component** to switch between **Income** and **Expense**.
  - **Fields:**
    - Amount (Auto-format with thousand separators).
    - Date (Default: Today. Use a Calendar picker).
    - Category (Select from dropdown/combobox).
    - Note (Text input).
- **Categories:**
  - **Expense Defaults:** Food & Beverage, Daily Living, Clothing, Cosmetics, Transportation, etc.
  - **Income Defaults:** Salary, Allowance, Side Hustle, Investment.
  - **Customization:** Allow users to Add new categories or Hide unused ones.

### 3.3. Calendar View (History)

- **Calendar UI:** Display a monthly calendar.
  - Dates with transactions should have a visual indicator (dot or color).
- **Interaction:** Clicking a specific date opens a detail view (Drawer or Modal) showing:
  - Total Income for that day.
  - Total Expense for that day.
  - List of transactions for that day.

### 3.4. Reporting & Analytics (Chart Tab)

- **Pie Chart:** Expense Structure (distribution by category).
- **Bar Chart:** Monthly Income vs. Expense comparison.
- **Trend Line:** Expense trend comparison (This Month vs. Last Month).
- **Cashflow:** Real-time cash flow visualization.

### 3.5. Planning & Budgeting

- **Budget Setup:** Allow setting a monthly limit for specific categories (e.g., "Food: 2,000,000 VND").
- **Progress Tracking:** Display a Progress Bar for each budgeted category.
  - Green: < 80%
  - Yellow: 80% - 99%
  - Red: >= 100%
- **Alerts:** Show a Toast Notification if a new transaction causes a budget overflow.
- **Recurring Transactions:** Feature to auto-add fixed costs (Rent, Netflix, Spotify) daily/weekly/monthly.

### 3.6. Data Export

- **Formats:** Export data to **Excel (.xlsx)** and **Word/PDF**.
- **Scope:** Export list of transactions filtered by month.

### 3.7. Monetization (Free vs. Premium)

- **Logic:** Implement a `isPremium` user state.
- **Free Plan:**
  - Show Advertisement placeholders (Banner at bottom, Interstitial on Report tab).
  - Limited Budget slots.
- **Premium Plan:**
  - No Ads.
  - Unlimited Budgets.
  - Advanced Export features.

### 3.8. Gamification (Engagement)

- **Badges:** Unlock visual badges for achievements (e.g., "Under Budget for 7 Days").
- **Compliments:** Display random encouraging messages when the user saves money.
