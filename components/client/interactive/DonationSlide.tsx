"use client";

import PrayerLayout from "@/components/LayoutWithHeader";
import { useMasjidContext } from "@/context/masjidContext";
import type { Tables } from "@/database.types";
import { getDonationCampaign } from "@/lib/server/actions/donationCampaignActions";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import getSymbolFromCurrency from "currency-symbol-map";
import { Calendar } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
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

  // Generate QR code when donation campaign is loaded
  useEffect(() => {
    if (donationCampaign && donationCampaignId && qrRef.current && masjid) {
      // Clear previous QR code
      qrRef.current.innerHTML = "";

      const donationUrl = `${DOMAIN_NAME}/${masjid.slug}/donation/${donationCampaignId}`;

      // Calculate responsive QR code size based on viewport
      const viewportWidth = window.innerWidth;
      const qrSize = Math.min(Math.max(viewportWidth * 0.15, 180), 400);

      // Create QR code with responsive styling
      const qrCode = new QRCodeStyling({
        width: qrSize,
        height: qrSize,
        type: "svg",
        data: donationUrl,
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
  }, [donationCampaign, donationCampaignId, masjid]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-theme border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donation campaign...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !donationCampaign) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Donation campaign not found</p>
        </div>
      </div>
    );
  }

  // Render donation
  return (
    <div className="w-full overflow-x-hidden bg-white min-h-screen font-montserrat">
      {/* Hero Section */}
      <div className="w-full bg-white">
        <div
          className="mx-auto px-[2vw] py-[2vh]"
          style={{
            maxWidth: "clamp(800px, 90vw, 1400px)",
          }}
        >
          <div className="text-center">
            <h1
              className="font-bold text-gray-900 leading-tight break-words mb-[1.5vh] truncate"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 4rem)",
              }}
            >
              {donationCampaign.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full bg-gray-50">
        <div
          className="mx-auto px-[2vw] py-[2.5vh]"
          style={{
            maxWidth: "clamp(800px, 90vw, 1400px)",
          }}
        >
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{
              gap: "clamp(1rem, 1.5vw, 3rem)",
            }}
          >
            {/* Main Content - Description and Progress */}
            <div className="md:col-span-2 w-full min-w-0">
              {/* Description */}
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full mb-[1.5vh]"
                style={{
                  padding: "clamp(1rem, 1.5vw, 3rem)",
                }}
              >
                <p
                  className="font-bold text-gray-900 mb-[1.5vh]"
                  style={{
                    fontSize: "clamp(1.125rem, 1.7vw, 2rem)",
                  }}
                >
                  {currencySymbol}
                  {donationCampaign.amount_raised.toLocaleString()} raised of{" "}
                  {currencySymbol}
                  {donationCampaign.target_amount.toLocaleString()}
                </p>

                {/* Progress Bar */}
                <div className="flex items-center gap-[1vw] mb-[1.5vh]">
                  <div
                    className="flex-1 bg-gray-200 rounded-full"
                    style={{
                      height: "clamp(0.625rem, 0.9vw, 1.25rem)",
                    }}
                  >
                    <div
                      className="bg-theme rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (donationCampaign.amount_raised /
                            donationCampaign.target_amount) *
                            100
                        )}%`,
                        height: "100%",
                      }}
                    ></div>
                  </div>
                  <p
                    className="text-theme font-bold flex-shrink-0"
                    style={{
                      fontSize: "clamp(1rem, 1.4vw, 1.875rem)",
                    }}
                  >
                    {Math.round(
                      (donationCampaign.amount_raised /
                        donationCampaign.target_amount) *
                        100
                    )}
                    %
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 mb-[1.5vh]"></div>

                {donationCampaign.description ? (
                  <div className="w-full">
                    <p
                      className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-hidden"
                      style={{
                        fontSize: "clamp(1.125rem, 1.5vw, 1.75rem)",
                        lineHeight: "1.6",
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {donationCampaign.description}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-[3vh]">
                    <Calendar
                      className="text-gray-300 mx-auto mb-3"
                      style={{
                        width: "clamp(2.5rem, 3.5vw, 6rem)",
                        height: "clamp(2.5rem, 3.5vw, 6rem)",
                      }}
                    />
                    <p
                      className="text-gray-500"
                      style={{
                        fontSize: "clamp(0.875rem, 1vw, 1.25rem)",
                      }}
                    >
                      No description available for this campaign
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1 w-full min-w-0">
              {/* QR Code */}
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center w-full"
                style={{
                  padding: "clamp(0.875rem, 1.3vw, 2rem)",
                }}
              >
                <div className="flex justify-center mb-[0.75vh]">
                  <div ref={qrRef} className="qr-code-container" />
                </div>
                <p
                  className="text-gray-600 leading-relaxed"
                  style={{
                    fontSize: "clamp(1rem, 1.3vw, 1.625rem)",
                  }}
                >
                  Scan to donate
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
