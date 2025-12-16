import { ReportsView } from "@/components/reports/ReportsView";
import { BottomNav } from "@/components/layout/BottomNav";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="max-w-md mx-auto p-4 space-y-6">
        <div className="pt-4">
          <h1 className="text-2xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-gray-600 text-sm">
            Visualize your spending patterns
          </p>
        </div>

        <ReportsView />
      </main>

      <BottomNav />
    </div>
  );
}
