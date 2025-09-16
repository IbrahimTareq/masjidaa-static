import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidThemeById(
  id: string
): Promise<Tables<"themes"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching masjid", error);
    return null;
  }
  return data;
}
