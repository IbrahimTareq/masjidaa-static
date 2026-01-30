"use client";

import { Calendar, MapPin, Clock } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import type { Tables } from "@/database.types";
import { getEvent } from "@/lib/server/actions/eventActions";
import { useMasjidContext } from "@/context/masjidContext";

interface EventSlideProps {
  eventId: string;
}

export default function EventSlide({ eventId }: EventSlideProps) {
  const [event, setEvent] = useState<Tables<"events"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formatTime, formatDate } = useDateTimeFormat();
  const qrRef = useRef<HTMLDivElement>(null);
  const masjid = useMasjidContext();

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
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  // Generate QR code when event is loaded
  useEffect(() => {
    if (event && eventId && qrRef.current && masjid?.slug) {
      // Clear previous QR code
      qrRef.current.innerHTML = "";

      // Get current URL and construct event page URL
      const currentUrl = window.location.origin;
      const eventUrl = `${currentUrl}/${masjid.slug}/event/${eventId}?eventDate=${event.date}`;

      // Calculate responsive QR code size based on viewport
      const viewportWidth = window.innerWidth;
      const qrSize = Math.min(Math.max(viewportWidth * 0.15, 180), 400);

      // Create QR code with responsive styling
      const qrCode = new QRCodeStyling({
        width: qrSize,
        height: qrSize,
        type: "svg",
        data: eventUrl,
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
  }, [event, eventId, masjid?.slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-theme border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Event not found</p>
        </div>
      </div>
    );
  }

  // Render event
  return (
    <div className="w-full overflow-x-hidden bg-white min-h-screen font-montserrat">
      {/* Hero Section */}
      <div className="w-full bg-white">
        <div
          className="mx-auto px-[2vw] py-[2vh]"
          style={{
            maxWidth: 'clamp(800px, 90vw, 1400px)',
          }}
        >
          <div className="text-center">
            <h1
              className="font-bold text-gray-900 leading-tight break-words mb-[1.5vh] truncate"
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 4rem)',
              }}
            >
              {event.title}
            </h1>

            {/* Key Event Info - Responsive */}
            <div
              className="flex flex-col md:flex-row items-center justify-center text-gray-700 flex-wrap"
              style={{
                gap: 'clamp(0.75rem, 1.5vw, 3rem)',
              }}
            >
              <div className="flex items-center gap-[0.5vw]">
                <Calendar
                  className="text-theme flex-shrink-0"
                  style={{
                    width: 'clamp(1rem, 1.3vw, 2rem)',
                    height: 'clamp(1rem, 1.3vw, 2rem)',
                  }}
                />
                <span
                  className="font-medium"
                  style={{
                    fontSize: 'clamp(0.875rem, 1.1vw, 1.5rem)',
                  }}
                >
                  {formatDate(event.date)}
                </span>
              </div>
              {event.start_time && (
                <div className="flex items-center gap-[0.5vw]">
                  <Clock
                    className="text-theme flex-shrink-0"
                    style={{
                      width: 'clamp(1rem, 1.3vw, 2rem)',
                      height: 'clamp(1rem, 1.3vw, 2rem)',
                    }}
                  />
                  <span
                    className="font-medium"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.1vw, 1.5rem)',
                    }}
                  >
                    {formatTime(event.start_time)}
                  </span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-[0.5vw]">
                  <MapPin
                    className="text-theme flex-shrink-0"
                    style={{
                      width: 'clamp(1rem, 1.3vw, 2rem)',
                      height: 'clamp(1rem, 1.3vw, 2rem)',
                    }}
                  />
                  <span
                    className="font-medium break-words"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.1vw, 1.5rem)',
                    }}
                  >
                    {event.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full bg-gray-50">
        <div
          className="mx-auto px-[2vw] py-[2.5vh]"
          style={{
            maxWidth: 'clamp(800px, 90vw, 1400px)',
          }}
        >
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{
              gap: 'clamp(1rem, 1.5vw, 3rem)',
            }}
          >
            {/* Main Content - Description */}
            <div className="md:col-span-2 w-full min-w-0">
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full"
                style={{
                  padding: 'clamp(1rem, 1.5vw, 3rem)',
                }}
              >
                <h2
                  className="font-bold text-gray-900 mb-[1.5vh]"
                  style={{
                    fontSize: 'clamp(1.25rem, 1.8vw, 2rem)',
                  }}
                >
                  About this event
                </h2>
                {event.description ? (
                  <div className="w-full">
                    <p
                      className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-hidden"
                      style={{
                        fontSize: 'clamp(1.125rem, 1.5vw, 1.875rem)',
                        lineHeight: '1.6',
                        display: '-webkit-box',
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {event.description}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-[3vh]">
                    <Calendar
                      className="text-gray-300 mx-auto mb-3"
                      style={{
                        width: 'clamp(2.5rem, 3.5vw, 6rem)',
                        height: 'clamp(2.5rem, 3.5vw, 6rem)',
                      }}
                    />
                    <p
                      className="text-gray-500"
                      style={{
                        fontSize: 'clamp(0.875rem, 1vw, 1.25rem)',
                      }}
                    >
                      No description available for this event
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
                  padding: 'clamp(0.875rem, 1.3vw, 2rem)',
                }}
              >
                <div className="flex justify-center mb-[0.75vh]">
                  <div ref={qrRef} className="qr-code-container" />
                </div>
                <p
                  className="text-gray-600 leading-relaxed"
                  style={{
                    fontSize: 'clamp(0.875rem, 1.2vw, 1.875rem)',
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
