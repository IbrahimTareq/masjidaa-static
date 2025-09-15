import { createClient } from "@/utils/supabase/server";

export type DailyPrayers = {
  fajr: {
    start: string;
    iqamah: string;
  };
  dhuhr: {
    start: string;
    iqamah: string;
  };
  asr: {
    start: string;
    iqamah: string;
  };
  maghrib: {
    start: string;
    iqamah: string;
  };
  isha: {
    start: string;
    iqamah: string;
  };
};

type Shurq = {
  sunrise: string;
  duha: string;
};

export type Jummah = {
  start: string;
  khutbah: string;
};

export type PrayerInfo = {
  current: {
    name: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
    time: string;
  };
  next: {
    name: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
    time: string;
  };
  timeUntilNext: {
    hours: number;
    minutes: number;
    seconds: number;
  };
};

export type PrayerSchedule = {
  date: string | undefined;
  dailyPrayers: DailyPrayers | undefined;
  shurq: Shurq | undefined;
  jummah: Jummah[] | undefined;
  prayerInfo: PrayerInfo | undefined;
  lastUpdated: string | undefined;
};

export async function getMasjidPrayers(masjidId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.functions.invoke(
    `masjid-prayers/${masjidId}`,
    {
      method: "GET",
    }
  );

  if (error) {
    console.error("Error fetching masjid prayers", error);
    return null;
  }
  return data as PrayerSchedule;
}
