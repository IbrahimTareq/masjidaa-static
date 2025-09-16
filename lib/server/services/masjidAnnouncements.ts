import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidAnnouncementsByMasjidId(
  masjidId: string
): Promise<Tables<"announcements">[] | null> {
  const supabase = await createClient();
  
  // Calculate date from 3 months ago
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const threeMonthsAgoISOString = threeMonthsAgo.toISOString();
  
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("masjid_id", masjidId)
    .gte("created_at", threeMonthsAgoISOString)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching masjid announcements", error);
    return null;
  }
  return data;
}