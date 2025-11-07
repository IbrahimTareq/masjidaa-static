import { getAnnouncement } from "@/lib/server/actions/announcementActions";
import AnnouncementClient from "./announcement";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const announcement = await getAnnouncement(id);

  if (!announcement) {
    return <div>Announcement not found</div>;
  }

  return <AnnouncementClient announcement={announcement} />;
}
