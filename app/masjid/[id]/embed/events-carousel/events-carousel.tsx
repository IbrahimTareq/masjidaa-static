"use client";

import { EventsCarousel as EventsCarouselComponent } from "@/components/client/interactive/EventsCarousel";
import { Tables } from "@/database.types";

export default function EventsCarousel({
  events,
  slug,
}: {
  events: Tables<"events">[];
  slug: string;
}) {
  return (
    <div className="bg-white text-black font-montserrat min-h-[400px]">
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <EventsCarouselComponent events={events} slug={slug} />
      </div>
    </div>
  );
}
