
import { createClient } from "@/utils/supabase/server";

export async function getDonationCount(
  campaignId: string
): Promise<number | null> {
  const supabase = await createClient();
  const { count, error } = await supabase
  .from("donations")
  .select("id", { count: "exact" })
  .eq("campaign_id", campaignId)

  if (error) {
    console.error("Error fetching donation count", error);
    return null;
  }
  return count;
}