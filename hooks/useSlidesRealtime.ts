"use client";

import { useEffect, useState } from "react";
import { createClient as createBrowserSupabase } from "@/utils/supabase/client";

/**
 * A simple hook to listen for real-time updates to slides data
 * @param masjidId The ID of the masjid to listen for updates
 * @returns A boolean indicating if there are updates available
 */
export function useSlidesRealtime(masjidId: string) {
  const [hasUpdates, setHasUpdates] = useState(false);

  useEffect(() => {
    if (!masjidId) return;

    const supabase = createBrowserSupabase();

    const channel = supabase
      .channel(`masjid-${masjidId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "masjids",
          filter: `id=eq.${masjidId}`,
        },
        handleChange
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "masjid_slides",
          filter: `masjid_id=eq.${masjidId}`,
        },
        handleChange
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "masjid_prayer_settings",
          filter: `masjid_id=eq.${masjidId}`,
        },
        handleChange
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "masjid_iqamah_times",
          filter: `masjid_id=eq.${masjidId}`,
        },
        handleChange
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "masjid_jummah_times",
          filter: `masjid_id=eq.${masjidId}`,
        },
        handleChange
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "masjid_tickers",
          filter: `masjid_id=eq.${masjidId}`,
        },
        handleChange
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "donation_campaigns",
          filter: `masjid_id=eq.${masjidId}`,
        },
        handleChange
      )
      .subscribe(() => {
        console.log(`Subscribed to real-time updates for masjid ${masjidId}`);
      });

    function handleChange() {
      console.log(`Received real-time update for masjid ${masjidId}`);
      setHasUpdates(true);
    }

    return () => {
      console.log(
        `Unsubscribing from real-time updates for masjid ${masjidId}`
      );
      supabase.removeChannel(channel);
    };
  }, [masjidId]);

  return {
    hasUpdates,
    clearUpdates: () => setHasUpdates(false),
  };
}
