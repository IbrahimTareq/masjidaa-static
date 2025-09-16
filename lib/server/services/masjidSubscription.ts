import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidSubscriptionByMasjidId(
  masjidId: string
): Promise<Tables<"masjid_subscriptions"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjid_subscriptions")
    .select("*")
    .eq("masjid_id", masjidId)
    .single();

  if (error) {
    console.error("Error fetching masjid subscription", error);
    return null;
  }
  return data;
}