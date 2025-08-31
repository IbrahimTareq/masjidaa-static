'use server';

import { getMasjidAnnouncementById } from "@/lib/server/data/masjidAnnouncement";
import { Tables } from "@/database.types";

export async function getAnnouncement(announcementId: string): Promise<Tables<"announcements"> | null> {
  try {
    return await getMasjidAnnouncementById(announcementId);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return null;
  }
}
