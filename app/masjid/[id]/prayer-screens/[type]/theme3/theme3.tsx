"use client";

import { useDateTimeConfig } from "@/context/dateTimeContext";
import { useMasjidContext } from "@/context/masjidContext";
import { usePrayerScreen, NextEvent } from "@/hooks/usePrayerScreen";
import { formatCurrentTime } from "@/lib/server/formatters/dateTime";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { CountdownDisplay } from "@/utils/prayer";

import { SWIPER_SETTINGS } from "@/utils/shared/constants";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

// Helper function to format time with smaller AM/PM
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

interface DateSectionProps {
  className?: string;
  hijriDate: string;
  gregorianDate: string;
}

const DateSection: React.FC<DateSectionProps> = ({
  hijriDate,
  gregorianDate,
}) => {
  return (
    <div className="text-center">
      <div className="text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold mb-2 lg:mb-3 uppercase leading-tight">
        {hijriDate}
      </div>
      <div className="text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold uppercase leading-tight">
        {gregorianDate}
      </div>
    </div>
  );
};

interface TimeSectionProps {
  nextEvent: NextEvent;
  countdown: CountdownDisplay;
  hijriDate: string;
  gregorianDate: string;
}

const TimeSection: React.FC<TimeSectionProps> = ({ nextEvent, countdown, hijriDate, gregorianDate }) => {
  const config = useDateTimeConfig();

  return (
    <div className="text-center">
      <div className="text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-light mb-8 lg:mb-12 tracking-tight leading-none">
        {formatTimeWithSmallPeriod(
          formatCurrentTime({
            config: {
              timeZone: config.timeZone,
              is12Hour: config.is12Hour,
            },
          })
        )}
      </div>
      <div className="text-base lg:text-lg xl:text-2xl 2xl:text-3xl font-medium uppercase opacity-95 mb-8 lg:mb-12">
        <div className="flex flex-col items-center justify-center text-center gap-2 lg:gap-3">
          <div className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold uppercase leading-tight">
            {nextEvent.prayer} {nextEvent.label}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 lg:gap-3 leading-tight">
            {countdown.hours !== "00" && (
              <span className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
                {countdown.hours}
                <span className="text-base lg:text-lg xl:text-xl opacity-90 font-semibold">
                  h
                </span>
              </span>
            )}
            {countdown.minutes !== "00" && (
              <span className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
                {countdown.minutes}
                <span className="text-base lg:text-lg xl:text-xl opacity-90 font-semibold">
                  m
                </span>
              </span>
            )}
            {countdown.seconds !== "00" && (
              <span className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
                {countdown.seconds}
                <span className="text-base lg:text-lg xl:text-xl opacity-90 font-semibold">
                  s
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dates positioned below countdown */}
      <div className="text-center">
        <div className="text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold mb-2 lg:mb-3 uppercase leading-tight">
          {hijriDate}
        </div>
        <div className="text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold uppercase leading-tight">
          {gregorianDate}
        </div>
      </div>
    </div>
  );
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
  const config = useDateTimeConfig();

  // Use the custom hook to manage prayer screen logic
  const { nextEvent, countdown } = usePrayerScreen(prayerInfo);

  return (
    <div className="font-sans h-screen w-screen overflow-hidden flex flex-row">
      {/* Left Content - Prayer Times Table */}
      <div className="flex-1 bg-white flex flex-col rounded-4xl">
        {/* Prayer Times Table */}
        <div className="flex-1 min-h-0 p-6 xl:p-8">
          <div className="h-full flex flex-col overflow-hidden">
            {/* Table Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="text-left">
                  <span className="text-lg xl:text-2xl 2xl:text-3xl font-bold tracking-wider uppercase text-gray-600"></span>
                </div>
                <div className="text-center relative">
                  <span className="text-lg xl:text-2xl 2xl:text-3xl font-bold tracking-wider uppercase text-gray-600">
                    Starts
                  </span>
                  <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>
                </div>
                <div className="text-center relative">
                  <span className="text-lg xl:text-2xl 2xl:text-3xl font-bold tracking-wider uppercase text-gray-600">
                    Iqamah
                  </span>
                  <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>
                </div>
              </div>
            </div>

            {/* Prayer Rows */}
            <div className="flex-1 flex flex-col justify-center gap-2">
              {dailyPrayerTimes?.map((prayer) => {
                return (
                  <div
                    key={prayer.name}
                    className={`${
                      prayer.isActive
                        ? "bg-theme text-white"
                        : "bg-white text-gray-800"
                    } px-6 py-4 xl:py-6 flex items-center min-h-0 rounded-xl`}
                  >
                    <div className="grid grid-cols-3 gap-6 items-center w-full">
                      <div className="text-left">
                        <div className="flex flex-col xl:flex-row xl:items-baseline xl:gap-3">
                          <span className="text-2xl xl:text-4xl 2xl:text-5xl font-medium tracking-wider uppercase leading-tight">
                            {prayer.name}
                          </span>
                          <span className="text-xl xl:text-3xl 2xl:text-4xl font-serif font-bold opacity-90">
                            {prayer.arabic}
                          </span>
                        </div>
                      </div>
                      <div className="text-center relative">
                        <div className="absolute left-0 top-0 h-full w-px bg-gray-300 opacity-30"></div>
                        <span className="text-3xl xl:text-5xl 2xl:text-7xl font-light tracking-wide tabular-nums">
                          {formatTimeWithSmallPeriod(prayer.start)}
                        </span>
                      </div>
                      <div className="text-center relative">
                        <div className="absolute left-0 top-0 h-full w-px bg-gray-300 opacity-30"></div>
                        <span className="text-3xl xl:text-5xl 2xl:text-7xl font-bold tracking-wide tabular-nums">
                          {formatTimeWithSmallPeriod(prayer.iqamah)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="flex flex-col w-80 lg:w-96 xl:w-[28rem] 2xl:w-[32rem] bg-gradient-to-br from-theme via-theme-gradient to-theme text-white relative overflow-hidden rounded-4xl">
        {/* Background pattern with opacity */}
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: 'url("/pattern8.jpg")',
            backgroundSize: "100%",
            backgroundPosition: "center",
            mixBlendMode: "overlay",
          }}
        />

        {/* Content container to ensure it appears above the background */}
        <div className="relative z-10 flex flex-col h-full w-full py-3 lg:py-4 xl:py-6">
          {/* Logo Section - Optimized size */}
          <div className="flex flex-col justify-center items-center py-3 lg:py-4 px-4 lg:px-6 xl:px-8 flex-shrink-0">
            <div className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden p-2">
              <img
                src={masjid?.logo || "/logo.png"}
                alt="Masjid Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Current Time Section with Dates - Primary focus */}
          <div className="flex-[5] flex flex-col justify-center py-2 lg:py-3 xl:py-4 px-4 lg:px-6 xl:px-8 text-center min-h-0">
            <TimeSection
              nextEvent={nextEvent}
              countdown={countdown}
              hijriDate={hijriDate || ""}
              gregorianDate={gregorianDate || ""}
            />
          </div>

          {/* Jummah Times Section - Moved to bottom */}
          {jummahPrayerTimes && jummahPrayerTimes.length > 0 && (
            <div className="flex-[3] flex flex-col justify-center px-4 lg:px-6 xl:px-8 py-2 lg:py-3 min-h-0">
              <div className="w-full">
                <Swiper {...SWIPER_SETTINGS} style={{ height: "auto" }}>
                  {jummahPrayerTimes?.map((session, index) => (
                    <SwiperSlide key={index}>
                      <div className="text-center bg-white/15 rounded-xl lg:rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg">
                        {/* Card Header */}
                        <div className="px-3 lg:px-4 xl:px-5 pt-3 lg:pt-4 pb-2 lg:pb-3 border-b border-white/20">
                          <div className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold uppercase tracking-wider">
                            {jummahPrayerTimes.length === 1
                              ? "Jumu'ah"
                              : `Jumu'ah ${index + 1}`}
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="px-3 lg:px-4 xl:px-5 py-3 lg:py-4">
                          <div className="grid grid-cols-2 gap-4 lg:gap-6">
                            <div className="text-center">
                              <div className="text-sm lg:text-base xl:text-lg font-semibold mb-1 lg:mb-2 opacity-80 uppercase tracking-wide">
                                Starts
                              </div>
                              <div className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold">
                                {formatTimeWithSmallPeriod(session.start)}
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-sm lg:text-base xl:text-lg font-semibold mb-1 lg:mb-2 opacity-80 uppercase tracking-wide">
                                Khutbah
                              </div>
                              <div className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold">
                                {formatTimeWithSmallPeriod(session.khutbah)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
