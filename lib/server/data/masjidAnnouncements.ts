import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidAnnouncementsByMasjidId(
  masjidId: string
): Promise<Tables<"announcements">[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("masjid_id", masjidId)

  if (error) {
    console.error("Error fetching masjid announcements", error);
    return null;
  }
  return data;
}