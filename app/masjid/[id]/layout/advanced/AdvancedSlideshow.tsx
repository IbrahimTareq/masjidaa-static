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
import DimmingOverlay from "@/components/client/ui/DimmingOverlay";

// Helper function to format time with smaller AM/PM
const formatTimeWithSmallPeriod = (time: string | null) => {
  if (!time) return null;
  // Split time and AM/PM (e.g., "4:09 AM" -> ["4:09", "AM"])
  const parts = time.match(/^(.+?)\s*(AM|PM)$/i);
  if (parts) {
    return (
      <>
        {parts[1]}
        <span className="text-[0.5em] ml-0.5">{parts[2]}</span>
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
  });

  return (
    <div className="h-screen w-screen bg-white grid grid-cols-[1fr_224px] lg:grid-cols-[1fr_256px] xl:grid-cols-[1fr_288px] 2xl:grid-cols-[1fr_320px] 3xl:grid-cols-[1fr_384px] overflow-hidden relative">
      <DimmingOverlay
        isDimmed={isDimmed}
        opacity={opacity}
        remainingPercent={remainingPercent}
      />

      {/* Left Column: Slideshow + Prayer Bar */}
      <div className="flex flex-col min-w-0 overflow-hidden">
        {/* Slideshow Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="w-full h-full">
            <Slideshow slides={slides} />
          </div>
        </div>

        {/* Prayer Times Bar - Only in Left Column */}
        <div className="h-24 lg:h-28 xl:h-32 2xl:h-36 3xl:h-40 bg-white border-t border-gray-200 flex-shrink-0 shadow-lg">
          <div className="h-full flex">
            {dailyPrayerTimes?.map((prayer, index) => (
              <div
                key={prayer.name}
                className={`flex-1 flex flex-col justify-center items-center px-1 lg:px-2 xl:px-3 2xl:px-4 3xl:px-6 relative ${
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
                <div className="font-bold text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl mb-1 text-center leading-tight uppercase">
                  {prayer.name}&nbsp;{prayer.arabic}
                </div>
                <div className="flex gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 3xl:gap-6 text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl">
                  <div className="text-center">
                    <div className="opacity-60 text-xs lg:text-sm xl:text-base 2xl:text-lg 3xl:text-xl font-medium">
                      Starts
                    </div>
                    <div className="font-semibold text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl">
                      {formatTimeWithSmallPeriod(prayer.start)}
                    </div>
                  </div>
                  <div className="w-px bg-gray-200 opacity-60 self-stretch"></div>
                  <div className="text-center">
                    <div className="opacity-60 text-xs lg:text-sm xl:text-base 2xl:text-lg 3xl:text-xl font-medium">
                      Iqamah
                    </div>
                    <div className="font-semibold text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl">
                      {formatTimeWithSmallPeriod(prayer.iqamah)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Full-Height Sidebar */}
      <div className="bg-gradient-to-br from-theme via-theme-gradient to-theme text-white flex flex-col shadow-xl relative overflow-hidden">
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
          {/* Logo Section */}
          <div className="flex-1 flex flex-col justify-center items-center py-3 lg:py-4 xl:py-5 px-4 lg:px-6 xl:px-8">
          <div className="w-24 h-24 xl:w-32 xl:h-32 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden p-2">
                <img
                  src={masjid?.logo || "/logo.png"}
                  alt="Masjid Logo"
                  className="w-full h-full object-contain"
                />
              </div>
          </div>

          {/* Current Time Section */}
          <div className="flex-1 flex flex-col justify-center py-3 lg:py-4 xl:py-5 px-4 lg:px-6 xl:px-8 text-center">
            <div className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-bold mb-2 lg:mb-3 xl:mb-4 tracking-tight leading-none">
              {formatTimeWithSmallPeriod(time)}
            </div>
            <div className="text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl opacity-95 font-semibold">
              <div className="flex flex-col items-center justify-center text-center gap-1 lg:gap-2">
                <div className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl font-bold uppercase leading-tight">
                  {nextEvent.prayer} {nextEvent.label}
                </div>

                <div className="flex flex-wrap justify-center items-center gap-1 lg:gap-2 leading-tight">
                  {countdown.hours !== "00" && (
                    <span className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl font-semibold">
                      {countdown.hours}
                      <span className="text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl opacity-90 font-semibold">
                        h
                      </span>
                    </span>
                  )}
                  {countdown.minutes !== "00" && (
                    <span className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl font-semibold">
                      {countdown.minutes}
                      <span className="text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl opacity-90 font-semibold">
                        m
                      </span>
                    </span>
                  )}
                  {countdown.seconds !== "00" && (
                    <span className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl font-semibold">
                      {countdown.seconds}
                      <span className="text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl opacity-90 font-semibold">
                        s
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="flex-1 flex flex-col justify-center py-3 lg:py-4 xl:py-5 px-4 lg:px-6 xl:px-8 text-center">
            <div className="text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-bold mb-2 lg:mb-3 xl:mb-4 uppercase leading-tight">
              {hijriDate}
            </div>
            <div className="text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-bold uppercase leading-tight">
              {gregorianDate}
            </div>
          </div>

          {/* Jummah Times Section */}
          {jummahPrayerTimes && jummahPrayerTimes.length > 0 ? (
            <div className="flex-1 flex flex-col justify-center py-3 lg:py-4 xl:py-5 px-4 lg:px-6 xl:px-8">
              <div className="h-auto max-h-full overflow-hidden">
                <Swiper {...SWIPER_SETTINGS} style={{ height: "auto" }}>
                  {jummahPrayerTimes?.map((session, index) => (
                    <SwiperSlide key={index}>
                      <div className="text-center bg-white/10 rounded-xl p-2 lg:p-3 xl:p-4 backdrop-blur-sm">
                        <div className="font-semibold mb-2 lg:mb-3 xl:mb-4 text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl uppercase">
                          {jummahPrayerTimes.length === 1
                            ? "Jumaah"
                            : `Jumaah ${index + 1}`}
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 xl:gap-4">
                          <div className="text-center">
                            <div className="text-xs md:text-sm xl:text-base 2xl:text-lg font-bold mb-2 opacity-90">
                              Starts
                            </div>
                            <div className="text-lg md:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl font-semibold">
                              {formatTimeWithSmallPeriod(session.start)}
                            </div>
                          </div>

                          <div className="w-8 h-px md:w-px md:h-8 bg-white opacity-40"></div>

                          <div className="text-center">
                            <div className="text-xs md:text-sm xl:text-base 2xl:text-lg font-bold mb-2 opacity-90">
                              Khutbah
                            </div>
                            <div className="text-lg md:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl font-semibold">
                              {formatTimeWithSmallPeriod(session.khutbah)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ) : (
            <div className="flex-1"></div>
          )}
        </div>
      </div>
    </div>
  );
}
