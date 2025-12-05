"use client";

import { Tables } from "@/database.types";
import { BookingTypesList } from "@/components/client/interactive/BookingTypesList";

export default function BookingsClient({
  bookingTypes,
  currency,
  slug,
  masjidName,
}: {
  bookingTypes: Tables<"booking_types">[];
  currency: string;
  slug: string;
  masjidName: string;
}) {
  return (
    <div className="bg-white text-black font-montserrat">
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <BookingTypesList
          bookingTypes={bookingTypes}
          currency={currency}
          slug={slug}
          emptyMessage={`No booking services are currently available at ${masjidName}.`}
        />
      </div>
    </div>
  );
}

