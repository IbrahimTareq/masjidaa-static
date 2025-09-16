"use client";

import { WavyBackground } from "@/components/client/ui/WavyBackground";
import { Tables } from "@/database.types";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import { useThemeColors } from "@/hooks/useThemeColors";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import { Calendar, Check, MapPin, Share, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function EventClient({
  event,
  eventLink,
}: {
  event: Tables<"events">;
  eventLink: string;
}) {
  const { formatTime, formatDate } = useDateTimeFormat();
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);

  const [copied, setCopied] = useState(false);

  const searchParams = useSearchParams();
  const eventDateParam = searchParams.get("eventDate");

  const eventDate = eventDateParam || event.date;

  // Handle click outside to close calendar options
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        calendarButtonRef.current &&
        !calendarButtonRef.current.contains(event.target as Node)
      ) {
        setShowCalendarOptions(false);
      }
    };

    if (showCalendarOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendarOptions]);

  const shareEvent = async () => {
    try {
      await navigator.clipboard.writeText(eventLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200); // reset after 1.2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const openImagePreview = () => {
    if (event?.image) {
      setIsImagePreviewOpen(true);
    }
  };

  const closeImagePreview = () => {
    setIsImagePreviewOpen(false);
  };

  const { colorVariations } = useThemeColors();

  return (
    <div className="bg-white/80 relative overflow-hidden my-10">
      {/* Wavy Background */}
      <WavyBackground
        colors={colorVariations}
        waveWidth={60}
        blur={0}
        speed="slow"
        waveOpacity={0.2}
        containerClassName="absolute bottom-[-10%] left-0 right-0"
      />

      <div className="relative z-10">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:flex lg:gap-12">
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
                        {formatDate(eventDate)}
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

              {/* Description */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  About this event
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </div>
              </div>

              {/* Action Buttons - Mobile Only */}
              <div className="flex flex-wrap gap-4 lg:hidden relative">
                <button
                  onClick={shareEvent}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-theme text-white rounded-lg hover:bg-theme/90 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Share className="w-5 h-5" />
                  )}
                  <span className="font-medium">
                    {copied ? "Copied!" : "Share Event Link"}
                  </span>
                </button>
                <button
                  onClick={() => setShowCalendarOptions(!showCalendarOptions)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-color cursor-pointer"
                >
                  <Calendar className="w-5 h-5 text-theme" />
                  <span className="font-medium text-gray-700">
                    Add to Calendar
                  </span>
                </button>

                {/* Mobile Calendar Options Popup */}
                {showCalendarOptions && (
                  <div
                    ref={calendarRef}
                    className="absolute left-0 right-0 bottom-full mb-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100 z-20 animate-fade-in"
                  >
                    <div className="flex flex-wrap gap-2">
                      <AddToCalendarButton
                        name={event.title}
                        description={event.description || ""}
                        location={event.location || ""}
                        startDate={eventDate}
                        startTime={event.start_time || ""}
                        endTime={event.start_time || ""}
                        options={[
                          "Apple",
                          "Google",
                          "iCal",
                          "Microsoft365",
                          "Outlook.com",
                          "Yahoo",
                        ]}
                        buttonsList
                        hideTextLabelButton
                        buttonStyle="round"
                        lightMode="bodyScheme"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Event Image and Desktop Buttons */}
            <div className="lg:w-[480px] flex flex-col gap-6">
              <div
                className="aspect-[4/3] rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100 cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={openImagePreview}
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar className="w-16 h-16 sm:w-32 sm:h-32 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Action Buttons - Desktop Only */}
              <div className="hidden lg:flex gap-4 relative">
                <button
                  onClick={shareEvent}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-theme text-white rounded-lg hover:bg-theme/90 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Share className="w-5 h-5" />
                  )}
                  <span className="font-medium">
                    {copied ? "Copied!" : "Share Event Link"}
                  </span>
                </button>
                <button
                  ref={calendarButtonRef}
                  onClick={() => setShowCalendarOptions(!showCalendarOptions)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Calendar className="w-5 h-5 text-theme" />
                  <span className="font-medium text-gray-700">
                    Add to Calendar
                  </span>
                </button>

                {/* Calendar Options Popup */}
                {showCalendarOptions && (
                  <div
                    ref={calendarRef}
                    className="absolute right-0 bottom-full mb-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100 z-20 animate-fade-in"
                  >
                    <div className="flex flex-wrap gap-2">
                      <AddToCalendarButton
                        name={event.title}
                        description={event.description || ""}
                        location={event.location || ""}
                        startDate={eventDate}
                        startTime={event.start_time || ""}
                        endTime={event.start_time || ""}
                        options={[
                          "Apple",
                          "Google",
                          "iCal",
                          "Microsoft365",
                          "Outlook.com",
                          "Yahoo",
                        ]}
                        buttonsList
                        hideTextLabelButton
                        buttonStyle="round"
                        lightMode="bodyScheme"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Image Preview Modal */}
      {isImagePreviewOpen && event.image && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={closeImagePreview}
        >
          <button
            onClick={closeImagePreview}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={event.image}
            alt={event.title}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
