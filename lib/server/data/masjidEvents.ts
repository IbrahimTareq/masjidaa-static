import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidEventsByMasjidId(
  masjidId: string
): Promise<Tables<"events">[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("masjid_id", masjidId);

  if (error) {
    console.error("Error fetching masjid events", error);
    return null;
  }
  return data;
}