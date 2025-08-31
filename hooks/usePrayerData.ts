"use client";

import { getPrayerData, PrayerData } from "@/lib/prayer";
import { createClient as createBrowserSupabase } from "@/utils/supabase/client";
import { useMemo } from "react";
import useSWR from "swr";
import { useDateTimeFormat } from "./useDateTimeFormat";
import { usePrayerRealtime } from "./usePrayerRealtime";

export function usePrayerData(masjidId: string, initialData: PrayerData) {
  const supabase = createBrowserSupabase();

  const fetcher = () => getPrayerData(supabase, masjidId);

  const { data, error, isLoading } = useSWR(["prayerData", masjidId], fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: false,
  });

  usePrayerRealtime(masjidId);

  const { formatTime } = useDateTimeFormat();

  // Format only Iqamah times as start times are already formatted from Edge function
  const formattedPrayerTimes: any = useMemo(() => {
    if (!data?.prayerTimes || !data?.iqamah) return null;

    return {
      fajr: {
        starts: data.prayerTimes.fajr,
        iqamah: formatTime(data.iqamah.fajr || ""),
      },
      sunrise: {
        starts: data.prayerTimes.sunrise,
        iqamah: formatTime(data.prayerTimes.duha),
      },
      dhuhr: {
        starts: data.prayerTimes.dhuhr,
        iqamah: formatTime(data.iqamah.dhuhr || ""),
      },
      asr: {
        starts: data.prayerTimes.asr,
        iqamah: formatTime(data.iqamah.asr || ""),
      },
      maghrib: {
        starts: data.prayerTimes.maghrib,
        iqamah: formatTime(data.iqamah.maghrib || ""),
      },
      isha: {
        starts: data.prayerTimes.isha,
        iqamah: formatTime(data.iqamah.isha || ""),
      },
    };
  }, [data?.prayerTimes, data?.iqamah]);

  // Format jummah times
  const formattedJummahTimes = useMemo(() => {
    if (!data?.jummah) return null;
    return data.jummah.map((j) => ({
      starts: formatTime(j.starts),
      khutbah: formatTime(j.khutbah),
    }));
  }, [data?.jummah]);

  return {
    prayerTimes: formattedPrayerTimes,
    jummahTimes: formattedJummahTimes,
    prayerInfo: data?.prayerInfo ?? null,
    settings: data?.settings ?? null,
    lastUpdated: data?.iqamah?.updated_at ?? null,
    isLoading,
    error,
  };
}
