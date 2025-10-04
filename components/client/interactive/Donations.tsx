"use client";

import { Tables } from "@/database.types";
import { formatCurrencyWithSymbol } from "@/utils/currency";
import { Heart } from "lucide-react";
import React from "react";

interface DonationsProps {
  masjid: Tables<"masjids">;
  campaigns: Tables<"donation_campaigns">[];
  slug: string;
}

export const Donations: React.FC<DonationsProps> = ({
  masjid,
  campaigns,
  slug,
}) => {
  return (
    <>
      {campaigns.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign: Tables<"donation_campaigns">) => (
            <a
              href={`/${slug}/donation/${campaign.id}`}
              key={campaign.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 block"
            >
              <div className="relative h-48 overflow-hidden">
                {campaign.image ? (
                  <img
                    src={campaign.image}
                    alt={campaign.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-theme-gradient/10 flex items-center justify-center">
                    <Heart className="w-16 h-16 text-theme opacity-70" />
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col h-[180px]">
                <h3 className="text-xl font-bold mb-3 line-clamp-2">
                  {campaign.name}
                </h3>

                <div className="mt-auto">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-theme h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (campaign.amount_raised / campaign.target_amount) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <p className="font-medium text-lg truncate">
                    {formatCurrencyWithSymbol({
                      amount: campaign.amount_raised,
                      currency: masjid?.local_currency || "AUD",
                    })}
                    &nbsp;donated of&nbsp;
                    {formatCurrencyWithSymbol({
                      amount: campaign.target_amount,
                      currency: masjid?.local_currency || "AUD",
                    })}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">
          There are currently no donation campaigns listed. Please check back
          later for updates.
        </div>
      )}
    </>
  );
};
