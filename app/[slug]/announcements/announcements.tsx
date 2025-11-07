"use client";

import { Announcements } from "@/components/client/interactive/Announcements";
import { Tables } from "@/database.types";

export default function AnnouncementsClient({
  announcements,
  masjid,
}: {
  announcements: Tables<"announcements">[];
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
              Announcements
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              Stay updated with the latest news, announcements, and important
              information from {masjid.name}.
            </p>
          </div>
        </div>
      </section>

      {/* Announcements Timeline */}
      <section className="bg-gray-50 text-black p-4 md:p-8 lg:p-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-0">
          <Announcements announcements={announcements} slug={masjid.slug} />
        </div>
      </section>
    </div>
  );
}
