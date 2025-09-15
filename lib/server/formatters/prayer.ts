import { getPrayerArabicName, PrayerName } from "@/utils/prayer";
import { DailyPrayers } from "../data/masjidPrayers";

export type PrayerTime = {
  name: string;
  icon: string;
  arabic: string;
  start: string;
  iqamah: string | null;
  isActive: boolean;
};

export const enrichPrayerTimes = ({
  data,
  currentPrayer,
}: {
  data: DailyPrayers | undefined;
  currentPrayer?: string;
}): PrayerTime[] | null => {
  if (!data) return null;

  const isCurrentPrayer = currentPrayer || null;

  const prayerOrder = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

  const prayerLabels: Record<string, string> = {
    fajr: "Fajr",
    sunrise: "Sunrise",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
  };

  const prayerIcons: Record<string, string> = {
    fajr: "sunrise",
    sunrise: "sun",
    dhuhr: "sun",
    asr: "sun",
    maghrib: "sunset",
    isha: "moon",
  };

  return prayerOrder.map((prayer) => {
    return {
      name: prayerLabels[prayer],
      icon: prayerIcons[prayer],
      arabic: getPrayerArabicName(prayer as PrayerName),
      start: data[prayer as keyof DailyPrayers].start,
      iqamah: data[prayer as keyof DailyPrayers].iqamah,
      isActive: isCurrentPrayer === prayer,
    };
  });
};
