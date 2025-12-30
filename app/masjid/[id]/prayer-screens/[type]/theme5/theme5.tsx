"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import { usePrayerScreen } from "@/hooks/usePrayerScreen";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";

import { SWIPER_SETTINGS } from "@/utils/shared/constants";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

// Helper function to format time with smaller AM/PM like in AdvancedSlideshow
const formatTimeWithSmallPeriod = (time: string | null) => {
  if (!time) return null;
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

export default function PrayerClient({
  formattedData,
}: {
  formattedData: FormattedData;
}) {
  const {
    dailyPrayerTimes,
    jummahPrayerTimes,
    prayerInfo,
    hijriDate,
    gregorianDate,
  } = formattedData;
  const masjid = useMasjidContext();
  const { formatCurrentTime } = useDateTimeFormat();

  // Use the custom hook to manage prayer screen logic
  const { nextEvent, countdown } = usePrayerScreen(prayerInfo);

  const time = formatCurrentTime();

  return (
    <div className="font-montserrat h-screen w-screen bg-white grid grid-cols-[1fr_288px] lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_352px] 2xl:grid-cols-[1fr_384px] 3xl:grid-cols-[1fr_416px] overflow-hidden shadow-2xl">
      {/* Left Content Area */}
      <div className="flex flex-col min-w-0 overflow-hidden bg-gray-50">
        {/* Countdown Section */}
        <div className="flex-shrink-0 bg-white shadow-sm border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 xl:py-6">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-900 mb-2 md:mb-3 lg:mb-4 xl:mb-6">
              <span className="font-bold text-theme uppercase">
                {nextEvent.prayer}
              </span>
              &nbsp;{nextEvent.label} in
            </h2>

            {/* Countdown Display */}
            <div className="flex justify-center items-center gap-2 md:gap-3 lg:gap-4 xl:gap-6">
              {/* Hours */}
              <div className="text-center flex-1 max-w-[100px] md:max-w-[120px] lg:max-w-[140px]">
                <div className="bg-white shadow-lg border border-gray-200 rounded-xl md:rounded-2xl px-2 py-3 md:px-3 md:py-4 lg:px-4 lg:py-6 xl:px-6 xl:py-8">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-semibold text-gray-900 tabular-nums leading-none">
                    {countdown.hours}
                  </div>
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg text-gray-500 font-medium mt-1 md:mt-2 lg:mt-3">
                  Hours
                </div>
              </div>

              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-400 font-light self-start pt-3 md:pt-4 lg:pt-6 xl:pt-8">
                :
              </div>

              {/* Minutes */}
              <div className="text-center flex-1 max-w-[100px] md:max-w-[120px] lg:max-w-[140px]">
                <div className="bg-white shadow-lg border border-gray-200 rounded-xl md:rounded-2xl px-2 py-3 md:px-3 md:py-4 lg:px-4 lg:py-6 xl:px-6 xl:py-8">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-semibold text-gray-900 tabular-nums leading-none">
                    {countdown.minutes}
                  </div>
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg text-gray-500 font-medium mt-1 md:mt-2 lg:mt-3">
                  Minutes
                </div>
              </div>

              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-400 font-light self-start pt-3 md:pt-4 lg:pt-6 xl:pt-8">
                :
              </div>

              {/* Seconds */}
              <div className="text-center flex-1 max-w-[100px] md:max-w-[120px] lg:max-w-[140px]">
                <div className="bg-white shadow-lg border border-gray-200 rounded-xl md:rounded-2xl px-2 py-3 md:px-3 md:py-4 lg:px-4 lg:py-6 xl:px-6 xl:py-8">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-semibold text-gray-900 tabular-nums leading-none">
                    {countdown.seconds}
                  </div>
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg text-gray-500 font-medium mt-1 md:mt-2 lg:mt-3">
                  Seconds
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prayer Cards Grid */}
        <div className="flex-1 flex items-center overflow-auto px-3 md:px-4 lg:px-6 xl:px-8">
          <div className="grid grid-cols-3 gap-2 md:gap-3 lg:gap-4 xl:gap-5 max-w-7xl mx-auto w-full py-3 md:py-4 lg:py-5">
            {dailyPrayerTimes?.map((prayer, index) => (
              <div
                key={index}
                className={`rounded-xl md:rounded-2xl border-2 p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7 transition-all duration-200 ${
                  prayer.isActive
                    ? "bg-theme text-white border-theme shadow-lg"
                    : "bg-white text-gray-800 border-gray-200 hover:shadow-md"
                }`}
              >
                <div className="text-center mb-3 md:mb-4 lg:mb-5">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold mb-1 md:mb-1.5">
                    {prayer.name} {prayer.arabic}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-5 text-center">
                  <div>
                    <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold uppercase tracking-wide opacity-80 mb-1.5 md:mb-2">
                      Starts
                    </div>
                    <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold tabular-nums leading-none">
                      {formatTimeWithSmallPeriod(prayer.start)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold uppercase tracking-wide opacity-80 mb-1.5 md:mb-2">
                      Iqamah
                    </div>
                    <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold tabular-nums leading-none">
                      {formatTimeWithSmallPeriod(prayer.iqamah)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Jummah Card */}
            {jummahPrayerTimes && jummahPrayerTimes.length > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7 hover:shadow-md transition-all duration-300">
                <Swiper {...SWIPER_SETTINGS}>
                  {jummahPrayerTimes?.map((session, index) => (
                    <SwiperSlide key={index}>
                      <div className="text-center mb-3 md:mb-4 lg:mb-5">
                        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-1 md:mb-1.5">
                          {jummahPrayerTimes?.length === 1
                            ? "Jumaah جمعة"
                            : `Jumaah ${index + 1}`}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-5 text-center">
                        <div>
                          <div className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-semibold uppercase tracking-wide mb-1.5 md:mb-2">
                            Starts
                          </div>
                          <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-700 tabular-nums leading-none">
                            {formatTimeWithSmallPeriod(session.start)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-semibold uppercase tracking-wide mb-1.5 md:mb-2">
                            Khutbah
                          </div>
                          <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 tabular-nums leading-none">
                            {formatTimeWithSmallPeriod(session.khutbah)}
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="bg-gradient-to-br from-theme via-theme-gradient to-theme text-white flex flex-col shadow-xl relative overflow-hidden">
        {/* Background pattern with opacity */}
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url('/masjid-bg.png')`,
            backgroundSize: "contain",
            backgroundPosition: "bottom left -80px",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Content container */}
        <div className="relative z-10 flex flex-col h-full w-full justify-start pt-8 md:pt-10 lg:pt-12 xl:pt-14">
          {/* Logo Section */}
          <div className="flex flex-col items-center px-6 lg:px-8 xl:px-10 mb-8 md:mb-10 lg:mb-12">
            <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 2xl:w-40 2xl:h-40 bg-white rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden p-2.5 lg:p-3">
              <img
                src={masjid?.logo || "/logo.png"}
                alt="Masjid Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Current Time Section */}
          <div className="flex flex-col items-center px-6 lg:px-8 xl:px-10 text-center mb-8 md:mb-10 lg:mb-12">
            <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tight leading-none">
              {formatTimeWithSmallPeriod(time)}
            </div>
          </div>

          {/* Dates Section */}
          <div className="flex flex-col items-center px-6 lg:px-8 xl:px-10 text-center">
            <div className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-3 md:mb-4 uppercase leading-tight opacity-95">
              {hijriDate}
            </div>
            <div className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold uppercase leading-tight opacity-95">
              {gregorianDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
