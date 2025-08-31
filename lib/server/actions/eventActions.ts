'use server';

import { getMasjidEventById } from "@/lib/server/data/masjidEvent";
import { Tables } from "@/database.types";

export async function getEvent(eventId: string): Promise<Tables<"events"> | null> {
  try {
    return await getMasjidEventById(eventId);
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}
