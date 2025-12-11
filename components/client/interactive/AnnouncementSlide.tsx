"use client";

import { Bell } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
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

      // Calculate responsive QR code size based on viewport
      const viewportWidth = window.innerWidth;
      const qrSize = Math.min(Math.max(viewportWidth * 0.18, 220), 400);

      // Create QR code with responsive styling
      const qrCode = new QRCodeStyling({
        width: qrSize,
        height: qrSize,
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-theme border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading announcement...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Announcement not found</p>
        </div>
      </div>
    );
  }

  // Render announcement
  return (
    <div className="w-full overflow-x-hidden bg-white min-h-screen font-montserrat">
      {/* Hero Section */}
      <div className="w-full bg-white">
        <div
          className="mx-auto px-[2vw] py-[3vh]"
          style={{
            maxWidth: 'clamp(800px, 90vw, 1400px)',
          }}
        >
          <div className="text-center">
            <h1
              className="font-bold text-gray-900 leading-tight break-words mb-[2vh] truncate"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 4rem)',
              }}
            >
              {announcement.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full bg-gray-50">
        <div
          className="mx-auto px-[2vw] py-[4vh]"
          style={{
            maxWidth: 'clamp(800px, 90vw, 1400px)',
          }}
        >
          <div
            className="grid grid-cols-1 xl:grid-cols-3"
            style={{
              gap: 'clamp(1.5rem, 2vw, 3rem)',
            }}
          >
            {/* Main Content - Description */}
            <div className="xl:col-span-2 w-full min-w-0">
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full"
                style={{
                  padding: 'clamp(1.5rem, 2vw, 3rem)',
                }}
              >
                <h2
                  className="font-bold text-gray-900 mb-[2vh]"
                  style={{
                    fontSize: 'clamp(1.25rem, 2vw, 2rem)',
                  }}
                >
                  About this announcement
                </h2>
                {announcement.description ? (
                  <div className="w-full">
                    <p
                      className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-hidden"
                      style={{
                        fontSize: 'clamp(1.25rem, 1.6vw, 1.875rem)',
                        lineHeight: '1.7',
                        display: '-webkit-box',
                        WebkitLineClamp: 7,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {announcement.description}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-[4vh]">
                    <Bell
                      className="text-gray-300 mx-auto mb-4"
                      style={{
                        width: 'clamp(3rem, 4vw, 6rem)',
                        height: 'clamp(3rem, 4vw, 6rem)',
                      }}
                    />
                    <p
                      className="text-gray-500"
                      style={{
                        fontSize: 'clamp(1rem, 1.1vw, 1.25rem)',
                      }}
                    >
                      No description available for this announcement
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 w-full min-w-0">
              {/* QR Code */}
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center w-full"
                style={{
                  padding: 'clamp(1rem, 1.5vw, 2rem)',
                }}
              >
                <div className="flex justify-center mb-[1vh]">
                  <div ref={qrRef} className="qr-code-container" />
                </div>
                <p
                  className="text-gray-600 leading-relaxed"
                  style={{
                    fontSize: 'clamp(1.25rem, 1.6vw, 1.875rem)',
                  }}
                >
                  Scan QR code for more information
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
