import { getMasjidPrayers, PrayerSchedule } from "../../services/masjidPrayers";

/**
 * Gets all days in a month
 */
function getDaysInMonth(year: number, month: number): Date[] {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  
  return days;
}

/**
 * Fetches prayer data for an entire month
 */
export async function getMonthlyPrayerData(
  masjidId: string,
  year: number,
  month: number
): Promise<PrayerSchedule[]> {
  // Get all days in the specified month
  const daysInMonth = getDaysInMonth(year, month);
  
  try {
    // Fetch prayer data for each day in parallel
    const prayerDataPromises = daysInMonth.map(async (day) => {
      const formattedDate = day.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      return await getMasjidPrayers(masjidId, formattedDate);
    });
    
    // Wait for all requests to complete
    const results = await Promise.all(prayerDataPromises);
    
    // Filter out any null results and return the valid prayer schedules
    return results.filter((data): data is PrayerSchedule => data !== null);
  } catch (error) {
    console.error("Error fetching monthly prayer data:", error);
    return [];
  }
}
