export type PrayerTime = {
  starts: string;
  iqamah?: string;
};

export type PrayerTimes = {
  fajr: PrayerTime;
  sunrise: PrayerTime;
  dhuhr: PrayerTime;
  asr: PrayerTime;
  maghrib: PrayerTime;
  isha: PrayerTime;
};

export type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export const prayerOrder: PrayerName[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

export const getPrayerIconType = (prayerName: string): string => {
  switch (prayerName.toLowerCase()) {
    case "fajr":
      return "sunrise";
    case "dhuhr":
      return "sun";
    case "asr":
      return "sundim";
    case "maghrib":
      return "sunset";
    case "isha":
      return "moon";
    default:
      return "sun";
  }
};

export const getPrayerArabicName = (prayerName: PrayerName): string => {
  const prayerArabicNames: Record<PrayerName, string> = {
    fajr: "فجر",
    dhuhr: "ظهر",
    asr: "عصر",
    maghrib: "مغرب",
    isha: "عشاء",
  };
  return prayerArabicNames[prayerName.toLowerCase() as PrayerName];
};

export const getPrayerSchedule = ({
  prayerTimes,
  currentPrayer,
}: {
  prayerTimes: PrayerTimes;
  currentPrayer: PrayerName | null;
}) => {
  return prayerOrder.map((prayerName) => ({
    name: prayerName.toUpperCase(),
    starts: prayerTimes[prayerName].starts,
    iqamah: prayerTimes[prayerName].iqamah,
    icon: getPrayerIconType(prayerName),
    isHighlighted: currentPrayer === prayerName,
  }));
};

export interface CountdownDisplay {
  hours: string;
  minutes: string;
  seconds: string;
}

export const calculateCountdown = (totalSeconds: number): CountdownDisplay => {
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return { hours, minutes, seconds };
};

interface TimeUntilNext {
  hours: number;
  minutes: number;
  seconds: number;
}

export const getTimeUntilNextInSeconds = (
  timeUntilNext: TimeUntilNext
): number => {
  return (
    timeUntilNext.hours * 3600 +
    timeUntilNext.minutes * 60 +
    timeUntilNext.seconds
  );
};