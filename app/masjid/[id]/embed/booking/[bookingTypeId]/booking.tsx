"use client";

import React from "react";
import { useMasjidContext } from "@/context/masjidContext";
import { Tables } from "@/database.types";
import { BookingTypeCard } from "@/components/client/interactive/BookingTypesList";

export default function BookingClient({
  bookingType,
}: {
  bookingType: Tables<"booking_types">;
}) {
  const masjid = useMasjidContext();

  // Handle case where masjid context might be null
  if (!masjid) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white text-black font-montserrat min-h-[400px]">
      <div className="max-w-sm mx-auto px-4 lg:px-0">
        <BookingTypeCard
          bookingType={bookingType}
          currency={masjid.local_currency}
          slug={masjid.slug}
        />
      </div>
    </div>
  );
}