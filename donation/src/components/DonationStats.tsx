"use client";

import React from "react";
import { Tables } from "@/database.types";
import { formatCurrency } from "@/utils/currency";
import { Target, TrendingUp, Users } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useDonation } from "@/donation/src/context/DonationContext";
import { useRandomHadith } from "../hooks/useRandomHadith";

const formatAmountToShortFormat = ({ amount }: { amount: number }) => {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (amount >= 1_000) {
    return (amount / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return amount.toString();
};

interface DonationStatsProps {
  campaign: Tables<"donation_campaigns">;
  masjid: Tables<"masjids">;
  monthlyDonorCount: number;
  totalDonorCount: number;
  loadingCount: boolean;
  setIsShareModalOpen: (isOpen: boolean) => void;
}

export const DonationStats: React.FC<DonationStatsProps> = ({
  campaign,
  masjid,
  monthlyDonorCount,
  totalDonorCount,
  loadingCount,
  setIsShareModalOpen,
}) => {
  const { progressPercentage, handleDonateClick } = useDonation();
  const { hadith } = useRandomHadith();

  return (
    <div className="p-5 space-y-4">
      {/* Amount Raised */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-light text-gray-900">
            {formatCurrency({
              amount: Number(campaign.amount_raised),
              currency: masjid.local_currency,
            })}
            &nbsp;donated
          </h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <Target className="w-3 h-3 text-gray-500" />
            <span>{formatCurrency({ amount: Number(campaign.target_amount), currency: masjid.local_currency })} target</span>
            <span className="mx-1">|</span>
            <Users className="w-3 h-3 text-gray-500" />
            <span>{totalDonorCount} donations</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-14 h-14">
            <CircularProgressbar
              value={progressPercentage}
              text={`${progressPercentage}%`}
              styles={buildStyles({
                pathColor: "var(--theme-color-gradient, #e4ede7)",
                textColor: "var(--theme-color-gradient, #e4ede7)",
                trailColor: "var(--theme-color-accent, #e4ede7)",
                textSize: "24px",
              })}
            />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-theme rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Recent Activity */}
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">
          {loadingCount
            ? "People have donated this month"
            : monthlyDonorCount === 0
            ? "Be the first to donate in this month"
            : `${monthlyDonorCount} ${
                monthlyDonorCount === 1 ? "person has" : "people have"
              } donated this month`}
        </span>
      </div>

      <div className="text-sm text-gray-500 italic border-t border-gray-200 pt-4">
        {hadith.text} - {hadith.source}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        <button
          onClick={handleDonateClick}
          className="w-full py-3 bg-theme hover:bg-theme-gradient disabled:bg-theme-accent text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          Donate now
        </button>
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="w-full py-3 bg-gray-500 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          Share
        </button>
      </div>

      {/* Powered By */}
      <div className="text-center pt-4">
        <a
          href={`${process.env.NEXT_PUBLIC_DOMAIN_NAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Powered by Masjidaa
        </a>
      </div>
    </div>
  );
};
