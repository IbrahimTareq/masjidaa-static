"use client";

import { Tables } from "@/database.types";
import { Donations as DonationsComponent } from "@/components/client/interactive/Donations";
import { useMasjidContext } from "@/context/masjidContext";

export default function Donations({
  campaigns,
  slug,
}: {
  campaigns: Tables<"donation_campaigns">[];
  slug: string;
}) {
  const masjid = useMasjidContext();

  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  return (  
    <div className="bg-white text-black font-montserrat">
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <DonationsComponent campaigns={campaigns} slug={slug} masjid={masjid} />
      </div>
    </div>
  );
}
