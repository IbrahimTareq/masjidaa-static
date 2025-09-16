"use server";

import { getMasjidCustomSlideById } from "@/lib/server/services/masjidCustomSlide";
import { Tables } from "@/database.types";

export async function getCustomSlide(
  customSlideId: string
): Promise<Tables<"masjid_custom_slides"> | null> {
  return getMasjidCustomSlideById(customSlideId);
}
