
import { createClient } from "@/utils/supabase/server";

export async function getDonationCountMonthly(
  campaignId: string
): Promise<number | null> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const supabase = await createClient();
  const { count, error } = await supabase
  .from("donations")
  .select("id", { count: "exact" })
  .eq("campaign_id", campaignId)
  .gte("created_at", startOfMonth);

  if (error) {
    console.error("Error fetching donation count monthly", error);
    return null;
  }
  return count;
}