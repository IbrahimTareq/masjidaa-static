"use client";

import React from "react";
import { Tables } from "@/database.types";
import { BookingTypesList } from "@/components/client/interactive/BookingTypesList";

interface BookingsClientProps {
  masjid: Tables<"masjids">;
  bookingTypes: Tables<"booking_types">[];
  siteSettings?: Tables<"masjid_site_settings"> | null;
  slug: string;
}

const BookingsClient: React.FC<BookingsClientProps> = ({
  masjid,
  bookingTypes,
  siteSettings,
  slug,
}) => {
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
              Book Services
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              Schedule appointments and book services
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-gray-50 text-black p-4 md:p-8 lg:p-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-0">
          {bookingTypes.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <p className="text-sm md:text-base text-gray-500">
                There are currently no booking services available. Please check
                back later for updates.
              </p>
            </div>
          ) : (
            <BookingTypesList
              bookingTypes={bookingTypes}
              currency={masjid.local_currency || "AUD"}
              slug={slug}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default BookingsClient;
