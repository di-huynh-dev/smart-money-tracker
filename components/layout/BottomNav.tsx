"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingDown, TrendingUp, Wallet, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Tổng quan" },
  { href: "/expenses", icon: TrendingDown, label: "Chi tiêu" },
  { href: "/add", icon: Plus, label: "", isCenter: true },
  { href: "/income", icon: TrendingUp, label: "Thu nhập" },
  { href: "/wallet", icon: Wallet, label: "Ví tiền" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t dark:border-slate-800 shadow-lg">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center relative"
              >
                <div className="absolute -top-6 w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors gap-1",
                isActive
                  ? "text-slate-800 dark:text-slate-200"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
