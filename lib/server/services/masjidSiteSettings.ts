import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidSiteSettingsByMasjidId(
  masjidId: string
): Promise<Tables<"masjid_site_settings"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjid_site_settings")
    .select("*")
    .eq("masjid_id", masjidId)
    .single();

  if (error) {
    console.error("Error fetching masjid site settings", error);
    return null;
  }
  return data;
}