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
import DimmingOverlay from "@/components/client/ui/DimmingOverlay";

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
  });

  return (
    <div className="h-screen p-2 sm:p-4 lg:p-5 bg-gradient-to-br from-theme to-theme flex flex-col relative">
      <DimmingOverlay
        isDimmed={isDimmed}
        opacity={opacity}
        remainingPercent={remainingPercent}
      />

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
