"use client";

import { Tables } from "@/database.types";
import { useQRCode } from "@/hooks/useQRCode";
import { formatCurrency } from "@/utils/currency";
import { getTimeAgo } from "@/utils/time";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import { useRef, useMemo, useEffect, useState } from "react";
import { QrCode, Heart, Sparkles, TrendingUp, Target } from "lucide-react";

type DonationPublic = Tables<"donations_public">;

interface FundraiserDisplayProps {
  campaign: Tables<"donation_campaigns">;
  masjid: Tables<"masjids">;
  donationCount: number;
  donations: DonationPublic[];
}

interface DonorCardProps {
  donation: DonationPublic;
  currency: string;
  isNew?: boolean;
  isHighlighted?: boolean;
}

function DonorCard({
  donation,
  currency,
  isNew = false,
  isHighlighted = false,
}: DonorCardProps) {
  const displayName = donation.is_anonymous
    ? "Anonymous"
    : `${donation.donor_first_name || ""} ${
        donation.donor_last_name || ""
      }`.trim() || "Supporter";

  const donationDate = donation.created_at
    ? new Date(donation.created_at)
    : new Date();
  const timeAgo = getTimeAgo(donationDate);

  const formattedAmount = formatCurrency({
    amount: donation.amount || 0,
    currency: donation.currency || currency,
    roundDownToWhole: true,
  });

  return (
    <div
      className={`
        relative rounded-2xl p-5 transition-all duration-700 backdrop-blur-sm border border-white/5
        ${
          isHighlighted
            ? "bg-gradient-to-r from-theme/40 via-theme/30 to-theme/40 ring-2 ring-theme/50 shadow-2xl shadow-theme/20 scale-105"
            : "bg-slate-900/60 hover:bg-slate-800/70"
        }
        ${isNew ? "animate-slide-in" : ""}
        hover:scale-102 transform-gpu
      `}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="text-3xl font-bold bg-gradient-to-r from-theme to-theme-accent bg-clip-text text-transparent">
            {formattedAmount}
          </div>
          <div className="flex items-center gap-1 text-theme/60">
            <Heart className="w-4 h-4 fill-current" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-lg text-white font-semibold">{displayName}</div>
          <div className="text-sm text-slate-400 capitalize flex items-center gap-1">
            {timeAgo}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FundraiserDisplay({
  campaign,
  masjid,
  donationCount,
  donations,
}: FundraiserDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(0);

  useQRCode(
    {
      data: `${DOMAIN_NAME}/${masjid.slug}/donation/${campaign.id}`,
      width: 300,
      height: 300,
    },
    qrRef
  );

  const progressPercentage = useMemo(() => {
    if (!campaign.target_amount) return 0;
    return Math.min(
      (campaign.amount_raised / campaign.target_amount) * 100,
      100
    );
  }, [campaign.amount_raised, campaign.target_amount]);

  const currency = masjid.local_currency;

  const formattedAmountRaised = formatCurrency({
    amount: campaign.amount_raised,
    currency,
    roundDownToWhole: true,
  });

  const formattedTargetAmount = formatCurrency({
    amount: campaign.target_amount,
    currency,
    roundDownToWhole: true,
  });

  // Highlight only the newest donation briefly
  useEffect(() => {
    if (donations.length === 0) return;

    // Highlight the first (newest) donation
    setHighlightedIndex(0);

    // Remove highlight after 3 seconds
    const timeout = setTimeout(() => {
      setHighlightedIndex(null);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [donations.length, donations[0]?.created_at]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-montserrat relative">
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            filter: drop-shadow(0 0 20px currentColor);
            opacity: 0.7;
          }
          50% {
            filter: drop-shadow(0 0 40px currentColor);
            opacity: 1;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-20 w-96 h-96 bg-theme/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-theme-accent/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-60 h-60 bg-theme/5 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="flex h-full">
        {/* Left Section - Campaign Details */}
        <div className="flex-1 flex flex-col justify-between p-12 relative z-10">
          {/* Header Section */}
          <div>
            <div className="mb-8 grid grid-cols-3 gap-12 items-center">
              {/* Campaign Details - Left Side */}
              <div className="col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-slate-400 text-xl font-medium tracking-wide uppercase">
                    {masjid.name}
                  </p>
                  <div className="w-px h-6 bg-slate-600"></div>
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-red-400 text-lg font-medium uppercase">
                    Live fundraising
                  </span>
                </div>
                <h1 className="text-6xl xl:text-7xl font-bold text-white leading-tight mb-6 bg-gradient-to-r from-white via-theme/10 to-white bg-clip-text">
                  {campaign.name}
                </h1>
                {campaign.description && (
                  <p className="text-slate-300 text-xl leading-relaxed line-clamp-6">
                    {campaign.description}
                  </p>
                )}
              </div>

              {/* QR Code - Right Side */}
              <div className="flex flex-col items-center justify-items-end">
                <div className="relative group">
                  <div className="bg-white rounded-3xl p-3 shadow-2xl transform transition-transform group-hover:scale-105">
                    <div ref={qrRef} className="qr-code-container scale-110" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              {/* Amount Raised */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-theme" />
                  <span className="text-slate-400 text-sm font-medium uppercase tracking-wide">
                    Raised
                  </span>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-theme to-theme-accent bg-clip-text text-white">
                  {formattedAmountRaised}
                </div>
              </div>

              {/* Target */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-6 h-6 text-theme" />
                  <span className="text-slate-400 text-sm font-medium uppercase tracking-wide">
                    Target
                  </span>
                </div>
                <div className="text-4xl font-bold text-white">
                  {formattedTargetAmount}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex justify-end items-center mb-4">
                <span className="text-theme text-3xl font-bold">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="relative h-6 bg-slate-800/80 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-theme via-theme to-theme-accent rounded-full transition-all duration-2000 ease-out relative animate-pulse-glow"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-end justify-between">
            {/* Powered By */}
            <div className="text-right">
              <p className="text-slate-500 text-lg">
                Powered by{" "}
                <span className="font-bold text-theme">Masjidaa</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Live Donations Feed */}
        <div className="w-96 bg-slate-950/80 backdrop-blur-xl border-l border-white/5 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Heart className="w-6 h-6 text-theme" />
                <div className="absolute inset-0 w-6 h-6 text-theme-accent animate-ping opacity-30">
                  <Heart className="w-full h-full" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white">Live Donations</h2>
            </div>
          </div>

          {/* Donations List */}
          <div className="flex-1 overflow-hidden">
            <div className="p-6 space-y-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {donations.length > 0 ? (
                donations
                  .slice(0, 5)
                  .map((donation, index) => (
                    <DonorCard
                      key={`${donation.campaign_id}-${index}`}
                      donation={donation}
                      currency={currency}
                      isHighlighted={highlightedIndex === index}
                      isNew={index === 0}
                    />
                  ))
              ) : (
                <div className="flex-1 flex items-center justify-center h-full">
                  <div className="text-center p-8 bg-slate-900/50 rounded-3xl border border-white/5 backdrop-blur-sm">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mx-auto mb-6 animate-float">
                      <Heart className="w-12 h-12 text-slate-500" />
                    </div>
                    <p className="text-slate-400 text-xl font-medium mb-2">
                      Be the first to donate!
                    </p>
                    <p className="text-slate-500">
                      Start the movement of giving
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
