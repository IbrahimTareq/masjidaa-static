import { Tables } from "@/database.types";
import { convertEventsToCalendarEvents } from "@/lib/convertEventsToCalendarEvents";
import { getMasjidBySlug } from "@/lib/server/data/masjid";
import { getMasjidEventsByMasjidId } from "@/lib/server/data/masjidEvents";
import EventsClient from "./events";

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

  const events = await getMasjidEventsByMasjidId(masjid.id);

  const calendarEvents = convertEventsToCalendarEvents(
    events as Tables<"events">[]
  );

  return (
    <div className="min-h-screen bg-white">
      <EventsClient calendarEvents={calendarEvents} masjid={masjid} />
    </div>
  );
}
