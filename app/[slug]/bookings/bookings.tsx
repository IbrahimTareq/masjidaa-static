"use client";

import React from "react";
import { Tables } from "@/database.types";
import { BookingTypesList } from "@/components/client/interactive/BookingTypesList";
import { Calendar } from "lucide-react";

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
  if (bookingTypes.length === 0) {
    return (
      <div className="min-h-screen bg-white">
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
                Schedule appointments and book services at {masjid.name}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                No Services Available
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                No booking services are currently available at {masjid.name}.
              </p>
              <p className="text-gray-500">
                Please check back later or contact the masjid directly for
                assistance.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0">
          <BookingTypesList
            bookingTypes={bookingTypes}
            currency={masjid.local_currency || "AUD"}
            slug={slug}
            emptyMessage={`No booking services are currently available at ${masjid.name}.`}
          />
        </div>
      </section>
    </div>
  );
};

export default BookingsClient;
