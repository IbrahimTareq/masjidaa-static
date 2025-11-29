import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getMasjidLocationByMasjidId = cache(async (
  masjidId: string
): Promise<Tables<"masjid_locations"> | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjid_locations")
    .select("*")
    .eq("masjid_id", masjidId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching masjid location", error);
    return null;
  }
  return data;
});

