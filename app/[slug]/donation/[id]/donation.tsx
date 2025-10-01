"use client";

import WavyBackground from "@/components/client/ui/WavyBackground";
import { Tables } from "@/database.types";
import { getTimeAgo } from "@/utils/time";
import { useMemo, useState } from "react";

import { DonationStepManager } from "@/donation/src/components/DonationStepManager";
import type { ShortLink as DonationShortLink } from "@/donation/src/types";

import { CampaignDetails } from "@/components/client/interactive/CampaignDetails";
import { ImagePreviewModal } from "@/components/client/ui/ImagePreviewModal";
import { ShareModal } from "@/components/client/ui/ShareModal";
import { useRandomHadith } from "@/hooks/useRandomHadith";
import { formatCurrency, formatCurrencyWithSymbol } from "@/utils/currency";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import { HeartHandshake } from "lucide-react";

interface DonationDisplayProps {
  campaign: Tables<"donation_campaigns">;
  bankAccount: Tables<"masjid_bank_accounts"> | null;
  shortLink: Tables<"short_links"> | null;
  theme: Tables<"themes"> | null;
  masjid: Tables<"masjids">;
  donationCount: number;
  donationCountMonthly: number;
  donations: Tables<"donations">[];
}

export default function DonationDisplay({
  campaign,
  bankAccount,
  shortLink,
  theme,
  masjid,
  donationCount,
  donationCountMonthly,
  donations,
}: DonationDisplayProps) {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { hadith } = useRandomHadith();

  const themeColorsVariations = useMemo(() => {
    return [theme?.base_color, theme?.accent_color, theme?.gradient_color];
  }, [theme?.base_color, theme?.accent_color, theme?.gradient_color]);

  if (!bankAccount) return <div>Bank account not found</div>;

  const shareUrl = shortLink
    ? `${DOMAIN_NAME}/r/${shortLink.short_code}`
    : typeof window !== "undefined"
    ? window.location.href
    : "";

  return (
    <div className="bg-white relative overflow-hidden my-10 text-black">
      <WavyBackground
        colors={themeColorsVariations as string[]}
        waveWidth={60}
        blur={0}
        speed="slow"
        waveOpacity={0.2}
        containerClassName="absolute bottom-[-10%] left-0 right-0"
      />

      <div className="relative z-10">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:gap-12">
            <CampaignDetails
              campaign={campaign}
              onImageClick={() => setIsImagePreviewOpen(true)}
            />

            <div className="flex flex-col gap-4">
              <DonationStepManager
                campaign={campaign}
                masjid={masjid}
                bankAccount={bankAccount}
                shortLink={shortLink as unknown as DonationShortLink}
                monthlyDonorCount={donationCountMonthly}
                totalDonorCount={donationCount}
              />
              <div className="w-full lg:w-[480px] flex flex-col gap-6 mt-4 lg:mt-0">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 overflow-hidden p-5">
                  <h3 className="text-lg font-semibold mb-4">
                    The reward of charity
                  </h3>
                  <div className="text-gray-500">
                    "{hadith.text}"
                    <br />- {hadith.source}
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-[480px] flex flex-col gap-6 mt-4 lg:mt-0">
                {/* Recent Supporters Section */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 overflow-hidden p-5">
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="w-full py-3 bg-gray-500 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Share
                  </button>
                  <div className="h-px bg-gray-200 my-4" />
                  <h3 className="text-lg font-semibold mb-4">Recent donors</h3>
                  <div className="space-y-4">
                    {donations.length > 0 ? (
                      donations.map((donation, index) => {
                        const displayName = donation.is_anonymous
                          ? "Anonymous"
                          : donation.donor_first_name &&
                            donation.donor_last_name;

                        const donationDate = donation.created_at
                          ? new Date(donation.created_at)
                          : new Date();
                        const timeAgo = getTimeAgo(donationDate);

                        return (
                          <div
                            key={`${donation.campaign_id}-${index}`}
                            className="flex items-center gap-3"
                          >
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center bg-theme`}
                            >
                              <HeartHandshake
                                size={20}
                                className="text-white"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{displayName}</div>
                              <div className="text-gray-600 flex gap-1">
                                {donation.currency.toUpperCase()}&nbsp;
                                {formatCurrencyWithSymbol({
                                  amount: donation.amount,
                                  currency: donation.currency,
                                })}
                                &nbsp;•&nbsp;{timeAgo}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center py-6 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200">
                            <HeartHandshake
                              size={24}
                              className="text-gray-500"
                            />
                          </div>
                          <p className="text-gray-600 font-medium">
                            Become an early donor, your support matters
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ImagePreviewModal
        campaignImage={campaign.image}
        campaignName={campaign.name}
        isOpen={isImagePreviewOpen}
        onToggle={setIsImagePreviewOpen}
      />

      <ShareModal
        campaignName={campaign.name}
        shareUrl={shareUrl}
        isOpen={isShareModalOpen}
        onToggle={setIsShareModalOpen}
      />
    </div>
  );
}
