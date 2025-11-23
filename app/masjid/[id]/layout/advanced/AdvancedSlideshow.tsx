"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import { usePrayerScreen } from "@/hooks/usePrayerScreen";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { useRef } from "react";

import Slideshow, { Slide } from "@/components/client/interactive/Slideshow";
import { useQRCode } from "@/hooks/useQRCode";
import { useScreenDim } from "@/hooks/useScreenDim";
import { DOMAIN_NAME, SWIPER_SETTINGS } from "@/utils/shared/constants";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

// Helper function to format time with smaller AM/PM
const formatTimeWithSmallPeriod = (time: string | null) => {
  if (!time) return null;
  // Split time and AM/PM (e.g., "4:09 AM" -> ["4:09", "AM"])
  const parts = time.match(/^(.+?)\s*(AM|PM)$/i);
  if (parts) {
    return (
      <>
        {parts[1]}<span className="text-[0.5em] ml-0.5">{parts[2]}</span>
      </>
    );
  }
  return time;
};

export default function AdvancedSlideshow({
  formattedData,
  slides,
}: {
  formattedData: FormattedData;
  slides: Slide[];
}) {
  const {
    dailyPrayerTimes,
    jummahPrayerTimes,
    hijriDate,
    gregorianDate,
    prayerInfo,
  } = formattedData;

  const qrRef = useRef<HTMLDivElement>(null);

  const masjid = useMasjidContext();

  const { formatCurrentTime } = useDateTimeFormat();

  const time = formatCurrentTime();

  // Use the prayer screen hook to get next event and countdown
  const { nextEvent, countdown } = usePrayerScreen(prayerInfo);

  // Check if we're in iqamah state and countdown is zero
  const isIqamah = nextEvent.label.toLowerCase() === "iqamah";
  const countdownZero =
    countdown.hours === "00" &&
    countdown.minutes === "00" &&
    countdown.seconds === "00";

  useQRCode(
    {
      data: `${DOMAIN_NAME}/${masjid?.slug}`,
      width: 120,
      height: 120,
    },
    qrRef
  );

  // Use the screen dim hook to handle dimming when iqamah countdown reaches zero
  const { isDimmed, opacity, remainingPercent } = useScreenDim({
    shouldDim: isIqamah && countdownZero,
    durationMinutes: 5,
    dimOpacity: 0.8,
  });

  return (
    <div className="h-screen w-screen bg-white flex flex-col lg:flex-row overflow-hidden relative">
      {/* Dimming overlay */}
      {isDimmed && (
        <div
          className="absolute inset-0 bg-black z-50 pointer-events-none transition-opacity duration-500"
          style={{ opacity: opacity }}
        >
          {/* Optional: Progress indicator for remaining dim time */}
          <div
            className="absolute top-0 left-0 right-0 h-1 bg-theme-accent"
            style={{
              width: `${remainingPercent}%`,
              transition: "width 1s linear",
            }}
          ></div>
        </div>
      )}
      {/* Mobile Top Bar - Only visible on mobile */}
      <div className="lg:hidden bg-theme text-white p-3 flex justify-between items-center flex-shrink-0">
        <div className="text-center">
          <div className="text-lg font-light">{time}</div>
          <div className="text-xs opacity-90">
            {nextEvent.prayer} {nextEvent.label} in {countdown.hours}{" "}
            <span className="text-base font-semibold">hr</span>&nbsp;
            {countdown.minutes}{" "}
            <span className="text-base font-semibold">min</span>&nbsp;
            {countdown.seconds}{" "}
            <span className="text-base font-semibold">sec</span>&nbsp;
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium uppercase">{hijriDate}</div>
          <div className="text-sm font-medium uppercase">{gregorianDate}</div>
        </div>
        <div className="w-12 h-12 bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden">
          <img
            src={masjid?.logo || "/logo.png"}
            alt="Masjid Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Left Section: Content + Bottom Bar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="w-full h-full">
            <Slideshow slides={slides} />
          </div>
        </div>

        {/* Bottom Prayer Times Bar */}
        <div className="h-16 sm:h-32 bg-white border-t border-gray-200 flex-shrink-0 shadow-lg">
          <div className="h-full flex">
            {dailyPrayerTimes?.map((prayer, index) => (
              <div
                key={prayer.name}
                className={`flex-1 flex flex-col justify-center items-center px-2 relative ${
                  prayer.isActive
                    ? "bg-theme-accent font-bold text-theme-gradient border-t-4 border-theme"
                    : "bg-white text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                } ${
                  index !== dailyPrayerTimes?.length - 1 &&
                  !prayer.isActive &&
                  !dailyPrayerTimes?.[index + 1]?.isActive
                    ? "border-r border-gray-100"
                    : ""
                }`}
              >
                <div className="font-semibold text-xl sm:text-2xl mb-1 text-center leading-tight">
                  <span className="block sm:hidden uppercase">
                    {prayer.name}
                  </span>
                  <span className="hidden sm:block uppercase">
                    {prayer.name}&nbsp;
                    {prayer.arabic}
                  </span>
                </div>
                <div className="flex gap-2 sm:gap-4 text-base sm:text-lg">
                  <div className="text-center">
                    <div className="opacity-60 text-sm font-medium">Starts</div>
                    <div className="font-semibold text-xl sm:text-4xl">
                      {formatTimeWithSmallPeriod(prayer.start)}
                    </div>
                  </div>
                  <div className="w-px bg-gray-200 opacity-60 self-stretch"></div>
                  <div className="text-center">
                    <div className="opacity-60 text-sm font-medium">Iqamah</div>
                    <div className="font-semibold text-xl sm:text-4xl">
                      {formatTimeWithSmallPeriod(prayer.iqamah)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar: Full Height - Hidden on mobile */}
      <div className="hidden lg:flex w-64 xl:w-96 bg-gradient-to-br from-theme via-theme-gradient to-theme text-white flex-col flex-shrink-0 shadow-xl relative overflow-hidden">
        {/* Background pattern with opacity */}
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: 'url("/pattern8.jpg")',
            backgroundSize: "100%",
            backgroundPosition: "center",
            mixBlendMode: "overlay",
          }}
        ></div>
        {/* Content container to ensure it appears above the background */}
        <div className="relative z-10 flex flex-col h-full w-full">
          {/* Current Time Section */}
          <div className="p-6 text-center border-b border-white/20">
            <div className="text-6xl xl:text-[5rem] font-light mb-4 xl:mb-6 tracking-tighter">
              {time}
            </div>
            <div className="text-base xl:text-lg opacity-90 font-medium">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex gap-2 items-center justify-center">
                  <span className="text-lg xl:text-4xl font-semibold uppercase">
                    {nextEvent.prayer}
                  </span>
                  &nbsp;{nextEvent.label} in&nbsp;
                </div>

                <div className="flex gap-2 items-center justify-center">
                  <span className="text-lg xl:text-4xl font-semibold uppercase">
                    {countdown.hours !== "00" && (
                      <>
                        {countdown.hours}&nbsp;
                        <span className="text-base">hr</span>&nbsp;
                      </>
                    )}
                    {countdown.minutes !== "00" && (
                      <>
                        {countdown.minutes}&nbsp;
                        <span className="text-base">min</span>&nbsp;
                      </>
                    )}
                    {countdown.seconds !== "00" && (
                      <>
                        {countdown.seconds}&nbsp;
                        <span className="text-base">sec</span>&nbsp;
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="p-5 xl:p-6 text-center border-b border-white/20">
            <div className="text-base xl:text-xl font-medium mb-1 uppercase">
              {hijriDate}
            </div>
            <div className="text-base xl:text-xl font-medium uppercase">
              {gregorianDate}
            </div>
          </div>

          {/* Jummah Times Section */}
          {jummahPrayerTimes && jummahPrayerTimes.length > 0 && (
            <div className="p-6 xl:p-8 border-b border-white/20">
              <Swiper {...SWIPER_SETTINGS}>
                {jummahPrayerTimes?.map((session, index) => (
                  <SwiperSlide key={index}>
                    <div className="bg-white/5 bg-opacity-5 rounded-xl p-6 xl:p-6 backdrop-blur-sm shadow-lg">
                      <div className="text-center font-semibold mb-4 xl:mb-6 text-lg xl:text-2xl uppercase">
                        {jummahPrayerTimes.length === 1
                          ? "Jumaah"
                          : `Jumaah ${index + 1}`}
                      </div>
                      <div className="flex gap-6 xl:gap-8 justify-center items-center">
                        <div className="text-center">
                          <div className="opacity-70 text-base xl:text-md font-medium mb-2">
                            Starts
                          </div>
                          <div className="text-3xl xl:text-4xl font-semibold">
                            {formatTimeWithSmallPeriod(session.start)}
                          </div>
                        </div>
                        <div className="w-px bg-white opacity-20 h-16 xl:h-20"></div>
                        <div className="text-center">
                          <div className="opacity-70 text-base xl:text-md font-medium mb-2">
                            Khutbah
                          </div>
                          <div className="text-3xl xl:text-4xl font-bold">
                            {formatTimeWithSmallPeriod(session.khutbah)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* Logo Section - Takes remaining space */}
          <div className="flex-1 flex flex-col p-4 xl:px-6">
            <div className="text-center mb-4 xl:mb-6">
              <div className="text-sm xl:text-base opacity-80 font-bold">
                Scan below for prayer notifications, masjid events, and
                community updates
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="w-24 h-24 xl:w-32 xl:h-32 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden p-2">
                <img
                  src={masjid?.logo || "/logo.png"}
                  alt="Masjid Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-24 h-24 xl:w-32 xl:h-32 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex items-center justify-center p-1">
                <div ref={qrRef} className="qr-code-container w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Jummah Times - Only visible on mobile if there are sessions */}
        {jummahPrayerTimes && jummahPrayerTimes.length > 0 && (
          <div className="lg:hidden bg-theme text-white p-3 flex-shrink-0">
            <h3 className="text-sm font-bold text-center mb-2">JUMU'AH</h3>
            <div className="flex gap-2 justify-center">
              {jummahPrayerTimes.map((session, index) => (
                <div
                  key={index}
                  className="bg-theme rounded p-2 text-center flex-1"
                >
                  {jummahPrayerTimes.length > 1 && (
                    <div className="text-xs font-semibold mb-1">
                      {jummahPrayerTimes.length === 1
                        ? "Jumaah"
                        : `Jumaah ${index + 1}`}
                    </div>
                  )}
                  <div className="flex justify-center gap-3">
                    <div>
                      <div className="text-xs opacity-80">Starts</div>
                      <div className="text-sm font-semibold">
                        {formatTimeWithSmallPeriod(session.start)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs opacity-80">Khutbah</div>
                      <div className="text-sm font-semibold">
                        {formatTimeWithSmallPeriod(session.khutbah)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
