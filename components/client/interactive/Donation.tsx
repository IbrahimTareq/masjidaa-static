"use client";

import { Masjid } from "@/context/masjidContext";
import { Tables } from "@/database.types";
import { formatCurrencyWithSymbol } from "@/utils/currency";
import { BRAND_NAME, DOMAIN_NAME } from "@/utils/shared/constants";
import { Heart } from "lucide-react";
import Link from "next/link";
import React, { memo, useMemo } from "react";

interface DonationProps {
  campaign: Tables<"donation_campaigns">;
  masjid: Masjid;
}

const DonationComponent: React.FC<DonationProps> = ({ campaign, masjid }) => {
  // Memoize expensive calculations
  const progressPercentage = useMemo(() => {
    return Math.min(100, (campaign.amount_raised / campaign.target_amount) * 100);
  }, [campaign.amount_raised, campaign.target_amount]);

  const currency = masjid?.local_currency || "AUD";

  const formattedAmounts = useMemo(() => {
    return {
      raised: formatCurrencyWithSymbol({
        amount: campaign.amount_raised,
        currency,
      }),
      target: formatCurrencyWithSymbol({
        amount: campaign.target_amount,
        currency,
      }),
    };
  }, [campaign.amount_raised, campaign.target_amount, currency]);
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 block">
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
        <h3 className="text-xl font-bold mb-3 line-clamp-2">{campaign.name}</h3>

        <div className="mt-auto">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-theme h-2 rounded-full"
              style={{
                width: `${progressPercentage}%`,
              }}
            ></div>
          </div>

          <p className="font-medium text-lg truncate">
            {formattedAmounts.raised} donated of {formattedAmounts.target}
          </p>
        </div>
      </div>

      <div className="px-6">
        <Link
          href={`/${masjid?.slug}/donation/${campaign.id}`}
          className="block w-full"
        >
          <button className="w-full bg-theme-gradient text-white text-xl font-bold py-3 px-4 rounded-xl cursor-pointer">
            Donate
          </button>
        </Link>
      </div>

      <div className="text-center py-6">
        <a
          href={`${DOMAIN_NAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Powered by {BRAND_NAME}
        </a>
      </div>
    </div>
  );
};

export const Donation = memo(DonationComponent);
