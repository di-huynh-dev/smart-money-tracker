"use client";

import { useState } from "react";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useUserStore } from "@/stores/useUserStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sun, Moon, Monitor, Eye, EyeOff, Crown } from "lucide-react";
import { useTheme } from "next-themes";
import { formatCurrency } from "@/lib/helpers";

export function NewSettingsView() {
  const { theme, setTheme } = useTheme();
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const categories = useCategoryStore((state) => state.categories);
  const toggleCategoryVisibility = useCategoryStore(
    (state) => state.toggleCategoryVisibility
  );
  const isPremium = useUserStore((state) => state.isPremium);

  const [monthlyIncome, setMonthlyIncome] = useState("15000000");
  const [savingsGoal, setSavingsGoal] = useState("3000000");
  const [fixedExpenses, setFixedExpenses] = useState("5000000");
  const [monkMode, setMonkMode] = useState(false);

  const accentColors = [
    { value: "blue", label: "Blue", color: "bg-blue-600" },
    { value: "green", label: "Green", color: "bg-green-600" },
    { value: "violet", label: "Violet", color: "bg-violet-600" },
    { value: "orange", label: "Orange", color: "bg-orange-600" },
  ];

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  const getCategoryIcon = (name: string) => {
    const icons: Record<string, string> = {
      "Food & Beverage": "🍔",
      "Daily Living": "🏠",
      Clothing: "👕",
      Cosmetics: "💄",
      Transportation: "🚗",
      Healthcare: "⚕️",
      Entertainment: "🎮",
      Education: "📚",
      "Bubble Tea": "🧋",
      Salary: "💰",
      Allowance: "💵",
      "Side Hustle": "💼",
      Investment: "📈",
    };
    return icons[name] || "💰";
  };

  return (
    <main className="max-w-md mx-auto p-4 space-y-4 pb-24">
      <div className="pt-4 mb-4">
        <h1 className="text-2xl font-bold">Cài đặt</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Tùy chỉnh trải nghiệm của bạn
        </p>
      </div>

      {/* Premium Status */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold">Trạng thái Premium</h3>
            </div>
            <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              Premium
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Tận hưởng tính năng không giới hạn
          </p>
          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
            Chuyển về miễn phí
          </Button>
        </CardContent>
      </Card>

      {/* Monk Mode */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔕</span>
              <h3 className="font-semibold">Chế độ tập trung</h3>
            </div>
            <Switch checked={monkMode} onCheckedChange={setMonkMode} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Chế độ thật lũng búc bụng - Ẩn categories không thiết yếu
          </p>
          {monkMode && (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                ⚠️ Đang ẩn: Entertainment, Clothing, Cosmetics, Bubble Tea
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎨</span>
            <h3 className="font-semibold">Giao diện</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Tùy chỉnh giao diện và cảm giác
          </p>

          <div className="space-y-4">
            {/* Theme */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Chủ đề</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="flex flex-col gap-2 h-auto py-3"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-5 w-5" />
                  <span className="text-xs">Sáng</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="flex flex-col gap-2 h-auto py-3"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-5 w-5" />
                  <span className="text-xs">Tối</span>
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className="flex flex-col gap-2 h-auto py-3"
                  onClick={() => setTheme("system")}
                >
                  <Monitor className="h-5 w-5" />
                  <span className="text-xs">Hệ thống</span>
                </Button>
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Màu nhấn</Label>
              <div className="grid grid-cols-4 gap-3">
                {accentColors.map((color) => (
                  <Button
                    key={color.value}
                    variant={
                      settings.accentColor === color.value
                        ? "default"
                        : "outline"
                    }
                    className="flex flex-col gap-2 h-auto py-3"
                    onClick={() =>
                      updateSettings({ accentColor: color.value as any })
                    }
                  >
                    <div className={`w-6 h-6 rounded-full ${color.color}`} />
                    <span className="text-xs">{color.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Settings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💵</span>
            <h3 className="font-semibold">Cài đặt tài chính</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Cấu hình tùy chọn tài chính của bạn
          </p>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Tiền tệ</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => updateSettings({ currency: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VND">VND (₫)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Ngày bắt đầu tháng tài chính
              </Label>
              <Select
                value={settings.startDayOfMonth.toString()}
                onValueChange={(value) =>
                  updateSettings({ startDayOfMonth: parseInt(value) })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ngày 1 hàng tháng</SelectItem>
                  <SelectItem value="15">Ngày 15 hàng tháng</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Ngày bắt đầu chu kỳ tài chính (tính thu nhập/chi tiêu hàng
                tháng)
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Thu nhập hàng tháng dự kiến
              </Label>
              <Input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="mt-1"
                placeholder="15000000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Dùng để tính toán ngân sách chi tiêu hợp lý mỗi ngày
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Mục tiêu tiết kiệm hàng tháng
              </Label>
              <Input
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                className="mt-1"
                placeholder="3000000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Số tiền bạn muốn tiết kiệm được mỗi tháng
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Chi phí cố định hàng tháng
              </Label>
              <Input
                type="number"
                value={fixedExpenses}
                onChange={(e) => setFixedExpenses(e.target.value)}
                className="mt-1"
                placeholder="5000000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tiền thuê nhà, hóa đơn điện nước, Internet, v.v.
              </p>
            </div>

            {/* Summary */}
            {monthlyIncome && (
              <div className="mt-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg">
                <p className="text-sm font-medium mb-2">Tóm tắt ngân sách</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Thu nhập:
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(parseInt(monthlyIncome || "0"))}
                    </span>
                  </div>
                  {fixedExpenses && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Chi cố định:
                      </span>
                      <span className="font-semibold text-rose-600">
                        -{formatCurrency(parseInt(fixedExpenses || "0"))}
                      </span>
                    </div>
                  )}
                  {savingsGoal && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tiết kiệm:
                      </span>
                      <span className="font-semibold text-emerald-600">
                        -{formatCurrency(parseInt(savingsGoal || "0"))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-indigo-200 dark:border-indigo-800">
                    <span className="font-semibold">Có thể chi:</span>
                    <span className="font-bold text-indigo-600">
                      {formatCurrency(
                        parseInt(monthlyIncome || "0") -
                          parseInt(fixedExpenses || "0") -
                          parseInt(savingsGoal || "0")
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📂</span>
              <h3 className="font-semibold">Danh mục</h3>
            </div>
            <Button size="sm">+ Thêm</Button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Quản lý danh mục giao dịch của bạn
          </p>

          {/* Expense Categories */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3">Danh mục chi tiêu</h4>
            <div className="space-y-2">
              {expenseCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {getCategoryIcon(category.name)}
                    </span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!category.isHidden}
                      onCheckedChange={() =>
                        toggleCategoryVisibility(category.id)
                      }
                    />
                    <Button variant="ghost" size="sm">
                      {category.isHidden ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Income Categories */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Danh mục thu nhập</h4>
            <div className="space-y-2">
              {incomeCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {getCategoryIcon(category.name)}
                    </span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!category.isHidden}
                      onCheckedChange={() =>
                        toggleCategoryVisibility(category.id)
                      }
                    />
                    <Button variant="ghost" size="sm">
                      {category.isHidden ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
