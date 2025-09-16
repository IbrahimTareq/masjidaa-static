import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidDonationCampaignById(
  id: string
): Promise<Tables<"donation_campaigns"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("donation_campaigns")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching masjid donation campaign", error);
    return null;
  }
  return data;
}