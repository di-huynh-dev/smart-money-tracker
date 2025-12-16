import { TransactionForm } from "@/components/transaction/TransactionForm";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AddPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pb-20">
      <main className="max-w-md mx-auto p-4">
        <div className="pt-4 mb-6">
          <h1 className="text-2xl font-bold">Thêm giao dịch</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Ghi lại thu nhập hoặc chi tiêu của bạn
          </p>
        </div>
        <TransactionForm />
      </main>
      <BottomNav />
    </div>
  );
}
