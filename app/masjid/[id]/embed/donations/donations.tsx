"use client";

import { Tables } from "@/database.types";
import { Donations as DonationsComponent } from "@/components/client/interactive/Donations";

export default function Donations({
  campaigns,
  slug,
}: {
  campaigns: Tables<"donation_campaigns">[];
  slug: string;
}) {
  return (
    <div className="bg-white text-black font-montserrat">
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <DonationsComponent campaigns={campaigns} slug={slug} />
      </div>
    </div>
  );
}
