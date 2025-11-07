import { Tables } from "@/database.types";
import { convertEventsToCalendarEvents } from "@/lib/server/formatters/calendar";
import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getMasjidEventsByMasjidId } from "@/lib/server/services/masjidEvents";
import EventsClient from "./events";

export const revalidate = 60; // Revalidate every 60 seconds

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
