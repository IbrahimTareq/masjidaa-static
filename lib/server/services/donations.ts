import { createClient } from "@/utils/supabase/server";

export async function getDonationsByCampaignId(campaignId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("donations_public")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching donations", error);
    return [];
  }
  return data;
}
