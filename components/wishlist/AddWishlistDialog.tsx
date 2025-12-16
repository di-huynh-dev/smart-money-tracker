"use client";

import { useState } from "react";
import { useWishlistStore } from "@/stores/useWishlistStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AddWishlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emojiOptions = [
  "💻",
  "📱",
  "⌚",
  "🎧",
  "📷",
  "🎮",
  "👟",
  "👕",
  "👗",
  "💄",
  "🎒",
  "🚗",
  "🏠",
  "✈️",
  "🎸",
  "📚",
];

export function AddWishlistDialog({
  open,
  onOpenChange,
}: AddWishlistDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🎁");

  const addItem = useWishlistStore((state) => state.addItem);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = parseFloat(price.replace(/,/g, ""));
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên món đồ");
      return;
    }

    if (!priceNum || priceNum <= 0) {
      toast.error("Vui lòng nhập giá hợp lệ");
      return;
    }

    addItem({
      name: name.trim(),
      price: priceNum,
      description: description.trim(),
      icon: selectedIcon,
    });

    toast.success("Đã thêm vào danh sách chờ!");

    // Reset form
    setName("");
    setPrice("");
    setDescription("");
    setSelectedIcon("🎁");
    onOpenChange(false);
  };

  const formatPriceInput = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    return new Intl.NumberFormat("vi-VN").format(parseInt(numbers));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm Món Đồ Muốn Mua</DialogTitle>
          <DialogDescription>
            Thêm vào danh sách và chờ 30 ngày trước khi quyết định mua
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Icon Selection */}
          <div>
            <Label>Chọn biểu tượng</Label>
            <div className="grid grid-cols-8 gap-2 mt-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedIcon(emoji)}
                  className={`text-3xl p-2 rounded-lg transition-all ${
                    selectedIcon === emoji
                      ? "bg-purple-100 ring-2 ring-purple-500 scale-110"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name">Tên món đồ *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="vd: MacBook Air M3"
              className="mt-1"
            />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Giá tiền *</Label>
            <Input
              id="price"
              value={price}
              onChange={(e) => setPrice(formatPriceInput(e.target.value))}
              placeholder="28.000.000"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Mô tả (tùy chọn)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cho công việc và học tập"
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Info */}
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-800">
              💡 <strong>Quy tắc 30 ngày:</strong> Chờ 30 ngày trước khi mua để
              đảm bảo bạn thực sự cần món đồ này. Điều này giúp tránh mua sắm
              bốc đồng!
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Thêm vào danh sách
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
