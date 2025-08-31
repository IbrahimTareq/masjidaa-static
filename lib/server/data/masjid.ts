import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidById(
  id: string
): Promise<Tables<"masjids"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjids")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching masjid", error);
    return null;
  }
  return data;
}

export async function getMasjidBySlug(
  slug: string
): Promise<Tables<"masjids"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjids")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching masjid", error);
    return null;
  }
  return data;
}
