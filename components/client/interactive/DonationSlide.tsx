"use client";

import PrayerLayout from "@/components/LayoutWithHeader";
import { useMasjidContext } from "@/context/masjidContext";
import type { Tables } from "@/database.types";
import { useQRCode } from "@/hooks/useQRCode";
import { useRandomHadith } from "@/hooks/useRandomHadith";
import { getDonationCampaign } from "@/lib/server/actions/donationCampaignActions";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import getSymbolFromCurrency from "currency-symbol-map";
import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DonationSlideProps {
  donationCampaignId: string;
}

export default function DonationSlide({
  donationCampaignId,
}: DonationSlideProps) {
  const [donationCampaign, setDonationCampaign] =
    useState<Tables<"donation_campaigns"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const masjid = useMasjidContext();
  const { hadith } = useRandomHadith();
  const currencySymbol = getSymbolFromCurrency(masjid?.local_currency || "AUD");

  // Fetch event data
  useEffect(() => {
    async function fetchDonationCampaign() {
      try {
        setLoading(true);
        const data = await getDonationCampaign(donationCampaignId);
        if (!data) {
          throw new Error("Failed to fetch donation campaign");
        }
        setDonationCampaign(data);
      } catch (err) {
        console.error("Error fetching donation campaign:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchDonationCampaign();
  }, [donationCampaignId]);

  useQRCode(
    {
      data: `${DOMAIN_NAME}/${masjid?.slug}/donation/${donationCampaignId}`,
      width: 300,
      height: 300,
    },
    qrRef
  );

  // Loading state
  if (loading) {
    return (
      <PrayerLayout headerTitle="Donation">
        <div className="h-full bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-theme border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading event...</p>
          </div>
        </div>
      </PrayerLayout>
    );
  }

  // Error state
  if (error || !donationCampaign) {
    return (
      <PrayerLayout headerTitle="Donation">
        <div className="h-full bg-white flex items-center justify-center">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Donation campaign not found</p>
          </div>
        </div>
      </PrayerLayout>
    );
  }

  // Render event
  return (
    <PrayerLayout headerTitle="Donation">
      <div className="bg-white relative h-full w-full flex flex-col">
        <div className="relative z-10 h-full flex-1">
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 h-full">
            <div className="lg:flex lg:gap-12 h-full">
              {/* Left Column - Event Details */}
              <div className="flex-1 mb-8 lg:mb-0">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-8">
                  {donationCampaign.name}
                </h1>

                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 mb-8">
                  <div>
                    <div
                      className="text-gray-700 text-lg leading-relaxed whitespace-pre-line overflow-hidden truncate"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 7,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {donationCampaign.description}
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 mb-8">
                  <div>
                    <div
                      className="text-gray-700 text-lg leading-relaxed whitespace-pre-line overflow-hidden italic"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 9,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      <p className="mt-2">{hadith.text}</p>
                      <p className="font-light mt-2">- {hadith.source}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Event Image */}
              <div className="lg:w-[480px] flex flex-col mt-18">
                <div className="justify-center items-center py-2 mb-4">
                  <div className="mt-auto">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className="bg-theme h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (donationCampaign.amount_raised /
                              donationCampaign.target_amount) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>

                    <p className="font-medium text-lg truncate">
                      {currencySymbol}
                      {donationCampaign.amount_raised} donated of&nbsp;
                      {currencySymbol}
                      {donationCampaign.target_amount}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100 p-4 flex flex-col items-center justify-center">
                  <h3 className="font-semibold text-gray-900 text-2xl text-center mb-4">
                    Scan to donate
                  </h3>
                  <div className="flex justify-center items-center py-2">
                    <div ref={qrRef} className="qr-code-container scale-110" />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PrayerLayout>
  );
}
