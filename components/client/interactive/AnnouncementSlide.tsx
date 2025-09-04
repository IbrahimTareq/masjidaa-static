"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import PrayerLayout from "@/components/LayoutWithHeader";
import { getAnnouncement } from "@/lib/server/actions/announcementActions";
import type { Tables } from "@/database.types";

interface AnnouncementSlideProps {
  announcementId: string;
}

export default function AnnouncementSlide({ announcementId }: AnnouncementSlideProps) {
  const [announcement, setAnnouncement] = useState<Tables<"announcements"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <PrayerLayout headerTitle="Announcement">
        <div className="h-full bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-theme border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading announcement...</p>
          </div>
        </div>
      </PrayerLayout>
    );
  }

  if (error) {
    return (
      <PrayerLayout headerTitle="Announcement">
        <div className="h-full bg-white flex items-center justify-center">
          <div className="text-center">
            <Bell className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </PrayerLayout>
    );
  }

  if (!announcement) {
    return (
      <PrayerLayout headerTitle="Announcement">
        <div className="h-full bg-white flex items-center justify-center">
          <div className="text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Announcement not found</p>
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
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 h-full">
            <div className="lg:flex lg:gap-12 h-full">
              {/* Left Column - Announcement Details */}
              <div className="flex-1 mb-8 lg:mb-0">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-8">
                  {announcement.title}
                </h1>

                {/* Description */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    About this Announcement
                  </h3>
                  <div 
                    className="text-gray-700 leading-relaxed whitespace-pre-line overflow-hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 15,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {announcement.description}
                  </div>
                </div>
              </div>

              {/* Right Column - Announcement Image */}
              <div className="lg:w-[480px] flex flex-col gap-6">
                <div className="aspect-[5/6] rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100">
                  {announcement.image ? (
                    <img
                      src={announcement.image}
                      alt={announcement.title}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Bell className="w-16 h-16 sm:w-32 sm:h-32 text-gray-300" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PrayerLayout>
  );
}