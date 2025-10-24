"use client";

import { WavyBackground } from "@/components/client/ui/WavyBackground";
import { Tables } from "@/database.types";
import { EventRegistration } from "@/event-registration/src";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import { useThemeColors } from "@/hooks/useThemeColors";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import { Calendar, Check, MapPin, Share, Users, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function EventClient({
  event,
  eventLink,
  eventForm,
  bankAccount,
  masjid,
  enrollmentStatus,
}: {
  event: Tables<"events">;
  eventLink: string;
  eventForm?: Tables<"event_forms"> | null;
  bankAccount?: Tables<"masjid_bank_accounts"> | null;
  masjid: Tables<"masjids">;
  enrollmentStatus?: {
    isFull: boolean;
    currentEnrollments: number;
    limit: number | null;
  } | null;
}) {
  const { formatTime, formatDate } = useDateTimeFormat();
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          requestAnimationFrame(() => {
            setTimeout(() => {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 200);
          });
        }
      }
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

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
    <div className="bg-white/80 relative overflow-hidden my-6 sm:my-10">
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
          {/* Two-column layout container */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Left Column - Event Details (7/12 width) */}
            <div className="lg:col-span-7 mb-8 lg:mb-0">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                {event.title}
              </h1>

              {/* Event Image */}
              <div
                className="aspect-video rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100 cursor-pointer transition-transform hover:scale-[1.01] mb-8"
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

              {/* Description */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">
                  About this event
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </div>
              </div>

              {/* Action Buttons - Mobile Only */}
              <div className="mt-8 lg:hidden relative space-y-3">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl">
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={shareEvent}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-theme text-white rounded-lg hover:bg-theme/90 transition-colors cursor-pointer shadow-sm"
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
                      onClick={() =>
                        setShowCalendarOptions(!showCalendarOptions)
                      }
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
                    >
                      <Calendar className="w-5 h-5 text-theme" />
                      <span className="font-medium text-gray-700">
                        Add to Calendar
                      </span>
                    </button>
                  </div>

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
            </div>

            {/* Right Column - Registration and Share Buttons (5/12 width) */}
            <div className="lg:col-span-5">
              <div className="sticky top-6">
                <div className="space-y-6">
                  {/* Quick Info Cards */}
                  <div className="flex flex-col gap-6">
                    {/* Date & Time Card */}
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm">
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
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-start">
                        <MapPin className="w-6 h-6 text-theme mr-4 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Location
                          </h3>
                          <p className="text-lg text-gray-800">
                            {event.location || "To be confirmed"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {enrollmentStatus && (
                      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-start">
                          <Users className="w-6 h-6 text-theme mr-4 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              Enrollment Status
                            </h3>
                            <p className="text-lg text-gray-800">
                              {enrollmentStatus?.currentEnrollments}/
                              {enrollmentStatus?.limit} spots
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Event Registration Form */}
                  {masjid &&
                    (event.type === "free" || event.type === "paid") && (
                      <EventRegistration
                        event={event}
                        masjid={masjid}
                        bankAccount={bankAccount || undefined}
                        eventForm={eventForm || undefined}
                        enrollmentStatus={enrollmentStatus}
                      />
                    )}

                  {/* Action Buttons - Desktop Only */}
                  <div className="hidden lg:block space-y-4 relative">
                    <div className="space-y-3">
                      <button
                        onClick={shareEvent}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-theme text-white rounded-lg hover:bg-theme/90 transition-colors cursor-pointer shadow-sm"
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
                        onClick={() =>
                          setShowCalendarOptions(!showCalendarOptions)
                        }
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
                      >
                        <Calendar className="w-5 h-5 text-theme" />
                        <span className="font-medium text-gray-700">
                          Add to Calendar
                        </span>
                      </button>
                    </div>

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
            </div>
          </div>
        </main>
      </div>

      {/* Image Preview Modal */}
      {isImagePreviewOpen && event.image && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={closeImagePreview}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
          <button
            onClick={closeImagePreview}
            className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors shadow-lg"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="relative z-10 max-w-4xl w-full">
            <img
              src={event.image}
              alt={event.title}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
