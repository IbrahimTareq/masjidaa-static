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
    <div className="bg-white text-black max-w-sm mx-auto font-montserrat">
      <DonationComponent campaign={campaign} slug={masjid?.slug || ""} /> 
    </div>
  );
}
