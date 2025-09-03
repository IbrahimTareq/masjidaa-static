"use client";

import Theme5Widget from "@/app/masjid/[id]/embed/prayer-times/[type]/theme5/theme5";
import { useMasjidContext } from "@/context/masjidContext";
import { useMasjidSiteSettings } from "@/context/masjidSiteSettingsContext";
import { Tables } from "@/database.types";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import { FormattedData } from "@/lib/server/services/prayer";
import Link from "next/link";

interface HomeClientProps {
  prayerData: FormattedData;
  events: Tables<"events">[];
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

export default function HomeClient({ prayerData, events }: HomeClientProps) {
  const masjid = useMasjidContext();

  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  const { formatTime, formatEventDate } = useDateTimeFormat();

  const { siteSettings } = useMasjidSiteSettings();

  const hasDonationWidget = false;

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-[calc(100vh-6rem)] flex items-center bg-white text-[#003B3B] border-b border-[#003B3B]/20 font-montserrat">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 bg-[url('/pattern8.jpg')] bg-repeat opacity-10"
          style={{ backgroundSize: "400px" }}
        />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 lg:px-0 w-full py-10 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-theme-gradient pt-12 lg:pt-0">
              <h1 className="text-5xl lg:text-7xl font-bold mb-8">
                {siteSettings?.primary_title}
              </h1>
              <p className="text-lg lg:text-xl max-w-3xl mb-8 text-black">
                {siteSettings?.primary_description}
              </p>
              <Link
                href={`/${masjid.slug}/services`}
                className="inline-block bg-theme-gradient text-white px-8 py-3 rounded font-medium hover:bg-opacity-90 transition-colors uppercase"
              >
                Learn More
              </Link>
            </div>
            {hasDonationWidget ? (
              <div className="lg:pl-8">
                <div>Donation Widget goes here</div>
              </div>
            ) : (
              <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-xl">
                <img
                  src={masjid.bg_image || "/masjid-bg.png"}
                  alt={masjid.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prayer Times Section */}
      <section>
        {prayerData && <Theme5Widget formattedData={prayerData} />}
      </section>

      {/* Events Section */}
      <section className="bg-white text-theme-gradient py-24 relative">
        <div
          className="absolute inset-0 bg-[url('/pattern8.jpg')] bg-repeat opacity-10"
          style={{ backgroundSize: "400px" }}
        />
        <div className="max-w-7xl mx-auto px-4 lg:px-0 relative">
          {/* Section Title */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl text-center mb-12 font-semibold">
            Upcoming Events
          </h2>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link
              href={`/${masjid.slug}/events`}
              className="bg-theme-accent text-theme-gradient px-8 py-3 rounded font-medium transition-colors uppercase"
            >
              See Our Calendar
            </Link>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events &&
              (() => {
                const upcomingEvents = getUpcomingEvents(events);
                return upcomingEvents.length > 0 ? (
                  upcomingEvents.slice(0, 4).map((event) => {
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
                        <h3 className="text-xl font-medium mb-4">
                          {event.title}
                        </h3>
                        {event.start_time && (
                          <div className="flex items-center gap-2 text-sm mb-2">
                            <span>{formatTime(event.start_time)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm mb-6">
                          <span>{event.location || "Location TBD"}</span>
                        </div>
                        <Link
                          href={`/${masjid.slug}/event/${event.id}`}
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
                );
              })()}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-theme-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 text-center">
          <h2 className="text-4xl font-semibold mb-6">Join our community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Be part of our growing community. Whether you're looking to pray,
            learn, or contribute, there's a place for you at {masjid.name}.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href={`/${masjid.slug}/services`}
              className="inline-block bg-white text-theme-gradient px-8 py-3 rounded font-medium hover:bg-opacity-90 transition-colors uppercase"
            >
              Learn More About Us
            </Link>
            <Link
              href={`/${masjid.slug}/donations`}
              className="inline-block border border-white text-white px-8 py-3 rounded font-medium hover:bg-white hover:text-theme-gradient transition-colors uppercase"
            >
              Support Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
