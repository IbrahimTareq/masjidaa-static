import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidSlidesById(
  id: string,
  layoutType: string
): Promise<Tables<"masjid_slides">[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjid_slides")
    .select("*")
    .eq("masjid_id", id)
    .eq("layout_type", layoutType);

  if (error) {
    console.error("Error fetching masjid", error);
    return null;
  }
  return data;
}
