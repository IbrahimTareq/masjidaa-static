import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidDonationCampaignsByMasjidId(
  masjidId: string
): Promise<Tables<"donation_campaigns">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("donation_campaigns")
    .select("*")
    .eq("masjid_id", masjidId)

  if (error) {
    console.error("Error fetching masjid donation campaigns", error);
    return [];
  }
  return data;
}