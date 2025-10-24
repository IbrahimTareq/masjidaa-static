"use client";

import LayoutWithHeader from "@/components/LayoutWithHeader";
import { useMasjidContext } from "@/context/masjidContext";
import { useCountdown } from "@/hooks/useCountdown";
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

  const label = prayerInfo?.timeUntilNext.label || "starts";

  const countdown = useCountdown(prayerInfo?.timeUntilNext);

  return (
    <LayoutWithHeader headerTitle={masjid?.name || "Masjid"}>
      {/* Main Content - Flexible height */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 min-h-0">
        {/* Countdown Section - Takes more space but fits within container */}
        <div className="flex-[2] flex flex-col justify-center text-center min-h-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-light mb-2 sm:mb-4 lg:mb-6 text-gray-900">
            <span className="font-bold text-theme-gradient uppercase">
              {prayerInfo?.next.name}
            </span>
            &nbsp;{label} in
          </h2>

          <div className="flex justify-center items-center gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center">
              <div className="bg-theme-accent border border-theme-accent rounded-lg px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 xl:px-8 xl:py-6 min-w-[80px] sm:min-w-[100px] lg:min-w-[120px] shadow-sm">
                <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-light text-theme-gradient">
                  {countdown.hours}
                </div>
              </div>
              <div className="text-sm sm:text-base lg:text-lg mt-2 sm:mt-3 text-gray-600 font-medium">
                Hours
              </div>
            </div>

            <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-400">
              :
            </div>

            <div className="text-center">
              <div className="bg-theme-accent border border-theme-accent rounded-lg px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 xl:px-8 xl:py-6 min-w-[80px] sm:min-w-[100px] lg:min-w-[120px] shadow-sm">
                <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-light text-theme-gradient">
                  {countdown.minutes}
                </div>
              </div>
              <div className="text-sm sm:text-base lg:text-lg mt-2 sm:mt-3 text-gray-600 font-medium">
                Minutes
              </div>
            </div>

            <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-400">
              :
            </div>

            <div className="text-center">
              <div className="bg-theme-accent border border-theme-accent rounded-lg px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 xl:px-8 xl:py-6 min-w-[80px] sm:min-w-[100px] lg:min-w-[120px] shadow-sm">
                <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-light text-theme-gradient">
                  {countdown.seconds}
                </div>
              </div>
              <div className="text-sm sm:text-base lg:text-lg mt-2 sm:mt-3 text-gray-600 font-medium">
                Seconds
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Border - Minimal space */}
        <div className="flex items-center justify-center py-0 sm:py-2 mb-2 flex-shrink-0">
          <div className="border-t border-gray-300 flex-1 max-w-lg"></div>
          <div className="px-3">
            <div className="w-4 h-4 sm:w-6 sm:h-6 border border-gray-300 rotate-45 bg-gray-100"></div>
          </div>
          <div className="border-t border-gray-300 flex-1 max-w-lg"></div>
        </div>

        {/* Prayer Times Grid - Takes remaining space and fits within container */}
        <div className="flex-[3] min-h-0 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 lg:gap-5 h-full p-1 sm:p-2 max-w-6xl mx-auto">
            {dailyPrayerTimes?.map((prayer) => {
              return (
                <div
                  key={prayer.name}
                  className={`text-center p-2 sm:p-3 lg:p-4 rounded-lg transition-all h-full ${
                    prayer.isActive
                      ? "bg-theme text-white shadow-xl border-2 border-theme-gradient"
                      : "bg-gray-50 border border-gray-200 text-gray-900 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="h-full flex flex-col">
                    <div className="mb-3">
                      <h3 className="text-sm sm:text-base lg:text-lg font-medium uppercase tracking-wide">
                        {prayer.name}&nbsp;
                        <span className="font-serif">{prayer.arabic}</span>
                      </h3>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3">
                      {/* Adhan Time */}
                      <div className="text-left">
                        <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold leading-none">
                          {prayer?.start}
                        </div>
                        <div className="text-sm sm:text-base lg:text-lg font-medium mt-2 uppercase">
                          Starts
                        </div>
                      </div>

                      {/* Iqamah Time */}
                      {prayer?.iqamah && (
                        <div className="text-right">
                          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold leading-none">
                            {prayer.iqamah}
                          </div>
                          <div className="text-sm sm:text-base lg:text-lg font-medium mt-2 uppercase">
                            Iqamah
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Jummah Card */}
            <div className="text-center p-2 sm:p-3 lg:p-4 rounded-lg transition-all bg-gray-50 border border-gray-200 text-gray-900 shadow-sm hover:shadow-md h-full">
              <Swiper {...SWIPER_SETTINGS}>
                {jummahPrayerTimes?.map((session, index) => (
                  <SwiperSlide key={index} className="h-full">
                    <div className="h-full flex flex-col">
                      <div className="mb-3">
                        <h3 className="text-sm sm:text-base lg:text-lg font-medium uppercase tracking-wide">
                          {jummahPrayerTimes?.length === 1
                            ? "Jumaah جمعة"
                            : `Jumaah ${index + 1}`}
                        </h3>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-3">
                        {/* Starts Time */}
                        <div className="text-left">
                          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold leading-none">
                            {session.start}
                          </div>
                          <div className="text-sm sm:text-base lg:text-lg font-medium mt-2 uppercase text-gray-600">
                            Starts
                          </div>
                        </div>

                        {/* Khutbah Time */}
                        <div className="text-right">
                          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold leading-none">
                            {session.khutbah}
                          </div>
                          <div className="text-sm sm:text-base lg:text-lg font-medium mt-2 uppercase text-gray-600">
                            Khutbah
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
