"use client";

import React from "react";
import Link from "next/link";
import { Tables } from "@/database.types";
import { formatDurationForDisplay } from "@/utils/booking/availability";
import { formatCurrencyWithSymbol } from "@/utils/currency";
import { Clock, Calendar, CheckCircle2 } from "lucide-react";

interface BookingTypeCardProps {
  bookingType: Tables<"booking_types">;
  currency: string;
  slug: string;
}

const BookingTypeCard: React.FC<BookingTypeCardProps> = ({
  bookingType,
  currency,
  slug,
}) => {
  const duration = formatDurationForDisplay(bookingType.duration_minutes || 30);
  const hasPrice = Boolean(bookingType.booking_fee && bookingType.booking_fee > 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
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
                    amount: bookingType.booking_fee || 0,
                    currency: currency,
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
        {(bookingType.min_advance_booking_days ||
          bookingType.max_advance_booking_days) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Booking Requirements:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {bookingType.min_advance_booking_days && (
                <li>
                  • Book at least {bookingType.min_advance_booking_days} day
                  {bookingType.min_advance_booking_days > 1 ? "s" : ""} in
                  advance
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

export interface BookingTypesListProps {
  bookingTypes: Tables<"booking_types">[];
  currency: string;
  slug: string;
  emptyMessage?: string;
}

export const BookingTypesList: React.FC<BookingTypesListProps> = ({
  bookingTypes,
  currency,
  slug,
  emptyMessage = "No booking services are currently available.",
}) => {
  if (bookingTypes.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          No Services Available
        </h2>
        <p className="text-lg text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {bookingTypes.map((bookingType) => (
        <BookingTypeCard
          key={bookingType.id}
          bookingType={bookingType}
          currency={currency}
          slug={slug}
        />
      ))}
    </div>
  );
};

export { BookingTypeCard };
export default BookingTypesList;

