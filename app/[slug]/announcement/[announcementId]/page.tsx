import { getAnnouncement } from "@/lib/server/actions/announcementActions";
import AnnouncementClient from "./announcement";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page({
  params,
}: {
  params: Promise<{ announcementId: string }>;
}) {
  const { announcementId } = await params;

  const announcement = await getAnnouncement(announcementId);

  if (!announcement) {
    return <div>Announcement not found</div>;
  }

  return <AnnouncementClient announcement={announcement} />;
}
