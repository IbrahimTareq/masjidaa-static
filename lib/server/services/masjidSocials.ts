import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidSocialsByMasjidId(
  masjidId: string
): Promise<Tables<"masjid_socials"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjid_socials")
    .select("*")
    .eq("masjid_id", masjidId)
    .single();

  if (error) {
    console.error("Error fetching masjid socials", error);
    return null;
  }
  return data;
}