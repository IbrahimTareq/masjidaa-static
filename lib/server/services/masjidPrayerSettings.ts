import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getPrayerSettingsByMasjidId(
  masjidId: string
): Promise<Tables<"masjid_prayer_settings"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjid_prayer_settings")
    .select("*")
    .eq("masjid_id", masjidId)
    .single();

  if (error) {
    console.error("Error fetching prayer settings", error);
    return null;
  }
  return data;
}