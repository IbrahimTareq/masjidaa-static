import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getMasjidAnnouncementsByMasjidId } from "@/lib/server/services/masjidAnnouncements";
import AnnouncementsClient from "./announcements";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const masjid = await getMasjidBySlug(slug);

  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  const announcements = await getMasjidAnnouncementsByMasjidId(masjid.id);

  return (
    <AnnouncementsClient announcements={announcements ?? []} masjid={masjid} />
  );
}
