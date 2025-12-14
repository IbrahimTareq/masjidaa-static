"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { Tables } from "@/database.types";
import { Donation as DonationComponent } from "@/components/client/interactive/Donation";

export default function Donation({
  campaign,
}: {
  campaign: Tables<"donation_campaigns">;
}) {
  const masjid = useMasjidContext();

  return (
    <div className="bg-white text-black font-montserrat min-h-[400px]">
      <div className="max-w-sm mx-auto px-4 lg:px-0">
        <DonationComponent campaign={campaign} masjid={masjid} />
      </div>
    </div>
  );
}
