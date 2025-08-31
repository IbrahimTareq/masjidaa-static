"use server";

import { getMasjidCustomSlideById } from "@/lib/server/data/masjidCustomSlide";
import { Tables } from "@/database.types";

export async function getCustomSlide(
  customSlideId: string
): Promise<Tables<"masjid_custom_slides"> | null> {
  try {
    return await getMasjidCustomSlideById(customSlideId);
  } catch (error) {
    console.error("Error fetching custom slide:", error);
    return null;
  }
}
