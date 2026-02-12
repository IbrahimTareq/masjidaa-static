import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

type MasjidSubscriptionWithTier = Tables<"masjid_subscriptions"> & {
  tier: Tables<"subscription_tiers"> | null;
};

export async function getMasjidSubscriptionByMasjidId(
  masjidId: string
): Promise<MasjidSubscriptionWithTier | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjid_subscriptions")
    .select("*, tier:subscription_tiers(*)")
    .eq("masjid_id", masjidId)
    .single();

  if (error) {
    console.error("Error fetching masjid subscription", error);
    return null;
  }
  return data;
}