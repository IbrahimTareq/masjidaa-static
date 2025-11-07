"use client";

import { CalendarEvent } from "@/components/client/interactive/Calendar";
import { Tables } from "@/database.types";
import Calendar from "@/components/client/interactive/Calendar";

export default function EventsClient({
  calendarEvents,
  masjid,
}: {
  calendarEvents: CalendarEvent[];
  masjid: Tables<"masjids">;
}) {
  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/pattern8.jpg')] bg-repeat opacity-10"
          style={{ backgroundSize: "400px" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-0">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 text-theme-gradient">
              Events
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              Discover upcoming events, programs, and activities at{" "}
              {masjid.name}. Join our community for educational programs, social
              gatherings, and spiritual events.
            </p>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="bg-gray-50 text-black p-4 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <Calendar events={calendarEvents} />
        </div>
      </section>
    </div>
  );
}
