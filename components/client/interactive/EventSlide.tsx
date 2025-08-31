"use client";

import { Calendar, MapPin } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
import PrayerLayout from "@/components/LayoutWithHeader";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import type { Tables } from "@/database.types";
import { getEvent } from "@/lib/server/actions/eventActions";

interface EventSlideProps {
  eventId: string;
}

export default function EventSlide({ eventId }: EventSlideProps) {
  const [event, setEvent] = useState<Tables<"events"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { formatTime, formatDate } = useDateTimeFormat();
  const qrRef = useRef<HTMLDivElement>(null);

  // Fetch event data
  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const data = await getEvent(eventId);
        if (!data) {
          throw new Error("Failed to fetch event");
        }
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  // Generate QR code when event is loaded
  useEffect(() => {
    if (event && eventId && qrRef.current) {
      // Clear previous QR code
      qrRef.current.innerHTML = '';

      // Get current URL and construct event page URL
      const currentUrl = window.location.origin;
      const pathParts = window.location.pathname.split('/');
      const masjidSlug = pathParts[1]; // Assuming URL format: /:slug/...
      const eventUrl = `${currentUrl}/${masjidSlug}/event/${eventId}`;

      // Create QR code with styling
      const qrCode = new QRCodeStyling({
        width: 200,
        height: 200,
        type: "svg",
        data: eventUrl,
        dotsOptions: {
          color: "#374151", // gray-700
          type: "rounded"
        },
        backgroundOptions: {
          color: "#ffffff",
        },
        cornersSquareOptions: {
          color: "#374151",
          type: "rounded"
        },
        cornersDotOptions: {
          color: "#374151",
          type: "rounded"
        }
      });

      qrCode.append(qrRef.current);
    }
  }, [event, eventId]);

  // Loading state
  if (loading) {
    return (
      <PrayerLayout headerTitle="Event">
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
  if (error || !event) {
    return (
      <PrayerLayout headerTitle="Event">
        <div className="h-full bg-white flex items-center justify-center">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Event not found</p>
          </div>
        </div>
      </PrayerLayout>
    );
  }

  // Render event
  return (
    <PrayerLayout headerTitle="Event">
      <div className="bg-white relative h-full w-full flex flex-col">
        <div className="relative z-10 h-full flex-1">
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 h-full">
            <div className="lg:flex lg:gap-12 h-full">
              {/* Left Column - Event Details */}
              <div className="flex-1 mb-8 lg:mb-0">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-8">
                  {event.title}
                </h1>

                {/* Quick Info Cards */}
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  {/* Date & Time Card */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
                    <div className="flex items-start">
                      <Calendar className="w-6 h-6 text-theme mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Date & Time
                        </h3>
                        <p className="text-lg text-gray-800">
                          {formatDate(event.date)}
                        </p>
                        <p className="text-gray-600">
                          {event.start_time && formatTime(event.start_time)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location Card */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
                    <div className="flex items-start">
                      <MapPin className="w-6 h-6 text-theme mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Location
                        </h3>
                        <p className="text-lg text-gray-800">{event.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description & QR Code */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 mb-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Description */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        About this Event
                      </h3>
                      <div 
                        className="text-gray-700 leading-relaxed whitespace-pre-line overflow-hidden"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 9,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {event.description}
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Scan for More Details
                      </h3>
                      <div className="flex justify-center">
                        <div ref={qrRef} className="qr-code-container" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Event Image */}
              <div className="lg:w-[480px]">
                <div className="aspect-[5/6] rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="w-24 h-24 sm:w-40 sm:h-40 text-gray-300" />
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