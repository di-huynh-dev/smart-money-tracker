import { BottomNav } from "@/components/layout/BottomNav";
import { WishlistView } from "@/components/wishlist/WishlistView";

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <WishlistView />
      <BottomNav />
    </div>
  );
}
