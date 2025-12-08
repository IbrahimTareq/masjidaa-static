"use client";

import LayoutWithHeader from "@/components/LayoutWithHeader";
import { useMasjidContext } from "@/context/masjidContext";
import { usePrayerScreen } from "@/hooks/usePrayerScreen";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";

import { SWIPER_SETTINGS } from "@/utils/shared/constants";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

export default function PrayerClient({
  formattedData,
}: {
  formattedData: FormattedData;
}) {
  const { dailyPrayerTimes, jummahPrayerTimes, prayerInfo } = formattedData;
  const masjid = useMasjidContext();

  // Use the custom hook to manage prayer screen logic
  const { nextEvent, countdown } = usePrayerScreen(prayerInfo);

  return (
    <LayoutWithHeader headerTitle={masjid?.name || "Masjid"}>
      {/* Main Content Container */}
      <div className="flex-1 flex flex-col px-2 sm:px-3 lg:px-4 xl:px-6 min-h-0 py-2 sm:py-3 lg:py-4">
        {/* Countdown Section */}
        <div className="flex-shrink-0 flex flex-col justify-center text-center mb-2 sm:mb-3 lg:mb-4 xl:mb-6">
          <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-light mb-2 sm:mb-3 lg:mb-4 text-gray-800 leading-tight px-2">
            <span className="font-bold text-theme-gradient uppercase tracking-wide">
              {nextEvent.prayer}
            </span>
            &nbsp;{nextEvent.label} in
          </h2>

          <div className="flex justify-center items-center gap-1.5 sm:gap-2 lg:gap-3 xl:gap-4">
            <div className="text-center flex-1 max-w-[90px] sm:max-w-[110px] lg:max-w-[130px]">
              <div className="bg-gradient-to-br from-theme-accent to-white border border-theme-accent lg:border-2 rounded-lg lg:rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 xl:px-6 xl:py-4 shadow-lg">
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-theme-gradient tabular-nums leading-tight">
                  {countdown.hours}
                </div>
              </div>
              <div className="text-[10px] sm:text-xs lg:text-sm xl:text-base mt-1 sm:mt-1.5 lg:mt-2 text-gray-700 font-semibold uppercase tracking-wide">
                Hours
              </div>
            </div>

            <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-400 pb-3 sm:pb-4 lg:pb-5">
              :
            </div>

            <div className="text-center flex-1 max-w-[90px] sm:max-w-[110px] lg:max-w-[130px]">
              <div className="bg-gradient-to-br from-theme-accent to-white border border-theme-accent lg:border-2 rounded-lg lg:rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 xl:px-6 xl:py-4 shadow-lg">
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-theme-gradient tabular-nums leading-tight">
                  {countdown.minutes}
                </div>
              </div>
              <div className="text-[10px] sm:text-xs lg:text-sm xl:text-base mt-1 sm:mt-1.5 lg:mt-2 text-gray-700 font-semibold uppercase tracking-wide">
                Minutes
              </div>
            </div>

            <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-400 pb-3 sm:pb-4 lg:pb-5">
              :
            </div>

            <div className="text-center flex-1 max-w-[90px] sm:max-w-[110px] lg:max-w-[130px]">
              <div className="bg-gradient-to-br from-theme-accent to-white border border-theme-accent lg:border-2 rounded-lg lg:rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 xl:px-6 xl:py-4 shadow-lg">
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-theme-gradient tabular-nums leading-tight">
                  {countdown.seconds}
                </div>
              </div>
              <div className="text-[10px] sm:text-xs lg:text-sm xl:text-base mt-1 sm:mt-1.5 lg:mt-2 text-gray-700 font-semibold uppercase tracking-wide">
                Seconds
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center py-1 sm:py-1.5 lg:py-2 mb-2 sm:mb-3 lg:mb-4 flex-shrink-0">
          <div className="border-t border-gray-300 lg:border-t-2 flex-1 max-w-2xl"></div>
          <div className="px-2 sm:px-3 lg:px-4">
            <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 border border-theme-accent lg:border-2 rotate-45 bg-gradient-to-br from-theme-accent to-white shadow-sm"></div>
          </div>
          <div className="border-t border-gray-300 lg:border-t-2 flex-1 max-w-2xl"></div>
        </div>

        {/* Prayer Times Grid - Responsive with container queries */}
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 h-full max-w-7xl mx-auto content-start">
            {dailyPrayerTimes?.map((prayer) => {
              return (
                <div
                  key={prayer.name}
                  className={`rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 overflow-hidden min-h-[140px] sm:min-h-[160px] lg:min-h-[180px] ${
                    prayer.isActive
                      ? "bg-gradient-to-br from-theme to-theme-gradient text-white shadow-2xl ring-2 lg:ring-4 ring-theme-accent ring-opacity-50 scale-[1.02] lg:scale-105"
                      : "bg-white border border-gray-200 lg:border-2 text-gray-900 shadow-md hover:shadow-xl"
                  }`}
                >
                  <div className="h-full flex flex-col p-2 sm:p-3 lg:p-4 xl:p-5">
                    {/* Prayer Name */}
                    <div className="flex-shrink-0 pb-2 sm:pb-3 border-b border-current border-opacity-20 lg:border-b-2">
                      <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold uppercase tracking-wide lg:tracking-wider leading-tight">
                        {prayer.name}
                      </h3>
                      <p className={`text-xs sm:text-sm lg:text-base xl:text-lg font-serif mt-0.5 sm:mt-1 leading-tight ${prayer.isActive ? 'opacity-90' : 'text-gray-600'}`}>
                        {prayer.arabic}
                      </p>
                    </div>

                    {/* Times Section */}
                    <div className="flex-1 flex items-end pt-2 sm:pt-3">
                      <div className="w-full flex justify-between items-center gap-2 sm:gap-3 lg:gap-4">
                        {/* Start Time */}
                        <div className="flex-1 text-left min-w-0">
                          <div className={`text-[10px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wide mb-0.5 sm:mb-1 leading-tight ${prayer.isActive ? 'opacity-80' : 'text-gray-500'}`}>
                            Starts
                          </div>
                          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold tabular-nums leading-tight">
                            {prayer?.start}
                          </div>
                        </div>

                        {/* Vertical Divider */}
                        {prayer?.iqamah && (
                          <div className={`w-px h-8 sm:h-10 lg:h-12 flex-shrink-0 ${prayer.isActive ? 'bg-white bg-opacity-30' : 'bg-gray-300'}`}></div>
                        )}

                        {/* Iqamah Time */}
                        {prayer?.iqamah && (
                          <div className="flex-1 text-right min-w-0">
                            <div className={`text-[10px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wide mb-0.5 sm:mb-1 leading-tight ${prayer.isActive ? 'opacity-80' : 'text-gray-500'}`}>
                              Iqamah
                            </div>
                            <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold tabular-nums leading-tight">
                              {prayer.iqamah}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Jummah Card */}
            <div className="rounded-lg sm:rounded-xl lg:rounded-2xl bg-white border border-gray-200 lg:border-2 text-gray-900 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden min-h-[140px] sm:min-h-[160px] lg:min-h-[180px]">
              <Swiper {...SWIPER_SETTINGS}>
                {jummahPrayerTimes?.map((session, index) => (
                  <SwiperSlide key={index} className="h-full">
                    <div className="h-full flex flex-col p-2 sm:p-3 lg:p-4 xl:p-5">
                      {/* Jummah Title */}
                      <div className="flex-shrink-0 pb-2 sm:pb-3 border-b border-gray-200 lg:border-b-2">
                        <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold uppercase tracking-wide lg:tracking-wider text-theme-gradient leading-tight">
                          {jummahPrayerTimes?.length === 1
                            ? "Jumu'ah"
                            : `Jumu'ah ${index + 1}`}
                        </h3>
                        <p className="text-xs sm:text-sm lg:text-base xl:text-lg font-serif mt-0.5 sm:mt-1 text-gray-600 leading-tight">
                          جمعة
                        </p>
                      </div>

                      {/* Times Section */}
                      <div className="flex-1 flex items-end pt-2 sm:pt-3">
                        <div className="w-full flex justify-between items-center gap-2 sm:gap-3 lg:gap-4">
                          {/* Start Time */}
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-[10px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wide mb-0.5 sm:mb-1 text-gray-500 leading-tight">
                              Starts
                            </div>
                            <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold tabular-nums leading-tight">
                              {session.start}
                            </div>
                          </div>

                          {/* Vertical Divider */}
                          <div className="w-px h-8 sm:h-10 lg:h-12 bg-gray-300 flex-shrink-0"></div>

                          {/* Khutbah Time */}
                          <div className="flex-1 text-right min-w-0">
                            <div className="text-[10px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wide mb-0.5 sm:mb-1 text-gray-500 leading-tight">
                              Khutbah
                            </div>
                            <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold tabular-nums leading-tight">
                              {session.khutbah}
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
        </div>
      </div>
    </LayoutWithHeader>
  );
}
