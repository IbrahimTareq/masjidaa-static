"use client";

import { FormattedData } from "@/lib/server/services/prayer";
import { BRAND_NAME, DOMAIN_NAME, SWIPER_SETTINGS } from "@/utils/shared/constants";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Theme4({
  formattedData,
}: {
  formattedData: FormattedData;
}) {
  const { prayerTimes, jummahTimes, lastUpdated, hijriDate, gregorianDate } =
    formattedData;

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-4xl mx-auto p-8">
        {/* Date Section */}
        <div className="text-center mb-8">
          <p className="text-2xl md:text-3xl font-semibold text-gray-800 leading-tight">
            {hijriDate}
          </p>
          <p className="text-2xl md:text-3xl font-medium text-gray-600 leading-tight">
            {gregorianDate}
          </p>
        </div>

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {prayerTimes?.map((prayer) => (
            <div
              key={prayer.name}
              className={`text-center p-6 rounded-lg transition-all ${
                prayer.isActive
                  ? "bg-theme text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 shadow-sm"
              }`}
            >
              <div className="mb-2">
                <h3
                  className={`text-lg font-medium uppercase ${
                    prayer.isActive ? "text-white" : "text-gray-700"
                  }`}
                >
                  {prayer.name} {prayer.arabic}
                </h3>
              </div>
              <div className="mb-1">
                <span
                  className={`text-3xl md:text-4xl font-light ${
                    prayer.isActive ? "text-white" : "text-theme"
                  }`}
                >
                  {prayer.starts}
                </span>
              </div>
              {prayer.iqamah && (
                <div
                  className={`text-sm uppercase ${
                    prayer.isActive ? "text-theme-accent" : "text-gray-500"
                  }`}
                >
                  Iqamah {prayer.iqamah}
                </div>
              )}
            </div>
          ))}

          {/* Jummah Slider Card */}
          <div className="bg-gray-100 text-gray-700 shadow-sm p-6 rounded-lg transition-all relative">
            {/* Left Arrow - only show if more than 1 session */}
            {jummahTimes && jummahTimes.length > 1 && (
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </div>
            )}

            {/* Right Arrow - only show if more than 1 session */}
            {jummahTimes && jummahTimes.length > 1 && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </div>
            )}

            <Swiper
              {...SWIPER_SETTINGS}
            >
              {jummahTimes &&
                jummahTimes.map((session, index) => (
                  <SwiperSlide key={index}>
                    <div className="text-center px-6">
                      <div className="mb-2">
                        <h3 className="text-lg font-medium text-gray-700 uppercase">
                          {jummahTimes.length === 1
                            ? "Jumaah"
                            : `Jumaah ${index + 1}`}
                        </h3>
                      </div>
                      <div className="mb-1">
                        <span className="text-3xl md:text-4xl font-light text-theme">
                          {session.starts}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 uppercase">
                        Khutbah {session.khutbah}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center">
            <span>Powered by </span>
            <a
              href={`${DOMAIN_NAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold ml-1 text-theme"
            >
              {BRAND_NAME}
            </a>
          </div>
          {lastUpdated && <span className="text-gray-400">{lastUpdated}</span>}
        </div>
      </div>
    </div>
  );
}
