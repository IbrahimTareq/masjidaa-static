"use client";

import { useDateTimeConfig } from "@/context/dateTimeContext";
import { useMasjidContext } from "@/context/masjidContext";
import { useCountdown } from "@/hooks/useCountdown";
import { formatCurrentTime } from "@/lib/server/formatters/dateTime";
import { FormattedData } from "@/lib/server/services/prayer";

import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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
    hijriDate,
    gregorianDate,
  } = formattedData;
  const masjid = useMasjidContext();
  const config = useDateTimeConfig();

  const countdown = useCountdown(timeUntilNext);

  return (
    <div className="font-sans h-screen">
      <div className="max-w-7xl 2xl:max-w-full mx-auto h-full w-full">
        {/* Mobile Layout */}
        <div className="lg:hidden bg-white rounded-2xl sm:rounded-3xl h-full flex flex-col overflow-hidden shadow-2xl">
          {/* Mobile Header - Sidebar Content */}
          <div className="bg-theme-gradient text-white p-4 sm:p-6 relative overflow-hidden">
            {/* Masjid Background Image - Hidden on mobile */}
            <div
              className="hidden absolute bottom-0 right-0 w-full h-full opacity-20"
              style={{
                backgroundImage: `url('/masjid-bg.png')`,
                backgroundSize: "contain",
                backgroundPosition: "bottom right -40px",
                backgroundRepeat: "no-repeat",
              }}
            ></div>

            {/* Mobile Header Content */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              {/* Dates */}
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-sm sm:text-base font-medium opacity-90">
                    {hijriDate}
                  </div>
                  <div className="text-sm sm:text-base font-medium opacity-90">
                    {gregorianDate}
                  </div>
                </div>
              </div>

              {/* Current Time */}
              <div className="text-center sm:text-right">
                <div className="text-4xl sm:text-5xl md:text-6xl font-semibold tabular-nums">
                  {formatCurrentTime({
                    config: {
                      timeZone: config.timeZone,
                      is12Hour: config.is12Hour,
                    },
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Main Content */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col overflow-y-auto">
            {/* Countdown Section */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
                {/* Countdown Header */}
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-4 sm:mb-6">
                    <span className="font-bold text-theme uppercase">
                      {nextPrayer}
                    </span>
                    &nbsp;will begin in
                  </h2>

                  {/* Mobile Countdown Cards */}
                  <div className="flex justify-center items-center gap-2 sm:gap-4">
                    <div className="text-center">
                      <div className="bg-white rounded-xl shadow-lg px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 min-w-[70px] sm:min-w-[90px] md:min-w-[110px] border border-gray-200">
                        <div className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 tabular-nums">
                          {countdown.hours}
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium mt-2">
                        Hours
                      </div>
                    </div>

                    <div className="text-xl sm:text-2xl md:text-3xl text-gray-400 font-light">
                      :
                    </div>

                    <div className="text-center">
                      <div className="bg-white rounded-xl shadow-lg px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 min-w-[70px] sm:min-w-[90px] md:min-w-[110px] border border-gray-200">
                        <div className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 tabular-nums">
                          {countdown.minutes}
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium mt-2">
                        Minutes
                      </div>
                    </div>

                    <div className="text-xl sm:text-2xl md:text-3xl text-gray-400 font-light">
                      :
                    </div>

                    <div className="text-center">
                      <div className="bg-white rounded-xl shadow-lg px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 min-w-[70px] sm:min-w-[90px] md:min-w-[110px] border border-gray-200">
                        <div className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 tabular-nums">
                          {countdown.seconds}
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium mt-2">
                        Seconds
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Decorative Divider */}
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <div className="border-t border-gray-300 flex-1 max-w-md"></div>
              <div className="px-4">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border border-gray-300 rotate-45 bg-gray-100"></div>
              </div>
              <div className="border-t border-gray-300 flex-1 max-w-md"></div>
            </div>

            {/* Mobile Prayer Cards Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {prayerTimes?.map((prayer, index) => {
                  return (
                    <div
                      key={index}
                      className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 hover:shadow-md transition-all duration-300"
                    >
                      {/* Prayer Name */}
                      <div className="text-center mb-4 sm:mb-5">
                        <div className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 mb-2">
                          {prayer.name}
                        </div>
                      </div>

                      {/* Time Details */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                        <div>
                          <div className="text-xs sm:text-sm text-gray-500 font-medium mb-1 sm:mb-2 uppercase">
                            Starts
                          </div>
                          <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 tabular-nums">
                            {prayer.starts}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm text-gray-500 font-medium mb-1 sm:mb-2 uppercase">
                            Iqamah
                          </div>
                          <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tabular-nums">
                            {prayer.iqamah}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Mobile Jummah Card */}
                <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 hover:shadow-md transition-all duration-300 sm:col-span-2">
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
                    {jummahTimes?.map((session, index) => (
                      <SwiperSlide key={index}>
                        {/* Prayer Name */}
                        <div className="text-center mb-4 sm:mb-5">
                          <div className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 mb-2">
                            {jummahTimes?.length === 1
                              ? "Jumaah"
                              : `Jumaah ${index + 1}`}
                          </div>
                        </div>

                        {/* Time Details */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                          <div>
                            <div className="text-xs sm:text-sm text-gray-500 font-medium mb-1 sm:mb-2 uppercase">
                              Starts
                            </div>
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 tabular-nums">
                              {session.starts}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm text-gray-500 font-medium mb-1 sm:mb-2 uppercase">
                              Khutbah
                            </div>
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tabular-nums">
                              {session.khutbah}
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
        </div>

        {/* Desktop Layout - Enhanced for better responsiveness */}
        <div className="hidden lg:flex bg-white h-full overflow-hidden shadow-2xl">
          {/* Left Sidebar - Responsive width */}
          <div className="w-80 xl:w-96 bg-theme-gradient text-white p-4 xl:p-6 flex flex-col relative overflow-hidden">
            {/* Masjid Background Image */}
            <div
              className="absolute bottom-0 left-0 w-full h-full opacity-20"
              style={{
                backgroundImage: `url('/masjid-bg.png')`,
                backgroundSize: "contain",
                backgroundPosition: "bottom left -80px",
                backgroundRepeat: "no-repeat",
              }}
            ></div>

            {/* Centered Content - Dates and Time */}
            <div className="relative z-10 flex flex-col justify-start items-center pt-6 xl:pt-8">
              <div className="text-center space-y-4 xl:space-y-6">
                <div className="w-16 h-16 xl:w-32 xl:h-32 bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden mx-auto p-2">
                  <img
                    src={masjid?.logo || "/logo.png"}
                    alt="Masjid Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Dates Section */}
                <div className="space-y-2 xl:space-y-3">
                  <div className="text-base xl:text-lg font-medium opacity-90">
                    {hijriDate}
                  </div>
                  <div className="text-base xl:text-lg font-medium opacity-90">
                    {gregorianDate}
                  </div>
                </div>

                {/* Current Time Display */}
                <div className="text-center">
                  <div className="text-6xl xl:text-6xl font-semibold tabular-nums">
                    {formatCurrentTime({
                      config: {
                        timeZone: config.timeZone,
                        is12Hour: config.is12Hour,
                      },
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Content - Responsive padding */}
          <div className="flex-1 p-4 xl:p-6 2xl:p-8 flex flex-col">
            {/* Countdown Section */}
            <div className="mb-6 xl:mb-8">
              {/* Countdown Timeline */}
              <div className="bg-white rounded-2xl p-6 xl:p-8 2xl:p-0 2xl:pt-10">
                {/* Countdown Header */}
                <div className="text-center mb-6 xl:mb-8">
                  <h2 className="text-2xl xl:text-3xl 2xl:text-4xl font-light text-gray-900 mb-4 xl:mb-6">
                    <span className="font-bold text-theme uppercase">
                      {nextPrayer}
                    </span>
                    &nbsp;will begin in
                  </h2>

                  {/* Countdown Cards */}
                  <div className="flex justify-center items-center gap-3 xl:gap-4 2xl:gap-6">
                    <div className="text-center">
                      <div className="bg-white rounded-2xl shadow-lg px-4 py-4 xl:px-6 xl:py-6 2xl:px-8 2xl:py-8 min-w-[100px] xl:min-w-[120px] 2xl:min-w-[140px] border border-gray-200">
                        <div className="text-3xl xl:text-5xl 2xl:text-6xl font-light text-gray-900 tabular-nums">
                          {countdown.hours}
                        </div>
                      </div>
                      <div className="text-xs xl:text-sm 2xl:text-base text-gray-500 font-medium mt-2 xl:mt-3">
                        Hours
                      </div>
                    </div>

                    <div className="text-3xl xl:text-4xl 2xl:text-5xl text-gray-400 font-light">
                      :
                    </div>

                    <div className="text-center">
                      <div className="bg-white rounded-2xl shadow-lg px-4 py-4 xl:px-6 xl:py-6 2xl:px-8 2xl:py-8 min-w-[100px] xl:min-w-[120px] 2xl:min-w-[140px] border border-gray-200">
                        <div className="text-3xl xl:text-5xl 2xl:text-6xl font-light text-gray-900 tabular-nums">
                          {countdown.minutes}
                        </div>
                      </div>
                      <div className="text-xs xl:text-sm 2xl:text-base text-gray-500 font-medium mt-2 xl:mt-3">
                        Minutes
                      </div>
                    </div>

                    <div className="text-3xl xl:text-4xl 2xl:text-5xl text-gray-400 font-light">
                      :
                    </div>

                    <div className="text-center">
                      <div className="bg-white rounded-2xl shadow-lg px-4 py-4 xl:px-6 xl:py-6 2xl:px-8 2xl:py-8 min-w-[100px] xl:min-w-[120px] 2xl:min-w-[140px] border border-gray-200">
                        <div className="text-3xl xl:text-5xl 2xl:text-6xl font-light text-gray-900 tabular-nums">
                          {countdown.seconds}
                        </div>
                      </div>
                      <div className="text-xs xl:text-sm 2xl:text-base text-gray-500 font-medium mt-2 xl:mt-3">
                        Seconds
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center mb-6 xl:mb-8">
              <div className="border-t border-gray-300 flex-1 max-w-md"></div>
              <div className="px-4">
                <div className="w-4 h-4 border border-gray-300 rotate-45 bg-gray-100"></div>
              </div>
              <div className="border-t border-gray-300 flex-1 max-w-md"></div>
            </div>

            {/* Prayer Cards Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3 xl:gap-6">
                {prayerTimes?.map((prayer, index) => {
                  return (
                    <div
                      key={index}
                      className={`
                      rounded-2xl p-4 xl:p-6 border border-gray-200
                      ${
                        prayer.isActive
                          ? "bg-theme text-white"
                          : "bg-gray-100 text-gray-800"
                      }
                    `}
                    >
                      {/* Prayer Name */}
                      <div className="text-center mb-4 xl:mb-6">
                        <div className="text-2xl xl:text-3xl 2xl:text-4xl font-medium mb-2 xl:mb-3">
                          {prayer.name} {prayer.arabic}
                        </div>
                      </div>

                      {/* Time Details */}
                      <div className="grid grid-cols-2 gap-3 xl:gap-4 text-center">
                        <div>
                          <div className="text-xs xl:text-sm font-medium mb-1 xl:mb-2 uppercase">
                            Starts
                          </div>
                          <div className="text-2xl xl:text-3xl 2xl:text-4xl font-semibold tabular-nums">
                            {prayer.starts}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs xl:text-sm font-medium mb-1 xl:mb-2 uppercase">
                            Iqamah
                          </div>
                          <div className="text-2xl xl:text-3xl 2xl:text-4xl font-semibold tabular-nums">
                            {prayer.iqamah}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Jummah Card - Now part of the grid */}
                <div className="bg-gray-100 rounded-2xl p-4 xl:p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
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
                    {" "}
                    {jummahTimes?.map((session, index) => (
                      <SwiperSlide key={index}>
                        {/* Prayer Name */}
                        <div className="text-center mb-4 xl:mb-6">
                          <div className="text-2xl xl:text-3xl 2xl:text-4xl font-medium text-gray-900 mb-2 xl:mb-3">
                            {jummahTimes?.length === 1
                              ? "Jumaah"
                              : `Jumaah ${index + 1}`}
                          </div>
                        </div>

                        {/* Time Details */}
                        <div className="grid grid-cols-2 gap-3 xl:gap-4 text-center">
                          <div>
                            <div className="text-xs xl:text-sm text-gray-500 font-medium mb-1 xl:mb-2 uppercase">
                              Starts
                            </div>
                            <div className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-700 tabular-nums">
                              {session.starts}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs xl:text-sm text-gray-500 font-medium mb-1 xl:mb-2 uppercase">
                              Khutbah
                            </div>
                            <div className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 tabular-nums">
                              {session.khutbah}
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
        </div>
      </div>
    </div>
  );
}
