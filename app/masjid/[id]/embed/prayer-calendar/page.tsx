import { getMonthlyPrayerData } from "@/lib/server/domain/prayer/getMonthlyPrayerData";
import PrayersCalendar from "./prayer-calendar";

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthlyPrayerData = await getMonthlyPrayerData(id, year, month);

  return (
    <div className="min-h-screen bg-white font-montserrat">
      <PrayersCalendar 
        monthlyPrayerData={monthlyPrayerData} 
        year={year}
        month={month}
      />
    </div>
  );
}
