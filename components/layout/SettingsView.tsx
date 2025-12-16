"use client";

import { useTheme } from "next-themes";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useUserStore } from "@/stores/useUserStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Moon,
  Sun,
  Download,
  Award,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatReadableDate } from "@/lib/helpers";

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const isPremium = useUserStore((state) => state.isPremium);
  const badges = useUserStore((state) => state.badges);
  const transactions = useTransactionStore((state) => state.transactions);

  const handleExportExcel = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const data = transactions.map((t) => ({
      Date: formatReadableDate(new Date(t.date)),
      Type: t.type,
      Category: t.category,
      Amount: t.amount,
      Note: t.note,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(
      wb,
      `transactions_${new Date().toISOString().slice(0, 10)}.xlsx`
    );

    toast.success("Exported to Excel successfully!");
  };

  const handleExportPDF = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const doc = new jsPDF();
    doc.text("Smart Money Tracker - Transactions Report", 14, 15);

    const tableData = transactions.map((t) => [
      formatReadableDate(new Date(t.date)),
      t.type,
      t.category,
      formatCurrency(t.amount),
      t.note,
    ]);

    autoTable(doc, {
      head: [["Date", "Type", "Category", "Amount", "Note"]],
      body: tableData,
      startY: 25,
    });

    doc.save(`transactions_${new Date().toISOString().slice(0, 10)}.pdf`);

    toast.success("Exported to PDF successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Choose your preferred theme
              </p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Fiscal Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Fiscal Settings</CardTitle>
          <CardDescription>Configure your fiscal month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Start Day of Month</Label>
              <p className="text-sm text-muted-foreground">
                When your fiscal month begins
              </p>
            </div>
            <Select
              value={settings.startDayOfMonth.toString()}
              onValueChange={(v) =>
                updateSettings({ startDayOfMonth: parseInt(v) })
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
          <CardDescription>Download your transaction history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleExportExcel}
            className="w-full"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
          <Button
            onClick={handleExportPDF}
            className="w-full"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Export to PDF
          </Button>
        </CardContent>
      </Card>

      {/* Badges & Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>Your unlocked badges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border ${
                  badge.isUnlocked
                    ? "bg-primary/5 border-primary"
                    : "bg-muted opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className="font-medium text-sm">{badge.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {badge.description}
                </p>
                {badge.isUnlocked && badge.unlockedAt && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    Unlocked
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {isPremium ? "Premium Account" : "Free Account"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isPremium
                  ? "Enjoy unlimited features"
                  : "Upgrade for more features"}
              </p>
            </div>
            {isPremium ? (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                Premium
              </Badge>
            ) : (
              <Button size="sm">Upgrade</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
