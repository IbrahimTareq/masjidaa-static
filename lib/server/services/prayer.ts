import { getPrayerData } from "@/lib/prayer";
import { getPrayerSettingsByMasjidId } from "@/lib/server/data/masjidPrayerSettings";
import {
  formatGregorianDate,
  formatHijriDate,
  formatTime,
  formatTimeAgo,
} from "@/lib/server/formatters/dateTime";
import { createClient } from "@/utils/supabase/server";
import { getMasjidById } from "../data/masjid";
import { formatPrayerTimes } from "../formatters/prayer";

export type PrayerTime = {
  name: string;
  icon: string;
  arabic: string;
  starts: string;
  iqamah: string | null;
  isActive: boolean;
};

export type FormattedData = {
  prayerTimes: PrayerTime[] | null;
  prayerTimesWithSunrise: PrayerTime[] | null;
  jummahTimes:
    | {
        starts: string;
        khutbah: string;
      }[]
    | undefined;
  lastUpdated: string | null;
  currentPrayer: string | null;
  nextPrayer: string | null;
  nextPrayerTime: string | null;
  hijriDate: string | null;
  gregorianDate: string;
  timeUntilNext: {
    hours: number;
    minutes: number;
    seconds: number;
  };
};

export async function getServerPrayerData(
  masjidId: string
): Promise<FormattedData> {
  const supabase = await createClient();
  const prayerData = await getPrayerData(supabase, masjidId);

  const masjid = await getMasjidById(masjidId);
  if (!masjid) {
    throw new Error("Masjid not found");
  }

  const settings = await getPrayerSettingsByMasjidId(masjidId);
  if (!settings) {
    throw new Error("Prayer settings not found");
  }

  const now = new Date();
  const gregorianDate = formatGregorianDate({
    isoDateString: now.toISOString(),
  });

  const hijriDate = masjid
    ? formatHijriDate({ isoDateString: now.toISOString(), masjid })
    : null;

  const prayerTimes = prayerData.prayerTimes
    ? formatPrayerTimes({ data: prayerData, settings })
    : null;

  const prayerTimesWithSunrise = prayerData.prayerTimes
    ? formatPrayerTimes({ data: prayerData, settings, sunrise: true })
    : null;

  const jummahTimes = prayerData.jummah?.map((j) => ({
    starts: formatTime({
      timeString: j.starts,
      config: {
        timeZone: settings.timezone,
        is12Hour: settings.time_format === "12",
      },
    }),
    khutbah: formatTime({
      timeString: j.khutbah,
      config: {
        timeZone: settings.timezone,
        is12Hour: settings.time_format === "12",
      },
    }),
  }));

  const lastUpdated = prayerData.iqamah?.updated_at
    ? formatTimeAgo(prayerData.iqamah.updated_at)
    : null;

  const currentPrayer = prayerData.prayerInfo?.current.name || null;
  const nextPrayer = prayerData.prayerInfo?.next.name || null;
  const nextPrayerTime = prayerData.prayerInfo?.next.time || null;
  const timeUntilNext = prayerData.prayerInfo?.timeUntilNext || {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  return {
    prayerTimes,
    prayerTimesWithSunrise,
    jummahTimes,
    hijriDate,
    gregorianDate,
    lastUpdated,
    currentPrayer,
    nextPrayer,
    nextPrayerTime,
    timeUntilNext,
  };
}
