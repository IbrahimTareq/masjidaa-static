"use client";

import { useMemo, useEffect } from "react";
import { useDateTimeConfig } from "@/context/dateTimeContext";
import { useCountdown } from "@/hooks/useCountdown";
import { PrayerInfo } from "@/lib/server/services/masjidPrayers";
import { parseTimeToSeconds, getCurrentTimeInSeconds } from "@/utils/time";

export interface NextEvent {
  label: "iqamah" | "starts";
  prayer: string;
  time: string | null;
  timeInSeconds: number | null;
}

export interface PrayerScreenState {
  nextEvent: NextEvent;
  countdown: {
    hours: string;
    minutes: string;
    seconds: string;
  };
}

/**
 * Custom hook that manages all the logic for prayer screen displays.
 * Handles next event calculation, countdown timer, and auto-refresh.
 * 
 * @param prayerInfo - Information about current and next prayers
 * @returns State object containing nextEvent and countdown
 */
export function usePrayerScreen(
  prayerInfo: PrayerInfo | undefined
): PrayerScreenState {
  const config = useDateTimeConfig();

  // Determine what to show as the next event (iqamah or next prayer)
  const nextEvent = useMemo((): NextEvent => {
    if (!prayerInfo) {
      return { label: "starts", prayer: "Prayer", time: null, timeInSeconds: null };
    }

    const currentIqamahSec = parseTimeToSeconds(prayerInfo.current.iqamahTime);
    const nowSec = getCurrentTimeInSeconds(config.timeZone);

    // If current iqamah exists and hasn't happened yet, show it
    if (currentIqamahSec !== null && currentIqamahSec > nowSec) {
      return {
        label: "iqamah",
        prayer: prayerInfo.current.name,
        time: prayerInfo.current.iqamahTime,
        timeInSeconds: currentIqamahSec,
      };
    }

    // Otherwise, show next prayer start time
    const nextStartSec = parseTimeToSeconds(prayerInfo.next.startTime);
    return {
      label: "starts",
      prayer: prayerInfo.next.name,
      time: prayerInfo.next.startTime,
      timeInSeconds: nextStartSec,
    };
  }, [prayerInfo, config.timeZone]);

  // Calculate countdown to the next event
  const countdownTarget = useMemo(() => {
    if (!nextEvent.timeInSeconds) return null;

    const nowSec = getCurrentTimeInSeconds(config.timeZone);
    let diffSec = nextEvent.timeInSeconds - nowSec;

    // Handle case where target is tomorrow (negative difference)
    if (diffSec < 0) {
      diffSec += 24 * 3600; // Add 24 hours
    }

    return {
      hours: Math.floor(diffSec / 3600),
      minutes: Math.floor((diffSec % 3600) / 60),
      seconds: Math.floor(diffSec % 60),
    };
  }, [nextEvent, config.timeZone]);

  // Use the countdown hook with the calculated target
  const countdown = useCountdown(countdownTarget);

  // Auto-refresh when countdown reaches zero
  useEffect(() => {
    if (
      countdown.hours === "00" &&
      countdown.minutes === "00" &&
      countdown.seconds === "00"
    ) {
      console.log("Countdown reached zero, refreshing page");
      const timer = setTimeout(() => {
        window.location.reload();
      }, 1000); // Wait 1 second before refreshing

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return {
    nextEvent,
    countdown,
  };
}

