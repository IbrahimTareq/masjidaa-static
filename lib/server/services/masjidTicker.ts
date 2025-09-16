import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidTickerByMasjidId(
  masjidId: string
): Promise<Tables<"masjid_tickers"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjid_tickers")
    .select("*")
    .eq("masjid_id", masjidId)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching masjid ticker", error);
    return null;
  }
  return data;
}