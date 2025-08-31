import Calendar from "@/components/client/interactive/Calendar";
import { Tables } from "@/database.types";
import { convertEventsToCalendarEvents } from "@/lib/convertEventsToCalendarEvents";
import { getMasjidEventsByMasjidId } from "@/lib/server/data/masjidEvents";

interface CalendarPageProps {
  params: { id: string };
}

export default async function CalendarPage({ params }: CalendarPageProps) {
  const { id } = await params;

  const events = await getMasjidEventsByMasjidId(id);

  const calendarEvents = convertEventsToCalendarEvents(
    events as Tables<"events">[]
  );

  return (
    <div className="min-h-screen bg-white">
      <Calendar events={calendarEvents} />
    </div>
  );
}
