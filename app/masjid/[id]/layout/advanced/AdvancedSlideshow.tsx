"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import { FormattedData } from "@/lib/server/services/prayer";
import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import Slideshow, { Slide } from "@/components/client/interactive/Slideshow";
import { Autoplay } from "swiper/modules";

export default function AdvancedSlideshow({
  formattedData,
  slides,
}: {
  formattedData: FormattedData;
  slides: Slide[];
}) {
  const {
    prayerTimes,
    jummahTimes,
    nextPrayer,
    hijriDate,
    gregorianDate,
    timeUntilNext,
  } = formattedData;

  const masjid = useMasjidContext();

  const { formatCurrentTime } = useDateTimeFormat();

  const time = formatCurrentTime();

  return (
    <div className="h-screen w-screen bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Top Bar - Only visible on mobile */}
      <div className="lg:hidden bg-theme text-white p-3 flex justify-between items-center flex-shrink-0">
        <div className="text-center">
          <div className="text-lg font-light">{time}</div>
          <div className="text-xs opacity-90">
            Next prayer begins in {timeUntilNext?.hours}hr{" "}
            {timeUntilNext?.minutes}min
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium uppercase">{hijriDate}</div>
          <div className="text-sm font-medium uppercase">{gregorianDate}</div>
        </div>
        <div className="w-12 h-12 bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden">
          <img
            src={masjid?.logo || "/logo.png"}
            alt="Masjid Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Left Section: Content + Bottom Bar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Content Area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <Slideshow slides={slides} />
        </div>

        {/* Bottom Prayer Times Bar */}
        <div className="h-16 sm:h-32 bg-white border-t border-gray-200 flex-shrink-0 shadow-lg">
          <div className="h-full flex">
            {prayerTimes?.map((prayer, index) => (
              <div
                key={prayer.name}
                className={`flex-1 flex flex-col justify-center items-center px-1 sm:px-2 relative ${
                  prayer.isActive
                    ? "bg-theme-accent font-bold text-theme-gradient border-t-4 border-theme"
                    : "bg-white text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                } ${
                  index !== prayerTimes?.length - 1 &&
                  !prayer.isActive &&
                  !prayerTimes?.[index + 1]?.isActive
                    ? "border-r border-gray-100"
                    : ""
                }`}
              >
                <div className="font-semibold text-lg sm:text-xl mb-1 text-center leading-tight">
                  <span className="block sm:hidden uppercase">
                    {prayer.name}
                  </span>
                  <span className="hidden sm:block uppercase">
                    {prayer.name}&nbsp;
                    {prayer.arabic}
                  </span>
                </div>
                <div className="flex gap-2 sm:gap-4 text-base sm:text-lg">
                  <div className="text-center">
                    <div className="opacity-60 text-sm font-medium">Starts</div>
                    <div className="font-semibold text-xl sm:text-2xl">
                      {prayer.starts}
                    </div>
                  </div>
                  <div className="w-px bg-gray-200 opacity-60 self-stretch"></div>
                  <div className="text-center">
                    <div className="opacity-60 text-sm font-medium">Iqamah</div>
                    <div className="font-semibold text-xl sm:text-2xl">
                      {prayer.iqamah}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar: Full Height - Hidden on mobile */}
      <div className="hidden lg:flex w-64 xl:w-96 bg-gradient-to-br from-theme via-theme-gradient to-theme text-white flex-col flex-shrink-0 shadow-xl relative overflow-hidden">
        {/* Background pattern with opacity */}
        <div 
          className="absolute inset-0 z-0 opacity-10" 
          style={{ 
            backgroundImage: 'url("/pattern8.jpg")', 
            backgroundSize: '100%',
            backgroundPosition: 'center',
            mixBlendMode: 'overlay'
          }}
        ></div>
        {/* Content container to ensure it appears above the background */}
        <div className="relative z-10 flex flex-col h-full w-full">
        {/* Current Time Section */}
        <div className="p-8 xl:p-10 text-center border-b border-white/20">
          <div className="text-6xl xl:text-[4rem] font-light mb-4 xl:mb-6 tracking-tighter">
            {time}
          </div>
          <div className="text-base xl:text-lg opacity-90 font-medium">
            <span className="font-bold uppercase">{nextPrayer}</span> begins in{" "}
            {timeUntilNext?.hours}hr&nbsp;
            {timeUntilNext?.minutes}min
          </div>
        </div>

        {/* Dates Section */}
        <div className="p-6 xl:p-8 text-center border-b border-white/20">
          <div className="text-base xl:text-lg font-medium mb-1 uppercase">
            {hijriDate}
          </div>
          <div className="text-base xl:text-lg font-medium uppercase">
            {gregorianDate}
          </div>
        </div>

        {/* Jummah Times Section */}
        <div className="p-6 xl:p-8 border-b border-white/20">
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
                <div className="bg-white/5 bg-opacity-5 rounded-xl p-6 xl:p-6 backdrop-blur-sm shadow-lg">
                  <div className="text-center font-semibold mb-4 xl:mb-6 text-lg xl:text-2xl uppercase">
                    {jummahTimes.length === 1
                      ? "Jumaah"
                      : `Jumaah ${index + 1}`}
                  </div>
                  <div className="flex gap-6 xl:gap-8 justify-center items-center">
                    <div className="text-center">
                      <div className="opacity-70 text-base xl:text-md font-medium mb-2">
                        Starts
                      </div>
                      <div className="text-3xl xl:text-4xl font-semibold">
                        {session.starts}
                      </div>
                    </div>
                    <div className="w-px bg-white opacity-20 h-16 xl:h-20"></div>
                    <div className="text-center">
                      <div className="opacity-70 text-base xl:text-md font-medium mb-2">
                        Khutbah
                      </div>
                      <div className="text-3xl xl:text-4xl font-bold">
                        {session.khutbah}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Logo Section - Takes remaining space */}
        <div className="flex-1 flex flex-col justify-end p-6 xl:p-8">
          <div className="text-center mb-4 xl:mb-6">
            <div className="text-sm xl:text-base opacity-80 font-medium leading-relaxed">
              Scan below for prayer notifications, masjid events, and community
              updates
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="w-24 h-24 xl:w-32 xl:h-32 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden p-2">
              <img
                src={masjid?.logo || "/logo.png"}
                alt="Masjid Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-24 h-24 xl:w-32 xl:h-32 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <img
                src="/qrcode.png"
                alt="QR Code"
                className="w-full h-full object-contain p-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Jummah Times - Only visible on mobile if there are sessions */}
      {jummahTimes?.length && jummahTimes?.length > 0 && (
        <div className="lg:hidden bg-theme text-white p-3 flex-shrink-0">
          <h3 className="text-sm font-bold text-center mb-2">JUMU'AH</h3>
          <div className="flex gap-2 justify-center">
            {jummahTimes.map((session, index) => (
              <div
                key={index}
                className="bg-theme rounded p-2 text-center flex-1"
              >
                {jummahTimes.length > 1 && (
                  <div className="text-xs font-semibold mb-1">
                    {jummahTimes.length === 1
                      ? "Jumaah"
                      : `Jumaah ${index + 1}`}
                  </div>
                )}
                <div className="flex justify-center gap-3">
                  <div>
                    <div className="text-xs opacity-80">Starts</div>
                    <div className="text-sm font-semibold">
                      {session.starts}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80">Khutbah</div>
                    <div className="text-sm font-semibold">
                      {session.khutbah}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
