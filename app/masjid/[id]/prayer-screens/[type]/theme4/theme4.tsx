"use client";

import LayoutWithHeader from "@/components/LayoutWithHeader";
import { useMasjidContext } from "@/context/masjidContext";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import { usePrayerScreen } from "@/hooks/usePrayerScreen";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";

export default function Theme6({
  formattedData,
}: {
  formattedData: FormattedData;
}) {
  const {
    dailyPrayerTimes,
    jummahPrayerTimes,
    prayerInfo,
    hijriDate,
    gregorianDate,
  } = formattedData;
  const masjid = useMasjidContext();
  const { formatCurrentTime } = useDateTimeFormat();
  const { nextEvent, countdown } = usePrayerScreen(prayerInfo);

  // Extract day number from hijri date (format: "29 Rajab 1447" or similar)
  const hijriDay = hijriDate?.match(/\d+/)?.[0] || "--";
  
  // Extract month and year from hijri date
  const hijriParts = hijriDate?.split(" ") || [];
  const hijriMonth = hijriParts[1] || "";
  const hijriYear = hijriParts[2] || "";

  const currentTime = formatCurrentTime();

  return (
    <LayoutWithHeader
      headerTitle={masjid?.name || "Masjid"}
      backgroundPattern
    >
      <div className="h-full flex flex-col overflow-hidden" style={{ padding: "clamp(0.75rem, 2vw, 2rem)" }}>
        {/* Primary Info Row - Clock & Date */}
        <div
          className="grid grid-cols-2 items-center border-b-2 border-[#3A8B8B]/30 flex-shrink-0"
          style={{ paddingBottom: "clamp(0.5rem, 1.5vh, 1.5rem)", marginBottom: "clamp(0.5rem, 1.5vh, 1.5rem)" }}
        >
          {/* Large Clock */}
          <div className="text-left">
            <div
              className="font-bold text-gray-900 tabular-nums tracking-tight"
              style={{ fontSize: "clamp(2rem, 12vh, 8rem)", lineHeight: 1 }}
            >
              {currentTime}
            </div>
          </div>

          {/* Arabic/Hijri Date */}
          <div className="text-right">
            <div
              className="font-medium text-gray-600"
              style={{ fontSize: "clamp(0.75rem, 3vh, 2rem)", lineHeight: 1.2 }}
            >
              {new Date().toLocaleDateString("ar-SA", { weekday: "long" })}
            </div>
            <div
              className="font-bold text-gray-900"
              style={{ fontSize: "clamp(1rem, 5vh, 3.5rem)", lineHeight: 1.2 }}
            >
              {hijriDay} {hijriMonth} {hijriYear}
            </div>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="flex-1 grid grid-cols-[1.2fr_1fr] gap-4 min-h-0 overflow-hidden">
          {/* Left Column - Prayer Times List */}
          <div className="flex flex-col justify-center" style={{ gap: "clamp(0.25rem, 1vh, 1rem)" }}>
            {dailyPrayerTimes?.map((prayer) => (
              <div
                key={prayer.name}
                className="flex items-center justify-between"
              >
                {/* Prayer Name */}
                <div
                  className={`font-semibold ${
                    prayer.isActive ? "text-theme" : "text-gray-800"
                  }`}
                  style={{ fontSize: "clamp(1rem, 4vh, 2.75rem)" }}
                >
                  {prayer.name} / {prayer.arabic}
                </div>
                {/* Time */}
                <div
                  className={`font-bold tabular-nums text-right ${
                    prayer.isActive ? "text-theme" : "text-gray-900"
                  }`}
                  style={{ fontSize: "clamp(1rem, 4vh, 2.75rem)" }}
                >
                  {prayer.start}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Grid with countdown on top, 2 cells on bottom */}
          <div className="grid grid-rows-2 border-l-2 border-[#3A8B8B]/20 h-full overflow-hidden">
            {/* Top - Countdown to Next Prayer */}
            <div className="flex flex-col items-center justify-center text-center border-b border-[#3A8B8B]/20 p-2">
              <div
                className="text-gray-600 font-medium"
                style={{ fontSize: "clamp(0.875rem, 3vh, 2.5rem)", marginBottom: "clamp(0.25rem, 1vh, 0.75rem)" }}
              >
                <span className="text-theme font-bold uppercase">{nextEvent.prayer}</span> {nextEvent.label} in
              </div>
              <div
                className="font-bold text-gray-900 tabular-nums"
                style={{ fontSize: "clamp(1.75rem, 8vh, 5rem)", lineHeight: 1 }}
              >
                {countdown.hours !== "00" && (
                  <>
                    {countdown.hours}
                    <span
                      className="font-normal text-gray-500"
                      style={{ fontSize: "clamp(0.625rem, 2vh, 1.5rem)" }}
                    >
                      h
                    </span>
                    {" "}
                  </>
                )}
                {countdown.minutes}
                <span
                  className="font-normal text-gray-500"
                  style={{ fontSize: "clamp(0.625rem, 2vh, 1.5rem)" }}
                >
                  m
                </span>
                {" "}
                {countdown.seconds}
                <span
                  className="font-normal text-gray-500"
                  style={{ fontSize: "clamp(0.625rem, 2vh, 1.5rem)" }}
                >
                  s
                </span>
              </div>
            </div>

            {/* Bottom - 2 columns */}
            <div className="grid grid-cols-2 h-full">
              {/* Bottom Left - Jummah Times */}
              <div className="flex flex-col items-center justify-center text-center border-r border-[#3A8B8B]/20 p-2">
                <div
                  className="text-gray-600 font-medium"
                  style={{ fontSize: "clamp(0.625rem, 2.5vh, 1.5rem)", lineHeight: 1.2, marginBottom: "clamp(0.125rem, 0.5vh, 0.5rem)" }}
                >
                  Jummah / جمعة
                </div>
                <div
                  className="font-bold text-gray-900 tabular-nums"
                  style={{ fontSize: "clamp(1rem, 5vh, 3rem)", lineHeight: 1.2 }}
                >
                  {jummahPrayerTimes && jummahPrayerTimes.length > 0 
                    ? jummahPrayerTimes[0].start
                    : "--:--"
                  }
                </div>
              </div>

              {/* Bottom Right - English Date */}
              <div className="flex flex-col items-center justify-center text-center p-2">
                <div
                  className="text-gray-600 font-medium"
                  style={{ fontSize: "clamp(0.625rem, 2.5vh, 1.5rem)", lineHeight: 1.2, marginBottom: "clamp(0.125rem, 0.5vh, 0.5rem)" }}
                >
                  {new Date().toLocaleDateString("en-US", { weekday: "long" })}
                </div>
                <div
                  className="font-bold text-gray-900"
                  style={{ fontSize: "clamp(1rem, 5vh, 3rem)", lineHeight: 1.2 }}
                >
                  {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWithHeader>
  );
}

