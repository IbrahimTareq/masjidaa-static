import { getMasjidById } from "@/lib/server/data/masjid";
import { getMasjidAnnouncementsByMasjidId } from "@/lib/server/data/masjidAnnouncements";
import AnnouncementsClient from "./announcements";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const masjid = await getMasjidById(id);

  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  const announcements = await getMasjidAnnouncementsByMasjidId(masjid.id);

  return <AnnouncementsClient announcements={announcements ?? []} slug={masjid.slug} />;
}
