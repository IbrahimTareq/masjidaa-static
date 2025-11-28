"use client";

import { Tables } from "@/database.types";
import { useFundraiserRealtime } from "@/hooks/useFundraiserRealtime";
import { useQRCode } from "@/hooks/useQRCode";
import { formatCurrency } from "@/utils/currency";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import { getTimeAgo } from "@/utils/time";
import { CheckCircle2, Heart, Target, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Confetti from "react-confetti";

// Constants
const ANIMATION_DURATION = 2000;
const HIGHLIGHT_DURATION = 3000;
const CONFETTI_DURATION = 8000;
const MAX_VISIBLE_DONATIONS = 5;

const CONFETTI_CONFIG = {
  numberOfPieces: 900,
  initialVelocityY: 20,
  recycle: false,
  gravity: 0.2,
} as const;

type DonationPublic = Tables<"donations_public">;
type FundraiserSession = Tables<"fundraiser_sessions">;

interface FundraiserDisplayProps {
  session: FundraiserSession;
  campaign: Tables<"donation_campaigns">;
  masjid: Tables<"masjids">;
  donationCount: number;
  donations: DonationPublic[];
}

// Utility functions
const getDonorDisplayName = (donation: DonationPublic): string => {
  if (donation.is_anonymous) return "Anonymous";
  const fullName = `${donation.donor_first_name || ""} ${
    donation.donor_last_name || ""
  }`.trim();
  return fullName || "Supporter";
};

const calculatePercentage = (raised: number, target: number): number => {
  return target ? Math.min((raised / target) * 100, 100) : 0;
};

const easeOutQuart = (progress: number): number => {
  return 1 - Math.pow(1 - progress, 4);
};

// Sub-components
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
  const displayName = getDonorDisplayName(donation);
  const timeAgo = getTimeAgo(
    donation.created_at ? new Date(donation.created_at) : new Date()
  );
  const formattedAmount = formatCurrency({
    amount: donation.amount || 0,
    currency: donation.currency || currency,
    roundDownToWhole: true,
  });

  const cardClasses = [
    "relative rounded-2xl p-5 transition-all duration-700 backdrop-blur-sm border border-white/5",
    isHighlighted
      ? "bg-gradient-to-r from-theme/40 via-theme/30 to-theme/40 ring-2 ring-theme/50 shadow-2xl shadow-theme/20 scale-105"
      : "bg-slate-900/60 hover:bg-slate-800/70",
    isNew && "animate-slide-in",
    "hover:scale-102 transform-gpu",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="text-4xl font-bold bg-gradient-to-r from-theme to-theme-accent bg-clip-text text-transparent">
            {formattedAmount}
          </div>
          <div className="flex items-center gap-1 text-theme/60">
            <Heart className="w-4 h-4 fill-current" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-lg text-white font-semibold">{displayName}</div>
          <div className="text-sm text-slate-400 capitalize">{timeAgo}</div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  isAnimated?: boolean;
}

function StatCard({
  icon: Icon,
  label,
  value,
  isAnimated = false,
}: StatCardProps) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-6 h-6 text-theme" />
        <span className="text-slate-400 text-sm font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div
        className={`text-6xl font-bold ${
          isAnimated
            ? "bg-gradient-to-r from-theme to-theme-accent bg-clip-text text-white"
            : "text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

interface ProgressBarProps {
  percentage: number;
}

function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="mb-12">
      <div className="relative h-6 bg-slate-800/80 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-theme via-theme to-theme-accent rounded-full transition-all duration-2000 ease-out relative animate-pulse-glow"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>
      <div className="flex justify-end items-center mt-4">
        <span className="text-theme text-4xl font-bold">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}

function BackgroundElements() {
  const elements = [
    {
      size: "w-96 h-96",
      position: "top-20 left-20",
      color: "bg-theme/5",
      blur: "blur-3xl",
      delay: "0s",
    },
    {
      size: "w-80 h-80",
      position: "bottom-20 right-20",
      color: "bg-theme-accent/5",
      blur: "blur-3xl",
      delay: "2s",
    },
    {
      size: "w-60 h-60",
      position: "top-1/2 left-1/3",
      color: "bg-theme/5",
      blur: "blur-2xl",
      delay: "4s",
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {elements.map((el, index) => (
        <div
          key={index}
          className={`absolute ${el.position} ${el.size} ${el.color} rounded-full ${el.blur} animate-float`}
          style={{ animationDelay: el.delay }}
        />
      ))}
    </div>
  );
}

function EmptyDonationsState() {
  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="text-center p-8 bg-slate-900/50 rounded-3xl border border-white/5 backdrop-blur-sm">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mx-auto mb-6 animate-float">
          <Heart className="w-12 h-12 text-slate-500" />
        </div>
        <p className="text-slate-400 text-xl font-medium mb-2">
          Be the first to donate!
        </p>
        <p className="text-slate-500">Start the movement of giving</p>
      </div>
    </div>
  );
}

interface ClosedFundraiserProps {
  session: FundraiserSession;
  campaign: Tables<"donation_campaigns">;
  masjid: Tables<"masjids">;
  formattedAmountRaised: string;
  formattedTargetAmount: string;
  percentage: number;
}

function ClosedFundraiserDisplay({
  session,
  campaign,
  masjid,
  formattedAmountRaised,
  formattedTargetAmount,
  percentage,
}: ClosedFundraiserProps) {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-montserrat relative overflow-auto">
      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <BackgroundElements />

      <div className="min-h-screen flex flex-col justify-center relative z-10 py-8 px-6">
        <div className="max-w-5xl w-full mx-auto">
          {/* Closed badge */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/80 rounded-full border border-white/10 backdrop-blur-sm">
              <CheckCircle2 className="w-5 h-5 text-theme" />
              <span className="text-white text-lg font-semibold uppercase tracking-wide">
                Fundraiser Closed
              </span>
            </div>
          </div>

          {/* Masjid name */}
          <p className="text-center text-slate-400 text-xl font-medium tracking-wide uppercase mb-3">
            {masjid.name}
          </p>

          {/* Campaign title */}
          <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 text-center">
            {session.title || campaign.name}
          </h1>

          {/* Description */}
          {(session.description || campaign.description) && (
            <p className="text-slate-300 text-xl leading-relaxed text-center mx-auto mb-8 line-clamp-5">
              {session.description || campaign.description}
            </p>
          )}

          {/* Final stats card */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/5 mb-6">
            {/* Stats row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-around gap-6 mb-6">
              {/* Amount Raised */}
              <div className="text-center flex-1">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-theme" />
                  <span className="text-slate-400 text-md font-medium uppercase tracking-wide">
                    Total Raised
                  </span>
                </div>
                <div className="text-5xl xl:text-6xl font-bold bg-gradient-to-r from-theme to-theme-accent bg-clip-text text-white">
                  {formattedAmountRaised}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-16 bg-slate-700/50" />

              {/* Target */}
              <div className="text-center flex-1">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-theme" />
                  <span className="text-slate-400 text-md font-medium uppercase tracking-wide">
                    Target
                  </span>
                </div>
                <div className="text-5xl xl:text-6xl font-bold text-white">
                  {formattedTargetAmount}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-4 bg-slate-800/80 rounded-full overflow-hidden border border-white/5 mb-2">
              <div
                className="h-full bg-gradient-to-r from-theme via-theme to-theme-accent rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-end">
              <span className="text-theme text-2xl font-bold">
                {Math.round(percentage)}%
              </span>
            </div>
          </div>

          {/* Thank you message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-slate-400 text-lg">
              <Heart className="w-4 h-4 text-theme fill-current" />
              <span>JazakumAllahu khayran to all who contributed. May Allah multiply your rewards.</span>
            </div>
          </div>

          {/* Powered by */}
          <div className="text-center">
            <p className="text-slate-500 text-base">
              Powered by <span className="font-bold text-theme">Masjidaa</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FundraiserDisplay({
  session: initialSession,
  campaign: initialCampaign,
  masjid,
  donationCount: initialDonationCount,
  donations: initialDonations,
}: FundraiserDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(0);
  const [animatedAmountRaised, setAnimatedAmountRaised] = useState(
    initialCampaign.amount_raised
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasReachedTarget, setHasReachedTarget] = useState(
    initialCampaign.target_amount
      ? initialCampaign.amount_raised >= initialCampaign.target_amount
      : false
  );

  // Real-time updates
  const {
    campaign,
    donations,
    session,
    loading: realtimeLoading,
  } = useFundraiserRealtime(initialSession.id, {
    session: initialSession,
    campaign: initialCampaign,
    donations: initialDonations,
    donationCount: initialDonationCount,
  });

  const isOpen = session.is_open;

  // QR Code setup
  useQRCode(
    {
      data: `${DOMAIN_NAME}/${masjid.slug}/donation/${campaign.id}`,
      width: 300,
      height: 300,
    },
    qrRef
  );

  // Memoized calculations
  const currency = masjid.local_currency;

  const animatedPercentage = useMemo(
    () => calculatePercentage(animatedAmountRaised, campaign.target_amount),
    [animatedAmountRaised, campaign.target_amount]
  );

  const formattedAmounts = useMemo(
    () => ({
      raised: formatCurrency({
        amount: animatedAmountRaised,
        currency,
        roundDownToWhole: true,
      }),
      target: formatCurrency({
        amount: campaign.target_amount,
        currency,
        roundDownToWhole: true,
      }),
    }),
    [animatedAmountRaised, campaign.target_amount, currency]
  );

  const visibleDonations = useMemo(
    () => donations.slice(0, MAX_VISIBLE_DONATIONS),
    [donations]
  );

  // Confetti trigger
  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), CONFETTI_DURATION);
  }, []);

  // Highlight newest donation
  useEffect(() => {
    if (donations.length === 0) return;

    setHighlightedIndex(0);
    const timeout = setTimeout(
      () => setHighlightedIndex(null),
      HIGHLIGHT_DURATION
    );
    return () => clearTimeout(timeout);
  }, [donations.length, donations[0]?.created_at]);

  // Animate amount raised with confetti trigger
  useEffect(() => {
    const targetAmount = campaign.amount_raised;
    const currentAmount = animatedAmountRaised;

    if (Math.abs(targetAmount - currentAmount) < 0.01) return;

    const startTime = Date.now();
    const difference = targetAmount - currentAmount;

    const animateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const easeProgress = easeOutQuart(progress);
      const newAmount = currentAmount + difference * easeProgress;

      setAnimatedAmountRaised(newAmount);

      // Check for target achievement
      const isTargetReached =
        campaign.target_amount && newAmount >= campaign.target_amount;
      if (isTargetReached && !hasReachedTarget) {
        setHasReachedTarget(true);
        triggerConfetti();
      }

      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };

    requestAnimationFrame(animateValue);
  }, [
    campaign.amount_raised,
    hasReachedTarget,
    triggerConfetti,
    animatedAmountRaised,
    campaign.target_amount,
  ]);

  // Render closed state if session is not open
  if (!isOpen) {
    return (
      <ClosedFundraiserDisplay
        session={session}
        campaign={campaign}
        masjid={masjid}
        formattedAmountRaised={formattedAmounts.raised}
        formattedTargetAmount={formattedAmounts.target}
        percentage={animatedPercentage}
      />
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-montserrat relative">
      {/* Confetti overlay */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          {...CONFETTI_CONFIG}
        />
      )}

      {/* Keyframe animations */}
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

      <BackgroundElements />

      <div className="flex h-full">
        {/* Campaign Details Section */}
        <div className="flex-1 flex flex-col justify-between p-12 relative z-10">
          <div>
            {/* Header */}
            <header className="mb-8 grid grid-cols-3 gap-12 items-center">
              <div className="col-span-2">
                {/* Live indicator */}
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-slate-400 text-xl font-medium tracking-wide uppercase">
                    {masjid.name}
                  </p>
                  <div className="w-px h-6 bg-slate-600" />
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-red-400 text-lg font-medium uppercase animate-pulse">
                    Live fundraising
                  </span>
                </div>

                {/* Campaign title and description */}
                <h1 className="text-6xl xl:text-7xl font-bold text-white leading-tight mb-6 bg-gradient-to-r from-white via-theme/10 to-white bg-clip-text">
                  {campaign.name}
                </h1>
                {campaign.description && (
                  <p className="text-slate-300 text-xl leading-relaxed line-clamp-6">
                    {campaign.description}
                  </p>
                )}
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="bg-white rounded-3xl p-3 shadow-2xl transform transition-transform group-hover:scale-105">
                    <div ref={qrRef} className="qr-code-container scale-110" />
                  </div>
                </div>
              </div>
            </header>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-8 mb-10">
              <StatCard
                icon={TrendingUp}
                label="Raised"
                value={formattedAmounts.raised}
                isAnimated
              />
              <StatCard
                icon={Target}
                label="Target"
                value={formattedAmounts.target}
              />
            </div>

            <ProgressBar percentage={animatedPercentage} />
          </div>

          {/* Footer */}
          <footer className="flex items-end justify-between">
            <div className="text-right">
              <p className="text-slate-500 text-lg">
                Powered by{" "}
                <span className="font-bold text-theme">Masjidaa</span>
              </p>
            </div>
          </footer>
        </div>

        {/* Live Donations Feed */}
        <aside className="w-96 bg-slate-950/80 backdrop-blur-xl border-l border-white/5 flex flex-col">
          {/* Feed Header */}
          <header className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Heart className="w-6 h-6 text-theme" />
                <Heart className="absolute inset-0 w-6 h-6 text-theme-accent animate-ping opacity-30" />
              </div>
              <h2 className="text-2xl font-bold text-white">Live Donations</h2>
              {realtimeLoading && (
                <div className="w-3 h-3 border border-theme border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </header>

          {/* Donations List */}
          <div className="flex-1 overflow-hidden">
            <div className="p-6 space-y-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {visibleDonations.length > 0 ? (
                visibleDonations.map((donation, index) => (
                  <DonorCard
                    key={`${donation.campaign_id}-${index}`}
                    donation={donation}
                    currency={currency}
                    isHighlighted={highlightedIndex === index}
                    isNew={index === 0}
                  />
                ))
              ) : (
                <EmptyDonationsState />
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
