"use server";

import { getMasjidAnnouncementById } from "@/lib/server/services/masjidAnnouncement";
import { Tables } from "@/database.types";

export async function getAnnouncement(
  announcementId: string
): Promise<Tables<"announcements"> | null> {
  return getMasjidAnnouncementById(announcementId);
}
