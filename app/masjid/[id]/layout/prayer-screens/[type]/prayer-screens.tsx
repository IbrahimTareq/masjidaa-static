"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { usePrayerRealtime } from "@/hooks/usePrayerRealtime";
import { usePrayerScreen } from "@/hooks/usePrayerScreen";
import { useScreenDim } from "@/hooks/useScreenDim";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { useEffect } from "react";

interface PrayerScreensProps {
  children: React.ReactNode;
  formattedData?: FormattedData;
}

export default function PrayerScreens({
  children,
  formattedData,
}: PrayerScreensProps) {
  // Use the prayer screen hook to get next event and countdown
  const { nextEvent, countdown } = usePrayerScreen(formattedData?.prayerInfo);

  // Check if we're in iqamah state and countdown is zero
  const isIqamah = nextEvent.label.toLowerCase() === "iqamah";
  const countdownZero =
    countdown.hours === "00" &&
    countdown.minutes === "00" &&
    countdown.seconds === "00";

  // Use the screen dim hook
  const { isDimmed, opacity, remainingPercent } = useScreenDim({
    shouldDim: isIqamah && countdownZero,
    durationMinutes: 5,
    dimOpacity: 0.8,
  });

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

  return (
    <div
      className="h-screen bg-gradient-to-br from-theme to-theme flex flex-col relative"
      style={{
        padding: 'clamp(0.5rem, 1vw, 1.25rem)',
      }}
    >
      {/* Dimming overlay */}
      {isDimmed && (
        <div
          className="absolute inset-0 bg-black z-50 pointer-events-none transition-opacity duration-500"
          style={{ opacity: opacity }}
        >
          {/* Progress indicator for remaining dim time */}
          <div
            className="absolute top-0 left-0 right-0 bg-theme-accent"
            style={{
              height: 'clamp(0.25rem, 0.4vh, 0.5rem)',
              width: `${remainingPercent}%`,
              transition: "width 1s linear",
            }}
          ></div>
        </div>
      )}

      <div
        className="flex-1 w-full overflow-hidden"
        style={{
          borderRadius: 'clamp(1rem, 2vw, 2rem)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
