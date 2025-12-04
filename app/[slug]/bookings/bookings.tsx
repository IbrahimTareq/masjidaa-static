"use client";

import React from "react";
import Link from "next/link";
import { Tables } from "@/database.types";
import { formatDurationForDisplay } from "@/utils/booking/availability";
import { formatCurrencyWithSymbol } from "@/utils/currency";
import { Clock, Calendar, Users, MapPin, CheckCircle2 } from "lucide-react";

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
          {/* Booking Types Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bookingTypes.map((bookingType) => (
              <BookingTypeCard
                key={bookingType.id}
                bookingType={bookingType}
                masjid={masjid}
                slug={slug}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

interface BookingTypeCardProps {
  bookingType: Tables<"booking_types">;
  masjid: Tables<"masjids">;
  slug: string;
}

const BookingTypeCard: React.FC<BookingTypeCardProps> = ({
  bookingType,
  masjid,
  slug,
}) => {
  const duration = formatDurationForDisplay(bookingType.duration_minutes || 30);
  const hasPrice = bookingType.price && bookingType.price > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow h-full">
      <div className="p-6 h-full flex flex-col">
        {/* Content that can grow */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {bookingType.name}
            </h3>
            {hasPrice && (
              <div className="text-right">
                <div className="text-2xl font-bold text-theme">
                  {formatCurrencyWithSymbol({
                    amount: bookingType.price || 0,
                    currency: masjid.local_currency || "AUD",
                    decimals: 2,
                  })}
                </div>
              </div>
            )}
          </div>

          {bookingType.short_description && (
            <p className="text-gray-600 mb-6 line-clamp-3">
              {bookingType.short_description}
            </p>
          )}

          {/* Service Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3 text-gray-600">
              <Clock className="h-5 w-5" />
              <span>{duration} per session</span>
            </div>

            {!hasPrice && (
              <div className="flex items-center space-x-3 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span>Free service</span>
              </div>
            )}
          </div>
        </div>

        {/* Booking Requirements - At bottom above button */}
        {(bookingType.min_advance_booking_hours ||
          bookingType.max_advance_booking_days) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Booking Requirements:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {bookingType.min_advance_booking_hours && (
                <li>
                  • Book at least{" "}
                  {bookingType.min_advance_booking_hours < 24
                    ? `${bookingType.min_advance_booking_hours} hours`
                    : `${Math.floor(
                        bookingType.min_advance_booking_hours / 24
                      )} day${
                        Math.floor(bookingType.min_advance_booking_hours / 24) >
                        1
                          ? "s"
                          : ""
                      }`}{" "}
                  in advance
                </li>
              )}
              {bookingType.max_advance_booking_days && (
                <li>
                  • Book up to {bookingType.max_advance_booking_days} day
                  {bookingType.max_advance_booking_days > 1 ? "s" : ""} in
                  advance
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Book Now Button - Always at bottom */}
        <Link
          href={`/${slug}/bookings/${bookingType.id}`}
          className="w-full bg-theme text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Calendar className="h-5 w-5" />
          <span>Book Now</span>
        </Link>
      </div>
    </div>
  );
};

export default BookingsClient;
