import { Tables } from "@/database.types";
import { PrayerData } from "@/lib/prayer";
import { formatTime } from "@/lib/server/formatters/dateTime";
import { getPrayerArabicName, PrayerName } from "@/utils/prayer";

export const formatPrayerTimes = ({
  data,
  settings,
  sunrise,
}: {
  data: PrayerData;
  settings: Tables<"masjid_prayer_settings">;
  sunrise?: boolean;
}) => {
  if (!data.prayerTimes || !data.iqamah) return null;

  const currentPrayer = data.prayerInfo?.current.name || null;

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
      startsTime = data.prayerTimes?.sunrise || "";
      iqamahTime = data.prayerTimes?.duha || "";
    } else if (prayer === "fajr") {
      startsTime = data.prayerTimes?.fajr || "";
      iqamahTime = data.iqamah?.fajr || "";
    } else if (prayer === "dhuhr") {
      startsTime = data.prayerTimes?.dhuhr || "";
      iqamahTime = data.iqamah?.dhuhr || "";
    } else if (prayer === "asr") {
      startsTime = data.prayerTimes?.asr || "";
      iqamahTime = data.iqamah?.asr || "";
    } else if (prayer === "maghrib") {
      startsTime = data.prayerTimes?.maghrib || "";
      iqamahTime = data.iqamah?.maghrib || "";
    } else if (prayer === "isha") {
      startsTime = data.prayerTimes?.isha || "";
      iqamahTime = data.iqamah?.isha || "";
    }

    return {
      name: prayerLabels[prayer],
      icon: prayerIcons[prayer],
      arabic: getPrayerArabicName(prayer as PrayerName),
      starts: startsTime,
      iqamah: iqamahTime
        ? formatTime({
            timeString: iqamahTime,
            config: {
              timeZone: settings.timezone,
              is12Hour: settings.time_format === "12",
            },
          })
        : null,
      isActive: currentPrayer === prayer,
    };
  });
};
