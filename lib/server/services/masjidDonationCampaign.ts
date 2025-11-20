import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getMasjidDonationCampaignById = cache(async (
  id: string
): Promise<Tables<"donation_campaigns"> | null> => {
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
});