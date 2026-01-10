"use client";

import Theme5Widget from "@/app/masjid/[id]/embed/prayer-times/[type]/theme5/theme5";
import { useMasjid } from "@/context/masjidContext";
import { useMasjidSiteSettings } from "@/context/masjidSiteSettingsContext";
import { Tables } from "@/database.types";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { ExpandedEvent } from "@/app/(standalone)/[slug]/profile/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

// Lazy load below-the-fold components
const EventsCarousel = dynamic(
  () => import("@/components/client/interactive/EventsCarousel").then((mod) => mod.EventsCarousel),
  {
    ssr: true,
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64" />
        ))}
      </div>
    ),
  }
);

const Donation = dynamic(
  () => import("@/components/client/interactive/Donation").then((mod) => mod.Donation),
  {
    ssr: true,
    loading: () => (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-48 bg-gray-200 animate-pulse" />
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-200 animate-pulse rounded" />
          <div className="h-2 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    ),
  }
);

interface HomeClientProps {
  prayerData: FormattedData;
  events: ExpandedEvent[];
  campaign?: Tables<"donation_campaigns"> | null;
}

export default function HomeClient({
  prayerData,
  events,
  campaign,
}: HomeClientProps) {
  const masjid = useMasjid();
  const { siteSettings } = useMasjidSiteSettings();

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[calc(100vh-6rem)] flex items-center bg-white text-[#003B3B] border-b border-[#003B3B]/20 font-montserrat">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 bg-[url('/pattern8.jpg')] bg-repeat opacity-10"
          style={{ backgroundSize: "400px" }}
        />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-0 w-full py-10 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-theme-gradient pt-12 lg:pt-0">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8">
                {siteSettings?.primary_title}
              </h1>
              <p className="text-base md:text-lg lg:text-xl max-w-3xl mb-8 text-black">
                {siteSettings?.primary_description}
              </p>
              <Link
                href={`/${masjid.slug}/services`}
                className="inline-block bg-theme-gradient text-white px-8 py-3 rounded font-medium hover:bg-opacity-90 transition-colors uppercase"
              >
                Learn More
              </Link>
            </div>
            {campaign ? (
              <div className="lg:pl-30">
                <div className="lg:max-w-sm">
                  <Donation campaign={campaign} masjid={masjid} />
                </div>
              </div>
            ) : masjid.bg_image ? (
              <div className="relative aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-xl w-full h-[300px] md:h-[350px] lg:h-[400px]">
                <Image
                  src={masjid.bg_image}
                  alt={masjid.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Prayer Times Section */}
      <section>
        {prayerData && <Theme5Widget formattedData={prayerData} />}
      </section>

      {/* Events Section */}
      <section className="bg-white text-theme-gradient py-12 md:py-20 lg:py-24 relative">
        <div
          className="absolute inset-0 bg-[url('/pattern8.jpg')] bg-repeat opacity-10"
          style={{ backgroundSize: "400px" }}
        />
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0 relative">
          {/* Section Title */}
          <h2 className="text-4xl md:text-5xl lg:text-7xl text-center mb-8 md:mb-12 font-semibold">
            Upcoming Events
          </h2>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 md:mb-16">
            <Link
              href={`/${masjid.slug}/events`}
              className="bg-theme-accent text-theme-gradient px-8 py-3 rounded font-medium transition-colors uppercase"
            >
              See Our Calendar
            </Link>
          </div>

          <EventsCarousel events={events} slug={masjid.slug} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-theme-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 md:mb-6">Join our community</h2>
          <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
            Be part of our growing community. Whether you're looking to pray,
            learn, or contribute, there's a place for you at {masjid.name}.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
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
