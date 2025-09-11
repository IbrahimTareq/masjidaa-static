"use client";

import { PrayerIcon } from "@/components/client/ui/PrayerIcon";
import { useDateTimeConfig } from "@/context/dateTimeContext";
import { useMasjidContext } from "@/context/masjidContext";
import { useCountdown } from "@/hooks/useCountdown";
import {
  formatCurrentTime,
  formatTime,
} from "@/lib/server/formatters/dateTime";
import { FormattedData } from "@/lib/server/services/prayer";

export default function PrayerClient({
  formattedData,
}: {
  formattedData: FormattedData;
}) {
  const {
    prayerTimes,
    jummahTimes,
    timeUntilNext,
    nextPrayer,
    nextPrayerTime,
    hijriDate,
    gregorianDate,
  } = formattedData;
  const masjid = useMasjidContext();
  const config = useDateTimeConfig();

  const countdown = useCountdown(timeUntilNext);

  return (
    <div className="font-sans h-screen">
      <div className="max-w-7xl 2xl:max-w-full mx-auto h-full w-full">
        <div className="bg-white text-gray-900 font-sans h-full flex flex-col shadow-2xl">
          {/* Two Column Layout */}
          <div className="grid grid-cols-12 gap-6 lg:gap-12 h-full p-6 sm:p-8 md:p-10 items-center">
            {/* Left Side - Countdown */}
            <div className="col-span-12 lg:col-span-5 flex flex-col justify-center items-center space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
              {/* Masjid Logo */}
              {masjid?.logo && (
                <div className="w-24 sm:w-32 md:w-40 lg:w-48">
                  <img
                    src={masjid?.logo || "/logo.png"}
                    alt="Masjid Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Date and Location */}
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-wider uppercase mb-1 text-gray-800">
                  {hijriDate}
                </div>
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium tracking-wider uppercase text-theme-gradient">
                  {gregorianDate}
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8">
                <div className="text-center">
                  <div className="bg-theme-accent border border-theme-accent rounded-lg px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
                    <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-theme-gradient">
                      {countdown.hours}
                    </div>
                  </div>
                  <div className="text-theme-gradient text-xs sm:text-sm md:text-base lg:text-lg font-semibold mt-2">
                    HRS
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-theme-accent border border-theme-accent rounded-lg px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
                    <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-theme-gradient">
                      {countdown.minutes}
                    </div>
                  </div>
                  <div className="text-theme-gradient text-xs sm:text-sm md:text-base lg:text-lg font-semibold mt-2">
                    MIN
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-theme-accent border border-theme-accent rounded-lg px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
                    <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-theme-gradient">
                      {countdown.seconds}
                    </div>
                  </div>
                  <div className="text-theme-gradient text-xs sm:text-sm md:text-base lg:text-lg font-semibold mt-2">
                    SEC
                  </div>
                </div>
              </div>

              {/* Next Prayer Info */}
              <div className="text-center">
                <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-3xl font-medium tracking-wider uppercase mb-2 text-gray-800">
                  Until{" "}
                  <span className="font-bold text-theme-gradient">
                    {nextPrayer}
                  </span>{" "}
                  at&nbsp;
                  {formatTime({
                    timeString: nextPrayerTime || "",
                    config: {
                      timeZone: config.timeZone,
                      is12Hour: config.is12Hour,
                    },
                  })}
                </div>
                <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-2xl font-medium tracking-wider uppercase text-theme-gradient">
                  Current time:&nbsp;
                  {formatCurrentTime({
                    config: {
                      timeZone: config.timeZone,
                      is12Hour: config.is12Hour,
                    },
                  })}
                </div>
              </div>
            </div>

            {/* Right Side - Main Content Container */}
            <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
              {/* Prayer Times Table */}
              <div className="flex flex-col">
                <div className="bg-gray-50 rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  {/* Prayer Times Header */}
                  <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-1"></div>
                      <div className="col-span-5"></div>
                      <div className="col-span-3 text-center">
                        <div className="text-sm sm:text-base font-bold tracking-wider uppercase text-gray-600">
                          STARTS
                        </div>
                      </div>
                      <div className="col-span-3 text-center">
                        <div className="text-sm sm:text-base font-bold tracking-wider uppercase text-gray-600">
                          IQAMAH
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prayer Rows */}
                  <div className="divide-y divide-gray-200">
                    {prayerTimes?.map((prayer) => (
                      <div
                        key={prayer.name}
                        className={`grid grid-cols-12 gap-2 items-center px-6 py-4 transition-all ${
                          prayer.isActive
                            ? "bg-theme text-white"
                            : ""
                        }`}
                      >
                        {/* Prayer Icon */}
                        <div className="col-span-1 flex justify-center">
                          <div className="w-8 h-8 sm:w-9 sm:h-9">
                            <PrayerIcon
                              type={prayer.icon}
                              className={`w-full h-full ${
                                prayer.isActive ? "text-white" : "text-gray-600"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Prayer Name */}
                        <div className="col-span-5">
                          <div className="text-base sm:text-lg lg:text-xl font-medium tracking-wider uppercase">
                            {prayer.name}
                          </div>
                        </div>

                        {/* Athan Time */}
                        <div className="col-span-3 text-center">
                          <div className="text-lg sm:text-2xl lg:text-3xl font-light">
                            {prayer.starts}
                          </div>
                        </div>

                        {/* Iqamah Time */}
                        <div className="col-span-3 text-center">
                          <div className="text-lg sm:text-2xl lg:text-3xl font-semibold">
                            {prayer.iqamah}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Jummah Section */}
                    {jummahTimes && jummahTimes.length > 0 && (
                      <>
                        {/* Jummah Header */}
                        <div className="bg-gray-100 px-6 py-4">
                          <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-1"></div>
                            <div className="col-span-5"></div>
                            <div className="col-span-3 text-center">
                              <div className="text-sm sm:text-base font-bold tracking-wider uppercase text-gray-600">
                                Starts
                              </div>
                            </div>
                            <div className="col-span-3 text-center">
                              <div className="text-sm sm:text-base font-bold tracking-wider uppercase text-gray-600">
                                Khutbah
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Jummah Rows */}
                        {jummahTimes.map((session, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-2 items-center px-6 py-4"
                          >
                            <div className="col-span-1 flex justify-center">
                              <div className="w-8 h-8 sm:w-9 sm:h-9">
                                <PrayerIcon
                                  type="calendar"
                                  className="w-full h-full text-gray-600"
                                />
                              </div>
                            </div>

                            <div className="col-span-5">
                              <div className="text-base sm:text-lg lg:text-xl font-medium tracking-wider uppercase">
                                {jummahTimes.length === 1
                                  ? "Jumaah"
                                  : `Jumaah ${index + 1}`}
                              </div>
                            </div>

                            <div className="col-span-3 text-center">
                              <div className="text-lg sm:text-2xl lg:text-3xl font-light">
                                {session.start}
                              </div>
                            </div>

                            <div className="col-span-3 text-center">
                              <div className="text-lg sm:text-2xl lg:text-3xl font-semibold">
                                {session.khutbah}
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
