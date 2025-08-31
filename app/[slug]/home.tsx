"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import { usePrayerData } from "@/hooks/usePrayerData";
import type { PrayerData } from "@/lib/prayer";
import Link from "next/link";
import Theme5Widget from "@/app/masjid/[id]/embed/prayer-times/[type]/theme5/theme5";

interface HomeClientProps {
  initialPrayerData: PrayerData;
}

export default function HomeClient({ initialPrayerData }: HomeClientProps) {
  // Get masjid data from context (provided by layout)
  const masjid = useMasjidContext();

  // Get date/time formatting utilities
  const { hijriDate, gregorianDate, timeAgo } = useDateTimeFormat();

  // Get prayer data with real-time updates
  const {
    prayerTimes,
    jummahTimes,
    prayerInfo,
    lastUpdated,
    isLoading,
    error,
  } = usePrayerData(masjid.id, initialPrayerData);

  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  const hasDonationWidget = false;

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-[calc(100vh-6rem)] flex items-center bg-white text-[#003B3B] border-b border-[#003B3B]/20">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 bg-[url('/pattern8.jpg')] bg-repeat opacity-10"
          style={{ backgroundSize: "400px" }}
        />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 lg:px-0 w-full py-10 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-theme-gradient pt-12 lg:pt-0">
              <h1 className="text-4xl lg:text-5xl font-light mb-4">
                Welcome to
              </h1>
              <h2 className="text-5xl lg:text-7xl font-semibold mb-8">
                {masjid.name}
              </h2>
              <p className="text-lg lg:text-xl max-w-3xl mb-8 text-black">
                {masjid.description}
              </p>
              <Link
                href={`/${masjid.slug}/about`}
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
        {prayerTimes && (
          <Theme5Widget masjidId={masjid.id} initialData={initialPrayerData} />
        )}
      </section>

      {/* Events Section */}
      <section className="bg-white text-theme-gradient py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-0">
          {/* Section Title */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-center mb-12">
            UPCOMING EVENTS
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
            <div className="col-span-full text-center text-lg">
              No upcoming events scheduled.
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-theme-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 text-center">
          <h2 className="text-4xl font-bold mb-6">Join our community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Be part of our growing community. Whether you're looking to pray,
            learn, or contribute, there's a place for you at {masjid.name}.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href={`/${masjid.slug}/about`}
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
