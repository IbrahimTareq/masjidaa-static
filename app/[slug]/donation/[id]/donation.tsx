"use client";

import WavyBackground from "@/components/client/ui/WavyBackground";
import { Tables } from "@/database.types";
import { useMemo, useState } from "react";

import { DonationStepManager } from "@/donation/src/components/DonationStepManager";

import { CampaignDetails } from "@/components/client/interactive/CampaignDetails";
import { ImagePreviewModal } from "@/components/client/ui/ImagePreviewModal";
import { ShareModal } from "@/components/client/ui/ShareModal";

interface DonationDisplayProps {
  campaign: Tables<"donation_campaigns">;
  bankAccount: Tables<"masjid_bank_accounts"> | null;
  shortLink: Tables<"short_links"> | null;
  theme: Tables<"themes"> | null;
  masjid: Tables<"masjids">;
  donationCount: number;
  donationCountMonthly: number;
}

export default function DonationDisplay({
  campaign,
  bankAccount,
  shortLink,
  theme,
  masjid,
  donationCount,
  donationCountMonthly,
}: DonationDisplayProps) {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const themeColorsVariations = useMemo(() => {
    return [theme?.base_color, theme?.accent_color, theme?.gradient_color];
  }, [theme?.base_color, theme?.accent_color, theme?.gradient_color]);

  if (!bankAccount) return <div>Bank account not found</div>;

  const shareUrl = shortLink
    ? `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/r/${shortLink.short_code}`
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

            <DonationStepManager
              campaign={campaign}
              masjid={masjid}
              bankAccount={bankAccount}
              shortLink={shortLink}
              monthlyDonorCount={donationCountMonthly}
              totalDonorCount={donationCount}
              setIsShareModalOpen={setIsShareModalOpen}
            />
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
