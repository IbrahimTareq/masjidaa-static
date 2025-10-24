"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { Tables } from "@/database.types";
import { getMasjidTicker } from "@/lib/server/actions/tickerActions";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

export interface TickerProps {
  /**
   * Optional pre-fetched ticker data. If provided, component won't fetch data again.
   */
  tickerData?: Tables<"masjid_tickers"> | null;
  /**
   * Optional className to apply to the ticker container
   */
  className?: string;
}

export const Ticker: React.FC<TickerProps> = ({ tickerData: propTickerData, className = "" }) => {
  const [masjidTicker, setMasjidTicker] = useState<Tables<"masjid_tickers"> | null>(propTickerData || null);
  const [loading, setLoading] = useState(!propTickerData);
  const [error, setError] = useState(false);
  
  const masjid = useMasjidContext();

  // Only fetch ticker data if it wasn't provided via props
  useEffect(() => {
    if (propTickerData !== undefined) {
      setMasjidTicker(propTickerData);
      setLoading(false);
      return;
    }

    async function fetchMasjidTicker() {
      try {
        setLoading(true);
        const data = await getMasjidTicker(masjid?.id || "");
        if (!data) {
          throw new Error("Failed to fetch masjid ticker");
        }
        setMasjidTicker(data);
      } catch (err) {
        console.error("Error fetching masjid ticker:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchMasjidTicker();
  }, [masjid?.id, propTickerData]);

  // Check if we have valid ticker data to display
  const hasValidTickerData = masjidTicker !== null && 
                           Array.isArray(masjidTicker.ticker_messages) && 
                           masjidTicker.ticker_messages.length > 0;

  // Don't render anything if we're still loading or there's no valid data
  if (loading || !hasValidTickerData) {
    return null;
  }

  const tickerText = masjidTicker.ticker_messages.join(" • ");

  return (
    <div
      className={`font-source-sans-3 bg-white rounded-b-xl py-3 overflow-hidden text-xl flex-shrink-0 text-black ${className}`}
    >
      <Marquee>{tickerText}</Marquee>
    </div>
  );
};

export default Ticker;