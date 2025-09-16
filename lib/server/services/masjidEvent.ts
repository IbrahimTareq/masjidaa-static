import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidEventById(
  id: string
): Promise<Tables<"events"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching masjid event", error);
    return null;
  }
  return data;
}