"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { Tables } from "@/database.types";
import { getMasjidTicker } from "@/lib/server/actions/tickerActions";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

export const Ticker: React.FC = () => {
  const [masjidTicker, setMasjidTicker] =
    useState<Tables<"masjid_tickers"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const tickerText = masjidTicker?.ticker_messages.join(" • ");

  const masjid = useMasjidContext();

  useEffect(() => {
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
  }, [masjid?.id]);

  if (masjidTicker === null) {
    return null;
  }

  return (
    <div
      className={`font-source-sans-3 bg-white rounded-b-xl py-3 overflow-hidden text-xl flex-shrink-0 text-black`}
    >
      <Marquee>{tickerText}</Marquee>
    </div>
  );
};

export default Ticker;
