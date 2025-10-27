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
      <PrayerLayout headerTitle="Business Ad">
        <div className="h-full bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-theme border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading business ad...</p>
          </div>
        </div>
      </PrayerLayout>
    );
  }

  if (error || !businessAd) {
    return (
      <PrayerLayout headerTitle="Business Ad">
        <div className="h-full bg-white flex items-center justify-center">
          <div className="text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Business Ad not found</p>
          </div>
        </div>
      </PrayerLayout>
    );
  }

  // Render the business ad
  return (
    <section className="relative h-full w-full bg-white text-black font-montserrat py-10">
      {/* Hero Section */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row items-start justify-between w-full px-15 py-5 mx-auto">
          {/* Business Info */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4">
              {businessAd.name}{" "}
              <span className="text-gray-500 text-sm">(Sponsored Ad)</span>
            </p>

            {/* Contact Details */}
            <div className="text-gray-700 text-sm md:text-lg leading-relaxed space-y-2">
              {/* Row 1: Website + Phone */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-theme" />
                  {businessAd.website}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-theme" />
                  {businessAd.contact_number}
                </div>
              </div>

              {/* Row 2: Email + Address */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-theme" />
                  {businessAd.contact_email}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-theme" />
                  <span>{businessAd.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ad Message */}
          <div className="w-full md:w-2/3 md:pl-8 text-right max-w-3xl">
            <p className="text-3xl text-gray-500">{businessAd.message}</p>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full">
        <div className="w-full mx-auto px-15">
          <div
            className="w-full rounded-2xl overflow-hidden flex items-center justify-center transition-colors duration-500"
            style={{ backgroundColor: bgColor }}
          >
            {businessAd.image ? (
              <Image
                src={businessAd.image}
                alt={businessAd.name || "Business Ad"}
                className="w-full h-auto object-contain"
                width={1200}
                height={600}
                style={{ maxHeight: "600px", objectFit: "contain" }}
              />
            ) : (
              <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
                <Bell className="w-16 h-16 text-gray-300" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
