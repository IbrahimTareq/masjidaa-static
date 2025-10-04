"use client";

import { Donations as DonationsComponent } from "@/components/client/interactive/Donations";
import { Tables } from "@/database.types";

export default function Donations({
  masjid,
  campaigns,
  slug,
}: {
  masjid: Tables<"masjids">;
  campaigns: Tables<"donation_campaigns">[];
  slug: string;
}) {
  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/pattern8.jpg')] bg-repeat opacity-10"
          style={{ backgroundSize: "400px" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-0">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-theme-gradient">
              Support Our Causes
            </h1>
            <p className="text-xl text-gray-600">
              Your generous donations help us maintain and grow our services to
              the community. Choose a campaign below to contribute.
            </p>
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-0">
          <DonationsComponent masjid={masjid} campaigns={campaigns} slug={slug} />
        </div>
      </section>
    </div>
  );
}
