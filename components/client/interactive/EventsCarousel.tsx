"use client";

import { ExpandedEvent } from "@/app/(standalone)/[slug]/profile/types";
import { getEventUrl } from "@/utils/recurrence";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import Link from "next/link";
import React, { memo, useMemo } from "react";

interface EventsCarouselProps {
  events: ExpandedEvent[];
  slug: string;
}

const EventsCarouselComponent: React.FC<EventsCarouselProps> = ({ events, slug }) => {
  const { formatTime, formatEventDate } = useDateTimeFormat();

  // Events are already filtered, sorted, and expanded by the recurrence utility
  // Just take the first 4 for the carousel
  const upcomingEvents = useMemo(() => {
    return events ? events.slice(0, 4) : [];
  }, [events]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {upcomingEvents.length > 0 ? (
        upcomingEvents.map((event) => {
          const eventDate = formatEventDate(event.date);
          const eventUrl = getEventUrl(event, slug);
          
          return (
            <div
              key={event.id}
              className="bg-theme-gradient rounded-lg p-6 flex flex-col transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-white relative"
            >
              {/* Recurring event indicator */}
              {event.isRecurring && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-white/20 text-white rounded-full font-medium backdrop-blur-sm">
                    ♻ Recurring
                  </span>
                </div>
              )}
              
              <div className="text-6xl font-light mb-2">
                {eventDate.day}
              </div>
              <div className="text-sm font-medium mb-6">
                {eventDate.month}
              </div>
              <h3 className="text-xl font-medium mb-4 pr-20">{event.title}</h3>
              {event.start_time && (
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span>{formatTime(event.start_time)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm mb-6">
                <span>{event.location || "Location TBD"}</span>
              </div>
              <Link
                href={eventUrl}
                className="mt-auto text-sm font-medium border border-white px-4 py-2 rounded hover:bg-white hover:text-[#003B3B] transition-colors uppercase text-center"
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
