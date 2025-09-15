"use client";

import { PrayerIcon } from "@/components/client/ui/PrayerIcon";
import { useMasjidContext } from "@/context/masjidContext";
import { FormattedData } from "@/lib/server/services/prayer";
import { calculateCountdown, getTimeUntilNextInSeconds } from "@/utils/prayer";
import { BRAND_NAME, DOMAIN_NAME } from "@/utils/shared/constants";
import { useEffect, useState } from "react";

export default function Theme5({
  formattedData,
}: {
  formattedData: FormattedData;
}) {
  const {
    dailyPrayerTimes,
    jummahPrayerTimes,
    lastUpdated,
    prayerInfo,
    hijriDate,
    gregorianDate,
  } = formattedData;
  const masjid = useMasjidContext();

  const [secondsLeft, setSecondsLeft] = useState(() =>
    getTimeUntilNextInSeconds(
      prayerInfo?.timeUntilNext || { hours: 0, minutes: 0, seconds: 0 }
    )
  );

  useEffect(() => {
    if (prayerInfo?.timeUntilNext) {
      setSecondsLeft(getTimeUntilNextInSeconds(prayerInfo?.timeUntilNext));
    }
  }, [prayerInfo?.timeUntilNext]);

  useEffect(() => {
    if (!prayerInfo?.timeUntilNext || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerInfo?.timeUntilNext, secondsLeft]);

  const countdown = calculateCountdown(secondsLeft);

  return (
    <div className="bg-gradient-to-br from-theme via-theme-gradient to-theme text-white p-4 sm:p-6 lg:p-8 font-montserrat">
      {/* Two Column Layout */}
      <div className="grid grid-cols-12 gap-6 lg:gap-12 h-full">
        {/* Left Side - Countdown */}
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-center items-center space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 lg:border-r lg:border-white lg:border-opacity-30 lg:pr-8">
          {/* Date and Location */}
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-wider uppercase mb-1">
              {hijriDate}
            </div>
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium tracking-wider uppercase text-gray-100">
              {gregorianDate}
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8">
            <div className="text-center">
              <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white">
                {countdown.hours}
              </div>
              <div className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                HRS
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white">
                {countdown.minutes}
              </div>
              <div className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                MIN
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white">
                {countdown.seconds}
              </div>
              <div className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                SEC
              </div>
            </div>
          </div>

          {/* Next Prayer Info */}
          <div className="text-center">
            <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium tracking-wider uppercase mb-2">
              Until&nbsp;
              <span className="font-bold uppercase">
                {prayerInfo?.next.name}
              </span>{" "}
              at&nbsp;
              {prayerInfo?.next.time}
            </div>
            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-medium tracking-wider uppercase text-gray-100">
              Current time:&nbsp;
              {prayerInfo?.current.time}
            </div>
          </div>
        </div>

        {/* Right Side - Main Content Container */}
        <div className="col-span-12 lg:col-span-8 flex flex-col space-y-6 lg:space-y-8">
          {/* Title and Prayer Table Side by Side */}
          <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-10 xl:gap-12 flex-1">
            {/* Left Section - Title */}
            <div className="col-span-12 md:col-span-12 lg:col-span-5 flex flex-col justify-center space-y-4 lg:space-y-6 mb-6 md:mb-8 lg:mb-0">
              {/* Main Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl 2xl:text-7xl font-serif font-extralight leading-18 text-center lg:text-left">
                PRAYER TIMES FOR {masjid?.name?.toUpperCase()}
              </h1>
            </div>

            {/* Right Section - Prayer Times Table */}
            <div className="col-span-12 md:col-span-12 lg:col-span-7 lg:pl-4 xl:pl-6">
              {/* Table Container with border and background */}
              <div className="bg-white/5 bg-opacity-5 rounded-lg overflow-hidden">
                {/* Prayer Times Header */}
                <div className="bg-white/10 px-2 sm:px-4 py-2 sm:py-3">
                  <div className="grid grid-cols-12 gap-1 sm:gap-2">
                    <div className="col-span-1"></div>
                    <div className="col-span-5"></div>
                    <div className="col-span-3 text-center">
                      <div className="text-xs font-bold tracking-wider uppercase text-white opacity-80">
                        STARTS
                      </div>
                    </div>
                    <div className="col-span-3 text-center">
                      <div className="text-xs font-bold tracking-wider uppercase text-white opacity-80">
                        IQAMAH
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prayer Rows with dividers */}
                <div>
                  {dailyPrayerTimes?.map((prayer) => (
                    <div
                      key={prayer.name}
                      className={`grid grid-cols-12 gap-1 sm:gap-2 items-center px-2 sm:px-4 py-3 sm:py-4 transition-all ${
                        prayer.isActive
                          ? `bg-white text-theme`
                          : "bg-transparent text-white"
                      }`}
                    >
                      {/* Prayer Icon */}
                      <div className="col-span-1 flex justify-center">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8">
                          <PrayerIcon
                            type={prayer.icon}
                            className="w-full h-full"
                          />
                        </div>
                      </div>

                      {/* Prayer Name */}
                      <div className="col-span-5">
                        <div className="text-xs sm:text-sm md:text-base font-medium tracking-wider uppercase">
                          {prayer.name}
                        </div>
                      </div>

                      {/* Athan Time */}
                      <div className="col-span-3 text-center relative">
                        <div className="absolute left-0 top-0 h-full w-px bg-teal-700 opacity-20"></div>
                        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-light tracking-wide">
                          {prayer.start}
                        </div>
                      </div>

                      {/* Iqamah Time */}
                      <div className="col-span-3 text-center relative">
                        <div className="absolute left-0 top-0 h-full w-px bg-teal-700 opacity-20"></div>
                        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold tracking-wide">
                          {prayer.iqamah}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Jummah Header */}
                  {jummahPrayerTimes && jummahPrayerTimes.length > 0 && (
                    <div className="bg-white/10 px-2 sm:px-4 py-2 sm:py-3">
                      <div className="grid grid-cols-12 gap-1 sm:gap-2">
                        <div className="col-span-1"></div>
                        <div className="col-span-5"></div>
                        <div className="col-span-3 text-center">
                          <div className="text-xs font-bold tracking-wider uppercase text-white opacity-80">
                            Starts
                          </div>
                        </div>
                        <div className="col-span-3 text-center">
                          <div className="text-xs font-bold tracking-wider uppercase text-white opacity-80">
                            Khutbah
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Jummah Row(s) */}
                  {jummahPrayerTimes &&
                    jummahPrayerTimes.length > 0 &&
                    jummahPrayerTimes.map((session, index) => (
                      <div
                        key={index}
                        className={`grid grid-cols-12 gap-1 sm:gap-2 items-center px-2 sm:px-4 py-3 sm:py-4 transition-all bg-transparent`}
                      >
                        {/* Prayer Icon */}
                        <div className="col-span-1 flex justify-center">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8">
                            <PrayerIcon
                              type="calendar"
                              className="w-full h-full text-white"
                            />
                          </div>
                        </div>

                        {/* Prayer Name */}
                        <div className="col-span-5">
                          <div className="text-xs sm:text-sm md:text-base font-medium tracking-wider uppercase text-white">
                            {jummahPrayerTimes.length === 1
                              ? "Jumaah"
                              : `Jumaah ${index + 1}`}
                          </div>
                        </div>

                        {/* Khutbah Time */}
                        <div className="col-span-3 text-center relative">
                          <div className="absolute left-0 top-0 h-full w-px bg-teal-700 opacity-20"></div>
                          <div className="text-xs sm:text-sm md:text-base lg:text-lg font-light tracking-wide text-white">
                            {session.start}
                          </div>
                        </div>

                        {/* Iqamah Time */}
                        <div className="col-span-3 text-center relative">
                          <div className="absolute left-0 top-0 h-full w-px bg-teal-700 opacity-20"></div>
                          <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold tracking-wide text-white">
                            {session.khutbah}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 lg:mt-8 pt-4 border-t border-white border-opacity-30">
        <div className="flex items-center justify-between text-xs text-gray-100">
          <div className="flex items-center">
            <span>Powered by </span>
            <a
              href={`${DOMAIN_NAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold ml-1 text-white"
            >
              {BRAND_NAME}
            </a>
          </div>
          {lastUpdated && <span className="text-white">{lastUpdated}</span>}
        </div>
      </div>
    </div>
  );
}
