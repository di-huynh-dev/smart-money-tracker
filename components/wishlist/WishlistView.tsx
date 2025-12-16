"use client";

import { useState, useMemo } from "react";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/helpers";
import { Clock, TrendingUp, Plus } from "lucide-react";
import { AddWishlistDialog } from "./AddWishlistDialog";

const WAITING_DAYS = 30;

export function WishlistView() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const purchaseItem = useWishlistStore((state) => state.purchaseItem);
  const cancelItem = useWishlistStore((state) => state.cancelItem);
  const deleteItem = useWishlistStore((state) => state.deleteItem);

  const waitingItems = useMemo(() => {
    const now = new Date();
    return items.filter((item) => {
      if (item.isPurchased || item.isCancelled) return false;
      const daysSinceCreated = Math.floor(
        (now.getTime() - new Date(item.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return daysSinceCreated < WAITING_DAYS;
    });
  }, [items]);

  const readyToBuyItems = useMemo(() => {
    const now = new Date();
    return items.filter((item) => {
      if (item.isPurchased || item.isCancelled) return false;
      const daysSinceCreated = Math.floor(
        (now.getTime() - new Date(item.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return daysSinceCreated >= WAITING_DAYS;
    });
  }, [items]);

  const totalSaved = useMemo(() => {
    return items
      .filter((item) => !item.isPurchased && !item.isCancelled)
      .reduce((sum, item) => sum + item.savedAmount, 0);
  }, [items]);

  const getDaysWaiting = (createdAt: Date) => {
    const now = new Date();
    return Math.floor(
      (now.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const getProgressPercentage = (saved: number, price: number) => {
    return Math.min((saved / price) * 100, 100);
  };

  return (
    <main className="max-w-md mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
          Hàng Chờ Mua Sắm
        </h1>
        <p className="text-sm text-gray-600">
          30-Day Rule: Chờ trước khi mua để tránh mua sắm bốc đồng
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-purple-700 font-medium">
                Đang chờ
              </span>
            </div>
            <p className="text-3xl font-bold text-purple-700">
              {waitingItems.length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-sm text-emerald-700 font-medium">
                Đã tiết kiệm
              </span>
            </div>
            <p className="text-xl font-bold text-emerald-700">
              {formatCurrency(totalSaved)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Button */}
      <Button
        onClick={() => setIsAddDialogOpen(true)}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        size="lg"
      >
        <Plus className="h-5 w-5 mr-2" />
        Thêm Món Đồ Muốn Mua
      </Button>

      {/* Ready to Buy Items */}
      {readyToBuyItems.length > 0 && (
        <Card className="border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✓</span>
              <h3 className="font-semibold text-emerald-800">
                Sẵn sàng để mua ({readyToBuyItems.length})
              </h3>
            </div>
            <p className="text-sm text-emerald-700 mb-4">
              Đã hết thời gian chờ. Bạn vẫn muốn mua chứ?
            </p>

            <div className="space-y-4">
              {readyToBuyItems.map((item) => (
                <Card key={item.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-3xl">{item.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{item.name}</h4>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {formatCurrency(item.price)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => purchaseItem(item.id)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        🛒 Mua ngay
                      </Button>
                      <Button
                        onClick={() => cancelItem(item.id)}
                        variant="outline"
                        className="flex-1"
                      >
                        ✕ Không mua nữa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Waiting Items */}
      {waitingItems.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">
              Đang chờ ({waitingItems.length})
            </h3>

            <div className="space-y-4">
              {waitingItems.map((item) => {
                const daysWaiting = getDaysWaiting(item.createdAt);
                const daysRemaining = WAITING_DAYS - daysWaiting;
                const progressPercentage = getProgressPercentage(
                  item.savedAmount,
                  item.price
                );

                return (
                  <Card key={item.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{item.icon}</div>
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="bg-purple-100 px-2 py-1 rounded text-xs font-medium text-purple-700">
                          {daysRemaining} ngày
                        </div>
                      </div>

                      <p className="text-xl font-bold mb-2">
                        {formatCurrency(item.price)}
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Đã chờ {daysWaiting}/{WAITING_DAYS} ngày
                          </span>
                          <span className="font-medium">
                            {Math.round((daysWaiting / WAITING_DAYS) * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={(daysWaiting / WAITING_DAYS) * 100}
                          className="h-2"
                        />
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => cancelItem(item.id)}
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                        >
                          Hủy
                        </Button>
                        <Button
                          onClick={() => deleteItem(item.id)}
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Xóa
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {waitingItems.length === 0 && readyToBuyItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-lg font-semibold mb-2">
              Chưa có món đồ nào trong danh sách
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Thêm món đồ bạn muốn mua và chờ 30 ngày để tránh mua sắm bốc đồng
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm món đồ đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Dialog */}
      <AddWishlistDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </main>
  );
}
