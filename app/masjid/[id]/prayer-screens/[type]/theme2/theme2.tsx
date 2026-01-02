"use client";

import { useRef, useEffect } from "react";
import LayoutWithHeader from "@/components/LayoutWithHeader";
import { useDateTimeConfig } from "@/context/dateTimeContext";
import { useMasjidContext } from "@/context/masjidContext";
import { usePrayerScreen } from "@/hooks/usePrayerScreen";
import { formatCurrentTime } from "@/lib/server/formatters/dateTime";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";

// Helper function to format countdown for display (e.g., "in 1h 30m")
const formatCountdown = (hours: string, minutes: string): string => {
  const parts: string[] = [];
  if (hours !== "00") {
    parts.push(`${parseInt(hours)}h`);
  }
  if (minutes !== "00") {
    parts.push(`${parseInt(minutes)}m`);
  }
  return parts.length > 0 ? `in ${parts.join(" ")}` : "";
};

// Prayer icon mapping using emojis
const getPrayerIcon = (name: string): string => {
  const icons: { [key: string]: string } = {
    Fajr: "🌙",
    Zuhr: "☀️",
    Asr: "🌤️",
    Maghrib: "🌆",
    Isha: "🌙",
    "Jumu'ah": "🕌",
  };
  return icons[name] || "🕌";
};

// Card data type for unified rendering
interface CardData {
  type: 'daily' | 'jummah';
  data: any;
  isActive: boolean;
  name: string;
  arabicName: string;
  startTime: string;
  iqamahTime?: string;
  showCountdown?: string;
}

