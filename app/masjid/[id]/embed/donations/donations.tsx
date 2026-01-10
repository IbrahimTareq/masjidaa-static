"use client";

import { Tables } from "@/database.types";
import { Donations as DonationsComponent } from "@/components/client/interactive/Donations";
import { useMasjid } from "@/context/masjidContext";

export default function Donations({
  campaigns,
  slug,
}: {
  campaigns: Tables<"donation_campaigns">[];
  slug: string;
}) {
  const masjid = useMasjid();

  return (
    <div className="bg-white text-black font-montserrat min-h-[400px]">
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <DonationsComponent campaigns={campaigns} slug={slug} masjid={masjid} />
      </div>
    </div>
  );
}
