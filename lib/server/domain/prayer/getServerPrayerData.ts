import { DisplayDates, getMasjidDates } from "../../services/masjidDates";
import {
  getMasjidPrayers,
  Jummah,
  PrayerSchedule,
} from "../../services/masjidPrayers";
import { enrichPrayerTimes } from "../../formatters/prayer";

export type PrayerTime = {
  name: string;
  icon: string;
  arabic: string;
  start: string;
  iqamah: string | null;
  isActive: boolean;
};

export type FormattedData = Omit<PrayerSchedule, "dailyPrayers" | "jummah"> & {
  dailyPrayerTimes: PrayerTime[] | null;
  jummahPrayerTimes: Jummah[] | null;
  hijriDate: string;
  gregorianDate: string;
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export async function getServerPrayerData(
  masjidId: string,
  date?: string
): Promise<FormattedData> {
  const prayerData: PrayerSchedule | null = await getMasjidPrayers(masjidId, date);
  if (!prayerData) {
    throw new Error("Prayer data not found");
  }

  const dates: DisplayDates | null = await getMasjidDates(masjidId);
  if (!dates) {
    throw new Error("Dates not found");
  }

  return {
    dailyPrayerTimes: enrichPrayerTimes({
      data: prayerData?.dailyPrayers,
      currentPrayer: prayerData?.prayerInfo?.current.name,
    }),
    jummahPrayerTimes: prayerData?.jummah || null,
    shurq: prayerData?.shurq,
    prayerInfo: prayerData?.prayerInfo,
    lastUpdated: prayerData?.lastUpdated,
    hijriDate: dates?.hijri?.formatted,
    gregorianDate: dates?.gregorian?.formatted,
    date: prayerData?.date,
  };
}
