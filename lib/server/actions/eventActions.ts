"use server";

import { getMasjidEventById } from "@/lib/server/services/masjidEvent";
import { Tables } from "@/database.types";

export async function getEvent(
  eventId: string
): Promise<Tables<"events"> | null> {
  return getMasjidEventById(eventId);
}
