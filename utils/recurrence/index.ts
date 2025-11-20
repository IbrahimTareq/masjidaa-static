import { Tables } from "@/database.types";
import { rrulestr } from "rrule";
import { ExpandedEvent } from "@/app/(standalone)/[slug]/profile/types";

/**
 * Generates the correct event URL with eventDate query parameter for recurring events
 * @param event The event or expanded event
 * @param masjidSlug The masjid slug for the URL
 * @param includeOrigin Whether to include the full origin (for sharing)
 * @returns The properly formatted event URL
 */
export function getEventUrl(
  event: Tables<"events"> | ExpandedEvent,
  masjidSlug: string,
  includeOrigin: boolean = false
): string {
  const expandedEvent = event as ExpandedEvent;
  const eventId = expandedEvent.originalId || event.id;
  const baseUrl = includeOrigin ? window.location.origin : '';
  
  // Add eventDate query param for recurring events
  if (expandedEvent.isRecurring && event.date) {
    return `${baseUrl}/${masjidSlug}/event/${eventId}?eventDate=${event.date}`;
  }
  
  return `${baseUrl}/${masjidSlug}/event/${eventId}`;
}

// Function to expand events with their recurring instances using rrule library
export function expandEventsWithRecurrence(
    events: Tables<"events">[],
    monthsAhead: number = 3
  ): ExpandedEvent[] {
    const expandedEvents: ExpandedEvent[] = [];
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + monthsAhead);
  
    events.forEach((event) => {
      if (!event.recurrence || event.recurrence === "none") {
        // Non-recurring event - include if it's today or in the future
        const eventDate = new Date(event.date || '');
        if (eventDate >= now || eventDate.toDateString() === now.toDateString()) {
          expandedEvents.push({
            ...event,
            isRecurring: false
          } as ExpandedEvent);
        }
        return;
      }
  
      try {
        const eventDate = new Date(event.date || '');
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
  
        // Create RRULE string similar to calendar.ts
        const rruleString = `DTSTART:${dtstart
          .toISOString()
          .replace(/[-:]/g, "")
          .split(".")[0]}Z\nRRULE:${event.recurrence}`;
  
        const rule = rrulestr(rruleString);
  
        // Get occurrences from now to 3 months ahead
        const occurrences = rule.between(now, threeMonthsFromNow, true);
  
        occurrences.forEach((occurrence: Date, index: number) => {
          expandedEvents.push({
            ...event,
            id: `${event.id}-${index}`,
            date: occurrence.toISOString().split("T")[0],
            isRecurring: true,
            originalId: event.id.toString(),
            instanceDate: occurrence
          } as ExpandedEvent);
        });
      } catch (error) {
        console.error("Error parsing recurrence rule:", event.id, error);
        // Fallback to original event if parsing fails
        const eventDate = new Date(event.date || '');
        if (eventDate >= now || eventDate.toDateString() === now.toDateString()) {
          expandedEvents.push({
            ...event,
            isRecurring: false
          } as ExpandedEvent);
        }
      }
    });
  
    // Sort by date (earliest first for events)
    return expandedEvents.sort((a, b) => {
      const dateA = new Date(a.date || a.created_at || '');
      const dateB = new Date(b.date || b.created_at || '');
      return dateA.getTime() - dateB.getTime();
    });
  }