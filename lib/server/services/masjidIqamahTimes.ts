import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidIqamahTimesByMasjidId(
  masjidId: string
): Promise<Tables<"masjid_iqamah_times">[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjid_iqamah_times")
    .select("*")
    .eq("masjid_id", masjidId);

  if (error) {
    console.error("Error fetching masjid iqamah times", error);
    return null;
  }
  return data;
}

export async function getUpcomingIqamahTimeChanges(
  masjidId: string,
  daysAhead: number = 7
): Promise<Tables<"masjid_iqamah_times"> | null> {
  const supabase = await createClient();
  
  // Calculate the date range
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);
  
  const futureDateStr = futureDate.toISOString().split('T')[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  // Get the upcoming iqamah time change
  const { data, error } = await supabase
    .from("masjid_iqamah_times")
    .select("*")
    .eq("masjid_id", masjidId)
    .gte("effective_from", tomorrowStr)
    .lte("effective_from", futureDateStr)
    .order("effective_from", { ascending: true })
    .limit(1);

  if (error) {
    console.error("Error fetching upcoming iqamah time changes", error);
    return null;
  }
  
  return data.length > 0 ? data[0] : null;
}