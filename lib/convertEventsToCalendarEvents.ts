import { Tables } from "@/database.types";
import { rrulestr } from "rrule";
import { CalendarEvent } from "@/components/client/interactive/Calendar";

export const convertEventsToCalendarEvents = (
  events: Tables<"events">[],
  themeColor: string = 'var(--color-theme)'
): CalendarEvent[] => {
  const calendarEvents: CalendarEvent[] = [];

  events.forEach((event) => {
    if (!event.recurrence || event.recurrence === "none") {
      const calendarEvent: CalendarEvent = {
        id: event.id,
        linkId: event.id,
        title: event.title,
        start: event.start_time
          ? `${event.date}T${event.start_time}`
          : event.date,
        description: event.description || undefined,
        location: event.location || undefined,
        backgroundColor: themeColor,
        borderColor: themeColor,
        textColor: '#ffffff',
      };

      if (!event.start_time) {
        (calendarEvent as any).allDay = true;
      }
      calendarEvents.push(calendarEvent);
      return;
    }

    try {
      const eventDate = new Date(event.date);
      let dtstart: Date;

      if (event.start_time) {
        const [hours, minutes, seconds] = event.start_time
          .split(":")
          .map(Number);
        dtstart = new Date(eventDate);
        dtstart.setHours(hours, minutes, seconds || 0, 0);
      } else {
        dtstart = new Date(eventDate);
        dtstart.setHours(0, 0, 0, 0);
      }

      const rruleString = `DTSTART:${dtstart
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0]}Z\nRRULE:${event.recurrence}`;
      const rule = rrulestr(rruleString);

      const now = new Date();
      const twoYearsFromNow = new Date();
      twoYearsFromNow.setFullYear(now.getFullYear() + 2);

      const occurrences = rule.between(now, twoYearsFromNow, true);

      occurrences.forEach((occurrence: Date, index: number) => {
        const calendarEvent: CalendarEvent = {
          id: `${event.id}-${index}`,
          linkId: event.id,
          title: event.title,
          start: event.start_time
            ? occurrence.toISOString()
            : occurrence.toISOString().split("T")[0],
          description: event.description || undefined,
          location: event.location || undefined,
          backgroundColor: themeColor,
          borderColor: themeColor,
          textColor: '#ffffff',
        };

        if (!event.start_time) {
          (calendarEvent as any).allDay = true;
        }

        calendarEvents.push(calendarEvent);
      });
    } catch (error) {
      console.error("Error parsing recurrence rule:", event.id, error);
      const fallbackEvent: CalendarEvent = {
        id: event.id,
        linkId: event.id,
        title: event.title,
        start: event.start_time
          ? `${event.date}T${event.start_time}`
          : event.date,
        description: event.description || undefined,
        location: event.location || undefined,
        backgroundColor: themeColor,
        borderColor: themeColor,
        textColor: '#ffffff',
      };
      if (!event.start_time) {
        (fallbackEvent as any).allDay = true;
      }
      calendarEvents.push(fallbackEvent);
    }
  });

  return calendarEvents;
};