export default function PrayerClient({
  formattedData,
}: {
  formattedData: FormattedData;
}) {
  const { dailyPrayerTimes, shurq, jummahPrayerTimes, prayerInfo, hijriDate, gregorianDate } =
    formattedData;
  const masjid = useMasjidContext();
  const config = useDateTimeConfig();

  // Use the custom hook to manage prayer screen logic
  const { nextEvent, countdown } = usePrayerScreen(prayerInfo);

  // Auto-scroll functionality to ensure active cards are visible
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeCardRef.current && containerRef.current) {
      activeCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [dailyPrayerTimes]); // Re-run when prayer data changes

  // Combine all prayer data into a single array for unified rendering
  const combineAllPrayerData = (): CardData[] => {
    const cards: CardData[] = [];

    // Add daily prayers
    dailyPrayerTimes?.forEach(prayer => {
      const isNext = nextEvent.prayer === prayer.name && !prayer.isActive;
      const countdownText = isNext ? formatCountdown(countdown.hours, countdown.minutes) : undefined;

      cards.push({
        type: 'daily',
        data: prayer,
        isActive: prayer.isActive,
        name: prayer.name,
        arabicName: prayer.arabic,
        startTime: prayer.start,
        iqamahTime: prayer.iqamah || undefined,
        showCountdown: countdownText
      });
    });

    // Add Jummah (if exists)
    if (jummahPrayerTimes && jummahPrayerTimes.length > 0) {
      cards.push({
        type: 'jummah',
        data: jummahPrayerTimes[0], // Use first session
        isActive: false,
        name: "Jumu'ah",
        arabicName: "جمعة",
        startTime: jummahPrayerTimes[0].start,
        iqamahTime: jummahPrayerTimes[0].khutbah
      });
    }

    // Shurq card removed per user request

    return cards;
  };

  // Render active prayer card with same layout as inactive, just with border
  const renderActiveCard = (card: CardData) => (
    <div
      key={`${card.type}-${card.name}`}
      ref={activeCardRef}
      className="flex-shrink-0 bg-white rounded-2xl border-4 border-theme shadow-sm transition-all duration-300"
      style={{
        width: 'clamp(135px, 13.5vw, 220px)',
        height: 'clamp(170px, 14vh, 240px)',
        padding: 'clamp(0.75rem, 1.1vw, 1.5rem)',
      }}
    >
      <div className="flex flex-col items-center text-center gap-2 h-full justify-center">
        {/* Prayer Name - Centered */}
        <div className="flex items-center gap-1">
          <h3
            className="font-semibold text-gray-900"
            style={{
              fontSize: 'clamp(0.95rem, 1.3vw, 1.5rem)',
            }}
          >
            {card.name} <span className="font-serif">{card.arabicName}</span>
          </h3>
        </div>

        {/* Times - Centered */}
        <div className="flex flex-col gap-1.5">
          {/* Start Time */}
          <div className="text-center">
            <div
              className="text-gray-500 font-medium uppercase tracking-wide"
              style={{
                fontSize: 'clamp(0.625rem, 0.8vw, 0.875rem)',
              }}
            >
              Starts
            </div>
            <div
              className="font-bold text-gray-900"
              style={{
                fontSize: 'clamp(1.125rem, 1.7vw, 1.875rem)',
              }}
            >
              {card.startTime}
            </div>
          </div>

          {/* Iqamah Time */}
          {card.iqamahTime && (
            <div className="text-center">
              <div
                className="text-gray-500 font-medium uppercase tracking-wide"
                style={{
                  fontSize: 'clamp(0.625rem, 0.8vw, 0.875rem)',
                }}
              >
                {card.type === 'jummah' ? 'Khutbah' : 'Iqamah'}
              </div>
              <div
                className="font-semibold text-gray-700"
                style={{
                  fontSize: 'clamp(1.125rem, 1.7vw, 1.875rem)',
                }}
              >
                {card.iqamahTime}
              </div>
            </div>
          )}
        </div>

        {/* Countdown - If applicable */}
        {card.showCountdown && (
          <div
            className="text-gray-500 font-medium"
            style={{
              fontSize: 'clamp(0.7rem, 0.9vw, 1rem)',
            }}
          >
            {card.showCountdown}
          </div>
        )}
      </div>
    </div>
  );

  // Render inactive prayer card with centered layout
  const renderInactiveCard = (card: CardData) => (
    <div
      key={`${card.type}-${card.name}`}
      className="flex-shrink-0 bg-white rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md"
      style={{
        width: 'clamp(120px, 12vw, 220px)',
        height: 'clamp(150px, 12vh, 230px)',
        padding: 'clamp(0.625rem, 1vw, 1.5rem)',
      }}
    >
      <div className="flex flex-col items-center text-center gap-1.5 h-full justify-center">
        {/* Prayer Name - Centered */}
        <div className="flex items-center gap-1">
          <h3
            className="font-semibold text-gray-900"
            style={{
              fontSize: 'clamp(0.875rem, 1.2vw, 1.5rem)',
            }}
          >
            {card.name} <span className="font-serif">{card.arabicName}</span>
          </h3>
        </div>

        {/* Times - Centered */}
        <div className="flex flex-col gap-1">
          {/* Start Time */}
          <div className="text-center">
            <div
              className="text-gray-500 font-medium uppercase tracking-wide"
              style={{
                fontSize: 'clamp(0.5rem, 0.7vw, 0.875rem)',
              }}
            >
              Starts
            </div>
            <div
              className="font-bold text-gray-900"
              style={{
                fontSize: 'clamp(1rem, 1.5vw, 1.875rem)',
              }}
            >
              {card.startTime}
            </div>
          </div>

          {/* Iqamah Time */}
          {card.iqamahTime && (
            <div className="text-center">
              <div
                className="text-gray-500 font-medium uppercase tracking-wide"
                style={{
                  fontSize: 'clamp(0.5rem, 0.7vw, 0.875rem)',
                }}
              >
                {card.type === 'jummah' ? 'Khutbah' : 'Iqamah'}
              </div>
              <div
                className="font-semibold text-gray-700"
                style={{
                  fontSize: 'clamp(1rem, 1.5vw, 1.875rem)',
                }}
              >
                {card.iqamahTime}
              </div>
            </div>
          )}
        </div>

        {/* Countdown - If applicable */}
        {card.showCountdown && (
          <div
            className="text-gray-500 font-medium"
            style={{
              fontSize: 'clamp(0.625rem, 0.8vw, 1rem)',
            }}
          >
            {card.showCountdown}
          </div>
        )}
      </div>
    </div>
  );

  const allCards = combineAllPrayerData();

  return (
    <LayoutWithHeader
      headerTitle={masjid?.name || "Masjid"}
      dates={{
        hijri: hijriDate,
        gregorian: gregorianDate,
      }}
    >
      <main className="h-full flex flex-col" style={{ padding: 'clamp(0.75rem, 1.5vw, 2rem)' }}>
        {/* Time Header - Clean 2-column layout */}
        <header className="mb-4 md:mb-6">
          <div className="bg-white rounded-2xl overflow-hidden">
            <div
              className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200"
              style={{
                minHeight: 'clamp(140px, 18vh, 250px)',
              }}
            >
              {/* Current Time Section */}
              <div className="flex flex-col justify-center text-right p-4 md:p-6">
                <div
                  className="text-gray-500 font-medium uppercase tracking-wide mb-1"
                  style={{
                    fontSize: 'clamp(0.875rem, 1.4vw, 1.75rem)',
                  }}
                >
                  Current Time
                </div>
                <div
                  className="font-bold text-gray-900 tabular-nums"
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                    lineHeight: '1.1',
                  }}
                >
                  {formatCurrentTime({
                    config: {
                      timeZone: config.timeZone,
                      is12Hour: config.is12Hour,
                    },
                  })}
                </div>
              </div>

              {/* Next Prayer Section */}
              <div className="flex flex-col justify-center text-left p-4 md:p-6">
                <div
                  className="text-gray-500 font-medium uppercase tracking-wide mb-1"
                  style={{
                    fontSize: 'clamp(0.875rem, 1.4vw, 1.75rem)',
                  }}
                >
                  <span className="text-theme font-bold">{nextEvent.prayer}</span> {nextEvent.label} in
                </div>
                <div
                  className="font-bold text-gray-900 tabular-nums"
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                    lineHeight: '1.1',
                  }}
                >
                  {countdown.hours !== "00" && (
                    <>
                      {countdown.hours}
                      <span
                        className="font-normal text-gray-600"
                        style={{
                          fontSize: 'clamp(1rem, 1.5vw, 1.6rem)',
                        }}
                      >
                        HR
                      </span>
                      &nbsp;
                    </>
                  )}
                  {countdown.minutes !== "00" && (
                    <>
                      {countdown.minutes}
                      <span
                        className="font-normal text-gray-600"
                        style={{
                          fontSize: 'clamp(1rem, 1.5vw, 1.6rem)',
                        }}
                      >
                        MIN
                      </span>
                      &nbsp;
                    </>
                  )}
                  {countdown.seconds}
                  <span
                    className="font-normal text-gray-600"
                    style={{
                      fontSize: 'clamp(1.2rem, 1.8vw, 2rem)',
                    }}
                  >
                    SEC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Prayer Cards - Centered */}
        <div className="flex-1 flex items-center justify-center">
          <section
            ref={containerRef}
            className="flex items-center overflow-x-auto max-w-full scrollbar-hide"
            style={{
              gap: 'clamp(0.5rem, 0.7vw, 1.5rem)',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: 'clamp(0.5rem, 1vh, 1rem)',
            }}
          >
            {allCards.map((card) =>
              card.isActive ? renderActiveCard(card) : renderInactiveCard(card)
            )}
          </section>
        </div>
      </main>
    </LayoutWithHeader>
  );
}