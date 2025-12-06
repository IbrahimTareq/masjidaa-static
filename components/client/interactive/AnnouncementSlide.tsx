"use client";

import { Bell } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
import PrayerLayout from "@/components/LayoutWithHeader";
import { getAnnouncement } from "@/lib/server/actions/announcementActions";
import type { Tables } from "@/database.types";

interface AnnouncementSlideProps {
  announcementId: string;
}

export default function AnnouncementSlide({
  announcementId,
}: AnnouncementSlideProps) {
  const [announcement, setAnnouncement] =
    useState<Tables<"announcements"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  // Fetch announcement data
  useEffect(() => {
    async function fetchAnnouncement() {
      try {
        setLoading(true);
        const data = await getAnnouncement(announcementId);
        if (!data) {
          throw new Error("Failed to fetch announcement");
        }
        setAnnouncement(data);
      } catch (err) {
        console.error("Error fetching announcement:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncement();
  }, [announcementId]);

  // Generate QR code when announcement is loaded
  useEffect(() => {
    if (announcement && announcementId && qrRef.current) {
      // Clear previous QR code
      qrRef.current.innerHTML = "";

      // Get current URL and construct announcement page URL
      const currentUrl = window.location.origin;
      const pathParts = window.location.pathname.split("/");
      const masjidSlug = pathParts[1]; // Assuming URL format: /:slug/...
      const announcementUrl = `${currentUrl}/${masjidSlug}/announcement/${announcementId}`;

      // Create QR code with styling
      const qrCode = new QRCodeStyling({
        width: 200,
        height: 200,
        type: "svg",
        data: announcementUrl,
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
  }, [announcement, announcementId]);

  if (loading) {
    return (
      <PrayerLayout headerTitle="Announcement">
        <div className="h-full bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 lg:w-24 lg:h-24 xl:w-32 xl:h-32 border-4 lg:border-6 xl:border-8 border-theme border-t-transparent rounded-full animate-spin mx-auto mb-4 lg:mb-6 xl:mb-8"></div>
            <p className="text-gray-600 text-base lg:text-lg xl:text-xl 2xl:text-2xl">Loading announcement...</p>
          </div>
        </div>
      </PrayerLayout>
    );
  }

  if (error || !announcement) {
    return (
      <PrayerLayout headerTitle="Announcement">
        <div className="h-full bg-white flex items-center justify-center">
          <div className="text-center">
            <Bell className="w-16 h-16 lg:w-24 lg:h-24 xl:w-32 xl:h-32 2xl:w-40 2xl:h-40 3xl:w-48 3xl:h-48 text-gray-400 mx-auto mb-4 lg:mb-6 xl:mb-8" />
            <p className="text-gray-600 text-base lg:text-lg xl:text-xl 2xl:text-2xl">Announcement not found</p>
          </div>
        </div>
      </PrayerLayout>
    );
  }

  return (
    <PrayerLayout headerTitle="Announcement">
      <div className="bg-white relative h-full w-full flex flex-col">
        <div className="relative z-10 h-full flex-1">
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 3xl:px-20 py-4 lg:py-6 xl:py-8 2xl:py-10 3xl:py-12 h-full">
            {/* Announcement Details - Full Width */}
            <div className="h-full">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-bold tracking-tight text-gray-900 mb-4 lg:mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12">
                {announcement.title}
              </h1>

              {/* Description & QR Code */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 xl:p-8 2xl:p-10 3xl:p-12 border border-gray-100 mb-6 lg:mb-8 xl:mb-10 2xl:mb-12 3xl:mb-16">
                <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 3xl:gap-16">
                  {/* Description */}
                  <div>
                    <div
                      className="text-gray-700 text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl leading-relaxed whitespace-pre-line overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 7,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {announcement.description}
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="text-center">
                    <div className="flex justify-center">
                      <div ref={qrRef} className="qr-code-container" />
                    </div>
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
