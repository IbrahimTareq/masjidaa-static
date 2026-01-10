import { getMasjidById } from "@/lib/server/services/masjid";
import { getMasjidAnnouncementsByMasjidId } from "@/lib/server/services/masjidAnnouncements";
import AnnouncementsClient from "./announcements";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const masjid = await getMasjidById(id);

  // Layout already handles null case with NotFound
  if (!masjid) {
    return null;
  }

  const announcements = await getMasjidAnnouncementsByMasjidId(masjid.id);

  return <AnnouncementsClient announcements={announcements ?? []} slug={masjid.slug} />;
}
