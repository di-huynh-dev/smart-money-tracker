import { NewCalendarView } from "@/components/calendar/NewCalendarView";
import { BottomNav } from "@/components/layout/BottomNav";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <NewCalendarView />
      <BottomNav />
    </div>
  );
}
