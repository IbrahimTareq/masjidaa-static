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
    <div className={`text-center`}>
      <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-medium tracking-wider uppercase text-theme mb-1 lg:mb-2">
        {hijriDate}
      </div>
      <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-medium tracking-wider uppercase text-theme">
        {gregorianDate}
      </div>
    </div>
  );
};

interface TimeSectionProps {
  nextEvent: NextEvent;
  countdown: CountdownDisplay;
  isMobile?: boolean;
}

const TimeSection: React.FC<TimeSectionProps> = ({
  nextEvent,
  countdown,
  isMobile = false,
}) => {
  const config = useDateTimeConfig();

  const timeClasses = isMobile
    ? "text-4xl sm:text-5xl"
    : "text-5xl xl:text-8xl";

  const labelClasses = isMobile
    ? "text-sm sm:text-base"
    : "text-base xl:text-xl";

  const numberClasses = isMobile
    ? "text-lg sm:text-xl"
    : "text-2xl xl:text-3xl";

  return (
    <div className="text-center">
      <div className={`${timeClasses} font-light text-gray-800 mb-2 lg:mb-4`}>
        {formatCurrentTime({
          config: {
            timeZone: config.timeZone,
            is12Hour: config.is12Hour,
          },
        })}
      </div>
      <div className={`${labelClasses} font-medium text-gray-600 uppercase`}>
        {nextEvent.prayer} {nextEvent.label} in&nbsp;
        {countdown.hours !== "00" && (
          <>
            <span className={`${numberClasses} font-semibold text-gray-800`}>
              {countdown.hours}
            </span>
            <span className="text-base">HR</span>&nbsp;
          </>
        )}
        {countdown.minutes !== "00" && (
          <>
            <span className={`${numberClasses} font-semibold text-gray-800`}>
              {countdown.minutes}
            </span>
            <span className="text-base">MIN</span>&nbsp;
          </>
        )}
        <span className={`${numberClasses} font-semibold text-gray-800`}>
          {countdown.seconds}
        </span>
        <span className="text-base">SEC</span>
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
  
  // Use the custom hook to manage prayer screen logic
  const { nextEvent, countdown } = usePrayerScreen(prayerInfo);

  return (
    <div className="font-sans h-screen">
      <div className="max-w-7xl 2xl:max-w-full mx-auto h-full w-full">
        <div className="bg-white p-4 sm:p-6 xl:pb-18 shadow-2xl h-full flex flex-col">
          {/* Mobile Sidebar Content - Shows first on mobile */}
          <div className="lg:hidden mb-6 space-y-4">
            {/* Dates */}
            <DateSection
              hijriDate={hijriDate || ""}
              gregorianDate={gregorianDate || ""}
            />

            {/* Current Time */}
            <TimeSection
              nextEvent={nextEvent}
              countdown={countdown}
              isMobile
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
            {/* Prayer Times Table */}
            <div className="flex-1 lg:flex-[2] min-h-0 lg:border-r lg:border-gray-300 lg:pr-6">
              <div className="h-full flex flex-col overflow-hidden">
                {/* Table Header */}
                <div className="bg-white px-4 py-3 border-b border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="text-left">
                      <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold tracking-wider uppercase opacity-60"></span>
                    </div>
                    <div className="text-center relative">
                      <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold tracking-wider uppercase opacity-60">
                        Starts
                      </span>
                      <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>
                    </div>
                    <div className="text-center relative">
                      <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold tracking-wider uppercase opacity-60">
                        Iqamah
                      </span>
                      <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>
                    </div>
                  </div>
                </div>

                {/* Prayer Rows */}
                <div className="flex-1 flex flex-col">
                  {dailyPrayerTimes?.map((prayer) => {
                    return (
                      <div
                        key={prayer.name}
                        className={`${
                          prayer.isActive
                            ? "bg-theme text-white"
                            : "bg-white text-gray-800"
                        } px-4 py-4 sm:py-6 border-t border-gray-200 flex-1 flex items-center min-h-0`}
                      >
                        <div className="grid grid-cols-3 gap-4 items-center w-full">
                          <div className="text-left">
                            <span className="text-sm sm:text-base lg:text-xl xl:text-3xl 2xl:text-4xl font-medium tracking-wider uppercase">
                              {prayer.name}&nbsp;
                              <span className="font-serif">
                                {prayer.arabic}
                              </span>
                            </span>
                          </div>
                          <div className="text-center relative">
                            <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>
                            <span className="text-base sm:text-lg lg:text-2xl xl:text-4xl 2xl:text-6xl font-light tracking-wide">
                              {prayer.start}
                            </span>
                          </div>
                          <div className="text-center relative">
                            <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>
                            <span className="text-base sm:text-lg lg:text-2xl xl:text-4xl 2xl:text-6xl font-bold tracking-wide">
                              {prayer.iqamah}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-col lg:w-80 xl:w-[34rem] space-y-6">
              {/* Dates */}
              <DateSection
                hijriDate={hijriDate || ""}
                gregorianDate={gregorianDate || ""}
              />

              <hr className="border-gray-300" />

              {/* Current Time */}
              <TimeSection
                nextEvent={nextEvent}
                countdown={countdown}
              />

              <hr className="border-gray-300" />

              {/* Jumu'ah */}
              <div className="text-center">
                <Swiper {...SWIPER_SETTINGS}>
                  {jummahPrayerTimes &&
                    jummahPrayerTimes.map((session, index) => (
                      <SwiperSlide key={index} className="h-full">
                        <div className="flex flex-col justify-between h-full">
                          <div className="text-center">
                            <h3 className="text-xl xl:text-3xl font-bold text-gray-800 tracking-wider mb-4 uppercase">
                              {jummahPrayerTimes.length > 1
                                ? `Jumaah Session ${index + 1}`
                                : "Jumaah جمعة"}
                            </h3>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm xl:text-md font-semibold uppercase text-gray-600 tracking-wider mb-2">
                                Starts
                              </div>
                              <div className="text-xl xl:text-4xl font-light text-gray-800">
                                {session.start}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm xl:text-md font-semibold uppercase text-gray-600 tracking-wider mb-2">
                                Khutbah
                              </div>
                              <div className="text-xl xl:text-4xl font-light text-gray-800">
                                {session.khutbah}
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>

              <hr className="border-gray-300" />

              {/* Bottom Section */}
              <div className="flex-1 flex items-center justify-center">
                {/* Logo */}
                <div className="w-40 h-40 xl:w-64 xl:h-64">
                  <img
                    src={masjid?.logo || "/logo.png"}
                    alt="Masjid Logo"
                    className="w-full h-full object-contain opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Jumu'ah - Shows after prayer table on mobile */}
            <div className="lg:hidden bg-gray-50 rounded-lg p-4">
              <Swiper {...SWIPER_SETTINGS}>
                {jummahPrayerTimes &&
                  jummahPrayerTimes.map((session, index) => (
                    <SwiperSlide key={index} className="h-full">
                      <div className="flex flex-col justify-between h-full">
                        <div className="text-center">
                          <h3 className="text-lg font-bold text-gray-800 text-center mb-3">
                            {jummahPrayerTimes.length > 1
                              ? `Jumaah ${index + 1}`
                              : "Jumaah جمعة"}
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-sm font-bold uppercase text-gray-600 mb-1">
                              Starts
                            </div>
                            <div className="text-lg font-light text-gray-800">
                              {session.start}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-bold uppercase text-gray-600 mb-1">
                              Khutbah
                            </div>
                            <div className="text-lg font-light text-gray-800">
                              {session.khutbah}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>

            {/* Mobile Bottom Section */}
            <div className="lg:hidden flex items-center justify-between pt-4">
              <div className="w-24 h-24">
                <img
                  src="/logo.png"
                  alt="Masjid Logo"
                  className="w-full h-full object-contain opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
