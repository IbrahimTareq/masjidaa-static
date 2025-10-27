"use client";

import { useScreenDim } from "@/hooks/useScreenDim";
import { usePrayerScreen } from "@/hooks/usePrayerScreen";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { useState, useEffect } from "react";
import { Slide } from "@/components/client/interactive/Slideshow";
import Slideshow from "@/components/client/interactive/Slideshow";
import { Ticker } from "@/components/client/interactive/Ticker";
import { useMasjidContext } from "@/context/masjidContext";
import { Tables } from "@/database.types";
import { getMasjidTicker } from "@/lib/server/actions/tickerActions";

interface SimpleLayoutProps {
  slides: Slide[];
  formattedData?: FormattedData;
}

export default function SimpleLayout({
  slides,
  formattedData,
}: SimpleLayoutProps) {
  const [tickerData, setTickerData] = useState<Tables<"masjid_tickers"> | null>(
    null
  );
  const [isTickerLoading, setIsTickerLoading] = useState(true);

  const masjid = useMasjidContext();

  // Use the prayer screen hook to get next event and countdown
  const { nextEvent, countdown } = usePrayerScreen(formattedData?.prayerInfo);

  // Check if we're in iqamah state and countdown is zero
  const isIqamah = nextEvent.label.toLowerCase() === "iqamah";
  const countdownZero =
    countdown.hours === "00" &&
    countdown.minutes === "00" &&
    countdown.seconds === "00";

  // Fetch ticker data once
  useEffect(() => {
    async function fetchTickerData() {
      try {
        setIsTickerLoading(true);
        const data = await getMasjidTicker(masjid?.id || "");
        setTickerData(data);
      } catch (err) {
        console.error("Error fetching ticker data:", err);
      } finally {
        setIsTickerLoading(false);
      }
    }

    fetchTickerData();
  }, [masjid?.id]);

  // Use the screen dim hook
  const { isDimmed, opacity, remainingPercent } = useScreenDim({
    shouldDim: isIqamah && countdownZero,
    durationMinutes: 5,
    dimOpacity: 0.8,
  });

  return (
    <div className="h-screen p-2 sm:p-4 lg:p-5 bg-gradient-to-br from-theme to-theme flex flex-col relative">
      {/* Dimming overlay */}
      {isDimmed && (
        <div
          className="absolute inset-0 bg-black z-50 pointer-events-none transition-opacity duration-500"
          style={{ opacity: opacity }}
        >
          {/* Progress indicator for remaining dim time */}
          <div
            className="absolute top-0 left-0 right-0 h-1 bg-theme-accent"
            style={{
              width: `${remainingPercent}%`,
              transition: "width 1s linear",
            }}
          ></div>
        </div>
      )}

      {/* Main content - Slideshow */}
      <div
        className={`flex-1 w-full rounded-t-2xl sm:rounded-t-3xl overflow-hidden ${
          !tickerData ? "rounded-b-2xl sm:rounded-b-3xl" : ""
        }`}
      >
        <Slideshow slides={slides} />
      </div>

      {/* Ticker will handle its own visibility based on data */}
      <Ticker tickerData={!isTickerLoading ? tickerData : undefined} />
    </div>
  );
}
