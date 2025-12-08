"use client";

import PrayerLayout from "@/components/LayoutWithHeader";
import { getBusinessAd } from "@/lib/server/actions/businessAdActions";
import { Bell, Globe, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";

interface BusinessSlideProps {
  adId: string;
}

export default function BusinessSlide({ adId }: BusinessSlideProps) {
  const [businessAd, setBusinessAd] = useState<{
    image: string | null;
    message: string | null;
    website: string | null;
    contact_email: string | null;
    address: string | null;
    contact_number: string | null;
    name: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#f9fafb"); // Default light gray background

  // Fetch business ad data
  useEffect(() => {
    async function fetchBusinessAd() {
      try {
        setLoading(true);
        const data = await getBusinessAd(adId);
        if (!data) {
          throw new Error("Failed to fetch business ad");
        }
        setBusinessAd(data);
      } catch (err) {
        console.error("Error fetching business ad:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchBusinessAd();
  }, [adId]);

  // Extract average color from the image using fast-average-color
  useEffect(() => {
    if (!businessAd?.image) return;

    const fac = new FastAverageColor();
    fac
      .getColorAsync(businessAd.image)
      .then((color) => setBgColor(color.hex))
      .catch((err) => {
        console.error("Error extracting average color:", err);
        setBgColor("#f9fafb");
      });

    return () => fac.destroy();
  }, [businessAd?.image]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-theme border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business ad...</p>
        </div>
      </div>
    );
  }

  if (error || !businessAd) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Business Ad not found</p>
        </div>
      </div>
    );
  }

  // Render the business ad
  return (
    <div className="w-full overflow-hidden bg-gray-900 min-h-screen font-montserrat relative">
      {/* Full-Screen Background Image */}
      <div className="absolute inset-0">
        {businessAd.image ? (
          <Image
            src={businessAd.image}
            alt={businessAd.name || "Business Ad"}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center transition-colors duration-500"
            style={{ backgroundColor: bgColor }}
          >
            <Bell
              className="text-white/30"
              style={{
                width: 'clamp(8rem, 12vw, 12rem)',
                height: 'clamp(8rem, 12vw, 12rem)',
              }}
            />
          </div>
        )}
      </div>

      {/* Lighter Dark Overlay - More image visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>

      {/* Content Overlay - Top Left */}
      <div className="relative z-10 min-h-screen flex items-start justify-start">
        <div
          className="max-w-xl text-white"
          style={{
            padding: 'clamp(1.5rem, 3vw, 3rem)',
            paddingTop: 'clamp(2rem, 4vh, 4rem)',
          }}
        >
          {/* Sponsored Label Above Business Name */}
          <div
            className="mb-2"
            style={{
              marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)',
            }}
          >
            <div
              className="inline-block bg-white/25 backdrop-blur-sm rounded-full px-3 py-1 border border-white/40"
              style={{
                fontSize: 'clamp(0.75rem, 1vw, 1rem)',
              }}
            >
              <span className="text-white font-medium">Sponsored</span>
            </div>
          </div>

          {/* Business Name */}
          <div
            style={{
              marginBottom: 'clamp(1rem, 2vh, 2rem)',
            }}
          >
            <h1
              className="font-bold leading-none break-words text-white"
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 5rem)',
                lineHeight: '0.95',
                textShadow: '0 4px 12px rgba(0,0,0,0.7)',
              }}
            >
              {businessAd.name}
            </h1>
          </div>

          {/* Ad Message */}
          {businessAd.message && (
            <div
              style={{
                marginBottom: 'clamp(1.5rem, 2vh, 2rem)',
              }}
            >
              <p
                className="text-white/95 leading-tight break-words font-semibold drop-shadow-md"
                style={{
                  fontSize: 'clamp(1.125rem, 2vw, 2.25rem)',
                  lineHeight: '1.3',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                "{businessAd.message}"
              </p>
            </div>
          )}

          {/* Address Only */}
          {businessAd.address && (
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-2 border border-white/30 w-fit">
              <MapPin
                className="text-white flex-shrink-0 drop-shadow-sm"
                style={{
                  width: 'clamp(1rem, 1.2vw, 1.25rem)',
                  height: 'clamp(1rem, 1.2vw, 1.25rem)',
                }}
              />
              <span
                className="text-white font-medium break-words"
                style={{
                  fontSize: 'clamp(0.875rem, 1.2vw, 1.25rem)',
                }}
              >
                {businessAd.address}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
