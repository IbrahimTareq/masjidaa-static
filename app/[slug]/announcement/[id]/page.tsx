import { getAnnouncement } from "@/lib/server/actions/announcementActions";
import AnnouncementClient from "./announcement";

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
