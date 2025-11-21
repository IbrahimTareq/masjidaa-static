"use client";

import { useMemo, useEffect, useCallback, useRef } from "react";
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
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Memoize expensive time parsing calculations
  const timeCalculations = useMemo(() => {
    if (!prayerInfo) {
      return {
        currentIqamahSec: null,
        nextStartSec: null,
      };
    }

    return {
      currentIqamahSec: parseTimeToSeconds(prayerInfo.current.iqamahTime),
      nextStartSec: parseTimeToSeconds(prayerInfo.next.startTime),
    };
  }, [prayerInfo]);

  // Determine what to show as the next event (iqamah or next prayer)
  const nextEvent = useMemo((): NextEvent => {
    if (!prayerInfo) {
      return { label: "starts", prayer: "Prayer", time: null, timeInSeconds: null };
    }

    const nowSec = getCurrentTimeInSeconds(config.timeZone);

    // If current iqamah exists and hasn't happened yet, show it
    // Account for day boundary: if iqamah time is much larger than current time,
    // it means we've crossed midnight and the iqamah has already passed
    if (timeCalculations.currentIqamahSec !== null) {
      const timeDiff = timeCalculations.currentIqamahSec - nowSec;
      // If difference is positive and less than 12 hours (43200 seconds), iqamah is still upcoming
      // If difference is large (more than 12 hours), we've crossed midnight and it's in the past
      if (timeDiff > 0 && timeDiff < 43200) {
        return {
          label: "iqamah",
          prayer: prayerInfo.current.name,
          time: prayerInfo.current.iqamahTime,
          timeInSeconds: timeCalculations.currentIqamahSec,
        };
      }
    }

    // Otherwise, show next prayer start time
    return {
      label: "starts",
      prayer: prayerInfo.next.name,
      time: prayerInfo.next.startTime,
      timeInSeconds: timeCalculations.nextStartSec,
    };
  }, [prayerInfo, config.timeZone, timeCalculations]);

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

  // Optimized auto-refresh when countdown reaches zero
  const handleRefresh = useCallback(() => {
    console.log("Countdown reached zero, refreshing page");
    refreshTimeoutRef.current = setTimeout(() => {
      window.location.reload();
    }, 1000); // Wait 1 second before refreshing
  }, []);

  useEffect(() => {
    const isZeroCountdown =
      countdown.hours === "00" &&
      countdown.minutes === "00" &&
      countdown.seconds === "00";

    if (isZeroCountdown && !refreshTimeoutRef.current) {
      handleRefresh();
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = undefined;
      }
    };
  }, [countdown, handleRefresh]);

  return {
    nextEvent,
    countdown,
  };
}

