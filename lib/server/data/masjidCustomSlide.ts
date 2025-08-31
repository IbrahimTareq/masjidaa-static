import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidCustomSlideById(
  id: string
): Promise<Tables<"masjid_custom_slides"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjid_custom_slides")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching masjid custom slides", error);
    return null;
  }
  return data;
}
