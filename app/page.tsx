import { MoneyFlowHome } from "@/components/home/MoneyFlowHome";
import { BottomNav } from "@/components/layout/BottomNav";

export default function Home() {
  return (
    <div className="min-h-screen">
      <MoneyFlowHome />
      <BottomNav />
    </div>
  );
}
