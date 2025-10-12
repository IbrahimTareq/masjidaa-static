"use server";

import { BusinessAd, getBusinessAdById } from "@/lib/server/services/businessAd";

// This is required for the slide in the slideshow to work
export async function getBusinessAd(
  businessAdId: string
): Promise<BusinessAd | null> {
  return getBusinessAdById(businessAdId);
}
