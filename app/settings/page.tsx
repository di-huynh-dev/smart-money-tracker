import { NewSettingsView } from "@/components/layout/NewSettingsView";
import { BottomNav } from "@/components/layout/BottomNav";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <NewSettingsView />
      <BottomNav />
    </div>
  );
}
