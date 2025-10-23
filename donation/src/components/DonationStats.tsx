"use client";

import { Tables } from "@/database.types";
import { formatCurrency } from "@/utils/currency";
import { Target, TrendingUp, Users } from "lucide-react";
import React from "react";

interface DonationStatsProps {
  campaign: Tables<"donation_campaigns">;
  masjid: Tables<"masjids">;
  monthlyDonorCount: number;
  totalDonorCount: number;
  loadingCount: boolean;
  progressPercentage?: number;
  onDonateClick?: () => void;
}

export const DonationStats: React.FC<DonationStatsProps> = ({
  campaign,
  masjid,
  monthlyDonorCount,
  totalDonorCount,
  loadingCount,
  progressPercentage: propProgressPercentage,
  onDonateClick,
}) => {
  // Calculate progress percentage if not provided via props
  const progressPercentage = propProgressPercentage !== undefined
    ? propProgressPercentage
    : Math.min(
        Math.round(
          (Number(campaign.amount_raised) / Number(campaign.target_amount)) * 100
        ),
        100
      );

  return (
    <div className="p-5 space-y-4">
      {/* Amount Raised */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-light text-gray-900">
            {formatCurrency({
              amount: Number(campaign.amount_raised),
              currency: masjid.local_currency,
              roundDownToWhole: true,
            })}
            &nbsp;donated
          </h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <Target className="w-3 h-3 text-gray-500" />
            <span>
              {formatCurrency({
                amount: Number(campaign.target_amount),
                currency: masjid.local_currency,
              })}
              &nbsp;goal
            </span>
            <span className="mx-1">|</span>
            <Users className="w-3 h-3 text-gray-500" />
            <span>{totalDonorCount} donations</span>
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full">
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-theme rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="absolute -top-5 right-0 text-xs font-medium text-theme">
          {progressPercentage}%
        </div>
      </div>

      {/* Recent Activity */}
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500 tracking-tight">
          {loadingCount
            ? "People have donated this month"
            : monthlyDonorCount === 0
            ? "Be the first to donate in this month"
            : `${monthlyDonorCount} ${
                monthlyDonorCount === 1 ? "person has" : "people have"
              } donated this month`}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {campaign.active ? <button
          onClick={onDonateClick}
          className="w-full py-3 bg-theme hover:bg-theme-gradient disabled:bg-theme-accent text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          Donate now
        </button> : <button
          disabled
          className="w-full py-3 bg-theme disabled:bg-theme-accent text-white font-medium rounded-lg"
        >
          Campaign closed
        </button>}
      </div>
    </div>
  );
};