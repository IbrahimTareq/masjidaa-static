import { getMasjidBySlug } from "@/lib/server/data/masjid";
import { getMasjidAnnouncementsByMasjidId } from "@/lib/server/data/masjidAnnouncements";
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
    <div className="min-h-screen bg-white">
      <AnnouncementsClient announcements={announcements ?? []} masjid={masjid} />
    </div>
  );
}
