"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { usePrayerRealtime } from "@/hooks/usePrayerRealtime";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { calculateCountdown, getTimeUntilNextInSeconds } from "@/utils/prayer";
import {
  BRAND_NAME,
  DOMAIN_NAME,
  SWIPER_SETTINGS,
} from "@/utils/shared/constants";
import { useEffect, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Theme1({
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

  const label = prayerInfo?.timeUntilNext.label || "starts";

  const masjid = useMasjidContext();

  // Set up real-time updates with auto-refresh
  const { hasUpdates } = usePrayerRealtime(masjid?.id || "");
  // Auto-refresh when updates are detected
  useEffect(() => {
    if (hasUpdates) {
      const timer = setTimeout(() => {
        console.log("Auto-refreshing due to prayer data updates");
        window.location.reload();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasUpdates]);

  const [secondsLeft, setSecondsLeft] = useState(() =>
    getTimeUntilNextInSeconds(
      formattedData.prayerInfo?.timeUntilNext || {
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    )
  );

  // Update seconds left when data changes
  useEffect(() => {
    setSecondsLeft(
      getTimeUntilNextInSeconds(
        formattedData.prayerInfo?.timeUntilNext || {
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
      )
    );
  }, [formattedData.prayerInfo?.timeUntilNext]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const countdown = calculateCountdown(secondsLeft);

  return (
    <div className="min-h-screen bg-white text-white font-sans">
      <div className="max-w-md mx-auto p-3 bg-gradient-to-b from-theme via-theme-gradient to-theme rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 text-sm">
          <div className="text-left">
            <p className="font-medium text-xs">{gregorianDate}</p>
          </div>

          <div className="text-right">
            <p className="font-medium text-xs">{hijriDate}</p>
          </div>
        </div>

        {/* Countdown Section */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-light mb-4">
            Time until&nbsp;
            <span className="font-bold uppercase">
              {prayerInfo?.next.name}
            </span>&nbsp;{label}
          </h2>

          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded px-3 py-2 min-w-[60px]">
                <div className="text-2xl font-light">{countdown.hours}</div>
              </div>
              <div className="text-xs mt-1 opacity-75">Hours</div>
            </div>

            <div className="text-xl font-light">:</div>

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded px-3 py-2 min-w-[60px]">
                <div className="text-2xl font-light">{countdown.minutes}</div>
              </div>
              <div className="text-xs mt-1 opacity-75">Minutes</div>
            </div>

            <div className="text-xl font-light">:</div>

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded px-3 py-2 min-w-[60px]">
                <div className="text-2xl font-light">{countdown.seconds}</div>
              </div>
              <div className="text-xs mt-1 opacity-75">Seconds</div>
            </div>
          </div>
        </div>

        {/* Decorative Border */}
        <div className="flex items-center justify-center mb-4">
          <div className="border-t border-white/30 flex-1 max-w-xs"></div>
          <div className="px-2">
            <div className="w-4 h-4 border border-white/30 rotate-45 bg-white/10"></div>
          </div>
          <div className="border-t border-white/30 flex-1 max-w-xs"></div>
        </div>

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 max-w-2xl mx-auto">
          {dailyPrayerTimes?.map((prayer) => (
            <div
              key={prayer.name}
              className={`text-center p-2 rounded transition-all ${
                prayer.isActive
                  ? "bg-white text-theme shadow-lg border border-theme/30"
                  : "bg-white/10 backdrop-blur-sm text-white shadow-sm"
              }`}
            >
              <div className="mb-1">
                <h3 className="text-xs font-medium uppercase tracking-wide">
                  {prayer.name}
                </h3>
              </div>
              <div className="mb-1">
                <span className="text-lg font-light">{prayer.start}</span>
              </div>
              {prayer.iqamah && (
                <div className="text-xs opacity-75 uppercase">
                  Iqamah {prayer.iqamah}
                </div>
              )}
            </div>
          ))}

          {/* Jummah Slider Card */}
          {jummahPrayerTimes && jummahPrayerTimes.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm text-white shadow-sm p-2 rounded transition-all relative">
              {/* Left Arrow - only show if more than 1 session */}
              {jummahPrayerTimes.length > 1 && (
                <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-white/60">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                </div>
              )}

              {/* Right Arrow - only show if more than 1 session */}
              {jummahPrayerTimes.length > 1 && (
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white/60">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
              )}

              <Swiper {...SWIPER_SETTINGS}>
                {jummahPrayerTimes.map((session, index) => (
                  <SwiperSlide key={index}>
                    <div className="text-center px-2">
                      <div className="mb-1">
                        <h3 className="text-xs font-medium uppercase tracking-wide">
                          {jummahPrayerTimes.length === 1
                            ? "Jumaah"
                            : `Jumaah ${index + 1}`}
                        </h3>
                      </div>
                      <div className="mb-1">
                        <span className="text-lg font-light">
                          {session.start}
                        </span>
                      </div>
                      <div className="text-xs opacity-75 uppercase">
                        Khutbah {session.khutbah}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="py-2">
          <div className="flex items-center justify-between text-xs text-white/70">
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
            {lastUpdated && (
              <span className="text-white/50">{lastUpdated}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
