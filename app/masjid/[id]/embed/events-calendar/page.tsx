import Calendar from "@/components/client/interactive/Calendar";
import { Tables } from "@/database.types";
import { convertEventsToCalendarEvents } from "@/lib/server/formatters/calendar";
import { getMasjidEventsByMasjidId } from "@/lib/server/services/masjidEvents";

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const events = await getMasjidEventsByMasjidId(id);

  const calendarEvents = convertEventsToCalendarEvents(
    events as Tables<"events">[]
  );

  return (
    <div className="min-h-screen bg-white font-montserrat">
      <Calendar events={calendarEvents} />
    </div>
  );
}
