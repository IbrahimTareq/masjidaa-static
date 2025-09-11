import {
  formatGregorianDate,
  formatHijriDate,
} from "@/lib/server/formatters/dateTime";
import { getMasjidById } from "../data/masjid";
import { getMasjidPrayers } from "../data/masjidPrayers";
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
  prayerTimesSunrise: any;
  jummahTimes:
    | {
        start: string;
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
  const prayerData = await getMasjidPrayers(masjidId);

  const masjid = await getMasjidById(masjidId);
  if (!masjid) {
    throw new Error("Masjid not found");
  }

  const now = new Date();
  const gregorianDate = formatGregorianDate({
    isoDateString: now.toISOString(),
  });

  const hijriDate = masjid
    ? formatHijriDate({ isoDateString: now.toISOString(), masjid })
    : null;

  const prayerTimes = prayerData.dailyPrayers
    ? formatPrayerTimes({
        data: prayerData.dailyPrayers,
        currentPrayer: prayerData.prayerInfo.current.name,
      })
    : null;

  return {
    prayerTimes,
    prayerTimesSunrise: prayerData.shurq,
    jummahTimes: prayerData.jummah,
    hijriDate,
    gregorianDate,
    lastUpdated: prayerData.lastUpdated,
    currentPrayer: prayerData.prayerInfo.current.name,
    nextPrayer: prayerData.prayerInfo.next.name,
    nextPrayerTime: prayerData.prayerInfo.next.time,
    timeUntilNext: prayerData.prayerInfo.timeUntilNext,
  };
}
