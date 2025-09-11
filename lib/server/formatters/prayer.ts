import { getPrayerArabicName, PrayerName } from "@/utils/prayer";

export const formatPrayerTimes = ({
  data,
  sunrise,
  currentPrayer,
}: {
  data: any;
  sunrise?: boolean;
  currentPrayer?: string;
}) => {
  if (!data) return null;

  const isCurrentPrayer = currentPrayer || data.prayerInfo?.current.name || null;

  const prayerOrder = sunrise
    ? ["sunrise", "fajr", "dhuhr", "asr", "maghrib", "isha"]
    : ["fajr", "dhuhr", "asr", "maghrib", "isha"];

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
    // Get prayer times
    let startsTime = "";
    let iqamahTime = "";

    if (prayer === "sunrise") {
      startsTime = data?.sunrise || "";
      iqamahTime = data?.duha || "";
    } else if (prayer === "fajr") {
      startsTime = data?.fajr.start || "";
      iqamahTime = data?.fajr.iqamah || "";
    } else if (prayer === "dhuhr") {
      startsTime = data?.dhuhr.start || "";
      iqamahTime = data?.dhuhr.iqamah || "";
    } else if (prayer === "asr") {
      startsTime = data?.asr.start || "";
      iqamahTime = data?.asr.iqamah || "";
    } else if (prayer === "maghrib") {
      startsTime = data?.maghrib.start || "";
      iqamahTime = data?.maghrib.iqamah || "";
    } else if (prayer === "isha") {
      startsTime = data?.isha.start || "";
      iqamahTime = data?.isha.iqamah || "";
    }

    return {
      name: prayerLabels[prayer],
      icon: prayerIcons[prayer],
      arabic: getPrayerArabicName(prayer as PrayerName),
      starts: startsTime,
      iqamah: iqamahTime,
      isActive: isCurrentPrayer === prayer,
    };
  });
};
