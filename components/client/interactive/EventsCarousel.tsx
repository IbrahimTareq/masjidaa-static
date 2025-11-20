"use client";

import { Tables } from "@/database.types";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import Link from "next/link";
import React, { memo, useMemo } from "react";

interface EventsCarouselProps {
  events: Tables<"events">[];
  slug: string;
}

const getUpcomingEvents = (events: Tables<"events">[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  return events
    .filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= today; // Events from today onwards
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const EventsCarouselComponent: React.FC<EventsCarouselProps> = ({ events, slug }) => {
  const { formatTime, formatEventDate } = useDateTimeFormat();

  // Memoize the expensive filtering and sorting operations
  const upcomingEvents = useMemo(() => {
    return events ? getUpcomingEvents(events).slice(0, 4) : [];
  }, [events]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {upcomingEvents.length > 0 ? (
        upcomingEvents.map((event) => {
          const eventDate = formatEventDate(event.date);
          return (
            <div
              key={event.id}
              className="bg-theme-gradient rounded-lg p-6 flex flex-col transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-white"
            >
              <div className="text-6xl font-light mb-2">
                {eventDate.day}
              </div>
              <div className="text-sm font-medium mb-6">
                {eventDate.month}
              </div>
              <h3 className="text-xl font-medium mb-4">{event.title}</h3>
              {event.start_time && (
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span>{formatTime(event.start_time)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm mb-6">
                <span>{event.location || "Location TBD"}</span>
              </div>
              <Link
                href={`/${slug}/event/${event.id}`}
                className="mt-auto text-sm font-medium border border-white px-4 py-2 rounded hover:bg-white hover:text-[#003B3B] transition-colors uppercase"
              >
                Learn More
              </Link>
            </div>
          );
        })
      ) : (
        <div className="col-span-full text-center text-lg">
          No upcoming events scheduled.
        </div>
      )}
    </div>
  );
};

export const EventsCarousel = memo(EventsCarouselComponent);
