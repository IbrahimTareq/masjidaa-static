import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getMasjidAnnouncementsByMasjidId } from "@/lib/server/services/masjidAnnouncements";
import { notFound } from "next/navigation";
import AnnouncementsClient from "./announcements";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const masjid = await getMasjidBySlug(slug);

  if (!masjid) {
    notFound();
  }

  const announcements = await getMasjidAnnouncementsByMasjidId(masjid.id);

  return (
    <AnnouncementsClient announcements={announcements ?? []} masjid={masjid} />
  );
}
