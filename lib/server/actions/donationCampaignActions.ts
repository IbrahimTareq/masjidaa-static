"use server";

import { Tables } from "@/database.types";
import { getMasjidDonationCampaignById } from "@/lib/server/data/masjidDonationCampaign";

export async function getDonationCampaign(
  donationCampaignId: string
): Promise<Tables<"donation_campaigns"> | null> {
  try {
    return await getMasjidDonationCampaignById(donationCampaignId);
  } catch (error) {
    console.error("Error fetching donation campaign:", error);
    return null;
  }
}
