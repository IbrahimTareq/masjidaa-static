"use server";

import { Tables } from "@/database.types";
import { getMasjidDonationCampaignById } from "@/lib/server/services/masjidDonationCampaign";

export async function getDonationCampaign(
  donationCampaignId: string
): Promise<Tables<"donation_campaigns"> | null> {
  return getMasjidDonationCampaignById(donationCampaignId);
}
