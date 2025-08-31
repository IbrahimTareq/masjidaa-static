"use client";

import { Calendar, MapPin } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
import PrayerLayout from "@/components/LayoutWithHeader";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import type { Tables } from "@/database.types";
import { getDonationCampaign } from "@/lib/server/actions/donationCampaignActions";

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
  const { formatTime, formatDate } = useDateTimeFormat();
  const qrRef = useRef<HTMLDivElement>(null);

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

  // Generate QR code when event is loaded
  useEffect(() => {
    if (donationCampaign && donationCampaignId && qrRef.current) {
      // Clear previous QR code
      qrRef.current.innerHTML = "";

      // Get current URL and construct event page URL
      const currentUrl = window.location.origin;
      const pathParts = window.location.pathname.split("/");
      const masjidSlug = pathParts[1]; // Assuming URL format: /:slug/...
      const donationCampaignUrl = `${currentUrl}/${masjidSlug}/donation-campaign/${donationCampaignId}`;

      // Create QR code with styling
      const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: donationCampaignUrl,
        dotsOptions: {
          color: "#374151", // gray-700
          type: "rounded",
        },
        backgroundOptions: {
          color: "#ffffff",
        },
        cornersSquareOptions: {
          color: "#374151",
          type: "rounded",
        },
        cornersDotOptions: {
          color: "#374151",
          type: "rounded",
        },
      });

      qrCode.append(qrRef.current);
    }
  }, [donationCampaign, donationCampaignId]);

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
                      className="text-gray-700 text-lg leading-relaxed whitespace-pre-line overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 9,
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
                      className="text-gray-700 text-lg leading-relaxed whitespace-pre-line overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 9,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      <p className="font-light">
                        Allah سبحانه وتعالى says in the Quran:
                      </p>
                      <p className="font-bold mt-2 text-2xl">
                        مَّثَلُ ٱلَّذِينَ يُنفِقُونَ أَمْوَٰلَهُمْ فِى سَبِيلِ
                        ٱللَّهِ كَمَثَلِ حَبَّةٍ أَنۢبَتَتْ سَبْعَ سَنَابِلَ فِى
                        كُلِّ سُنۢبُلَةٍۢ مِّا۟ئَةُ حَبَّةٍۢ ۗ وَٱللَّهُ
                        يُضَـٰعِفُ لِمَن يَشَآءُ ۗ
                      </p>
                      <p className="font-semibold mt-2">
                        "The example of those who spend their wealth in the
                        cause of Allah is that of a grain that sprouts into
                        seven ears, each bearing one hundred grains. And Allah
                        multiplies the reward even more to whoever He wills. For
                        Allah is All-Bountiful, All-Knowing."
                      </p>
                      <p className="font-light mt-2">[Surah Baqarah 2:261]</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Event Image */}
              <div className="lg:w-[480px] flex flex-col">
                <div className="rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
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
