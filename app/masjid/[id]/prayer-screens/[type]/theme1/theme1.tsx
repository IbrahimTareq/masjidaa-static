"use client";

import LayoutWithHeader from "@/components/LayoutWithHeader";
import { useDateTimeConfig } from "@/context/dateTimeContext";
import { useMasjidContext } from "@/context/masjidContext";
import { useCountdown } from "@/hooks/useCountdown";
import { formatCurrentTime } from "@/lib/server/formatters/dateTime";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { useEffect } from "react";

import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function PrayerClient({
  formattedData,
}: {
  formattedData: FormattedData;
}) {
  const { dailyPrayerTimes, shurq, jummahPrayerTimes, prayerInfo } =
    formattedData;
  const masjid = useMasjidContext();
  const config = useDateTimeConfig();

  // Use the countdown hook with auto-refresh when it reaches zero
  const countdown = useCountdown(prayerInfo?.timeUntilNext);

  // Auto-refresh when countdown reaches zero
  useEffect(() => {
    if (
      countdown.hours === "00" &&
      countdown.minutes === "00" &&
      countdown.seconds === "00"
    ) {
      console.log("Countdown reached zero, refreshing page");
      const timer = setTimeout(() => {
        window.location.reload();
      }, 1000); // Wait 1 second before refreshing

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <LayoutWithHeader headerTitle={masjid?.name || "Masjid"}>
      <div className="h-full flex flex-col">
        {/* Container with rounded background */}
        <div className="bg-white rounded-2xl sm:rounded-3xl flex-1 flex flex-col overflow-hidden">
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-10 min-h-0 mt-4 sm:mt-0">
            {/* Clock Section */}
            <section className="text-center space-y-3 sm:space-y-4 lg:space-y-6">
              {/* Main Clock */}
              <div className="flex items-baseline justify-center gap-2 sm:gap-4">
                <span className="text-main-time text-6xl sm:text-8xl lg:text-9xl xl:text-[10rem] font-medium text-black tabular-nums leading-none">
                  {formatCurrentTime({
                    config: {
                      timeZone: config.timeZone,
                      is12Hour: config.is12Hour,
                    },
                  })}
                </span>
              </div>

              {/* Next Prayer Info */}
              <div className="space-y-2 sm:space-y-3">
                <div className="text-sm sm:text-base lg:text-xl xl:text-2xl text-gray-400 font-medium uppercase tracking-wider">
                  Next Prayer Starts In
                </div>
                <div className="text-3xl sm:text-4xl lg:text-6xl xl:text-6xl font-semibold text-black">
                  {countdown.hours !== "00" && (
                    <>
                      {countdown.hours}
                      <span className="text-lg sm:text-xl lg:text-2xl font-normal text-gray-600">
                        HR
                      </span>
                      &nbsp;
                    </>
                  )}
                  {countdown.minutes !== "00" && (
                    <>
                      {countdown.minutes}
                      <span className="text-lg sm:text-xl lg:text-2xl font-normal text-gray-600">
                        MINS
                      </span>
                      &nbsp;
                    </>
                  )}
                  {countdown.seconds}
                  <span className="text-lg sm:text-xl lg:text-2xl font-normal text-gray-600">
                    SEC
                  </span>
                </div>
              </div>
            </section>

            {/* Content Cards Section */}
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 mt-auto flex-shrink-0">
              {/* Jumaah Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 xl:p-4 order-2 lg:order-1 lg:col-span-1 flex flex-col">
                <div className="flex-1">
                  <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                    }}
                    navigation={false}
                    modules={[Autoplay]}
                    className="mySwiper"
                  >
                    {jummahPrayerTimes?.map((session, index) => (
                      <SwiperSlide key={index}>
                        <div className="flex flex-col justify-between space-y-10">
                          <div className="text-center">
                            <h2 className="text-sm sm:text-base lg:text-lg xl:text-2xl font-bold">
                              {jummahPrayerTimes.length > 1
                                ? `Jumaah Session ${index + 1} `
                                : "Jumaah جمعة"}
                            </h2>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <div className="text-xs lg:text-sm xl:text-xs font-medium uppercase tracking-wider opacity-70">
                                Starts
                              </div>
                              <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold">
                                {session.start}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs lg:text-sm xl:text-xs font-medium uppercase tracking-wider opacity-70">
                                Khutbah
                              </div>
                              <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold">
                                {session.khutbah}
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>

              {/* Sunrise/Duha Card */}
              <div className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 order-1 lg:order-2 lg:col-span-1 lg:col-start-5">
                <div className="w-full h-full">
                  <div className="text-center p-2 sm:p-3 lg:p-4 rounded-lg transition-all bg-gray-50 border border-gray-200 text-gray-900 shadow-sm hover:shadow-md h-full">
                    <div className="h-full flex flex-col">
                      <div className="mb-3">
                        <h3 className="text-sm sm:text-base lg:text-lg xl:text-2xl font-bold">
                          Shurq شروق
                        </h3>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-3">
                        {/* Sunrise Time */}
                        <div>
                          <div className="text-xs lg:text-sm xl:text-xs font-medium uppercase tracking-wider opacity-70">
                            Sunrise
                          </div>
                          <div className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold">
                            {shurq?.sunrise || "--:--"}
                          </div>
                        </div>

                        {/* Duha Time */}
                        <div>
                          <div className="text-xs lg:text-sm xl:text-xs font-medium uppercase tracking-wider opacity-70">
                            Duha
                          </div>
                          <div className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold">
                            {shurq?.duha || "--:--"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Prayer Cards Grid */}
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-auto">
              {dailyPrayerTimes?.map((prayer, index) => (
                <div
                  key={index}
                  className={`
                    rounded-xl p-3 sm:p-4 lg:p-4 xl:p-3 text-center space-y-2 sm:space-y-3 transition-all duration-200
                    ${
                      prayer?.isActive
                        ? "bg-theme text-white"
                        : "bg-gray-200 text-gray-800"
                    }
                  `}
                >
                  <h3 className="text-sm sm:text-base lg:text-lg xl:text-2xl font-bold">
                    {prayer.name}&nbsp;
                    <span className="font-serif">{prayer.arabic}</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <div className="text-xs lg:text-sm xl:text-xs font-medium uppercase tracking-wider opacity-70">
                        Starts
                      </div>
                      <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold">
                        {prayer.start}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs lg:text-sm xl:text-xs font-medium uppercase tracking-wider opacity-70">
                        Iqamah
                      </div>
                      <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold">
                        {prayer.iqamah}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </main>
        </div>
      </div>
    </LayoutWithHeader>
  );
}
