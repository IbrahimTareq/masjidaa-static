"use client"; // Add this to make it a client component

import { useState, useEffect } from 'react';
import { calculateCountdown } from '@/utils/prayer';
import type { CountdownDisplay } from '@/utils/prayer';

interface TimeUntilNext {
  hours: number;
  minutes: number;
  seconds: number;
}

export const useCountdown = (timeUntilNext: TimeUntilNext | null | undefined): CountdownDisplay => {
  // Initialize secondsLeft from timeUntilNext
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (!timeUntilNext) return 0;
    const { hours, minutes, seconds } = timeUntilNext;
    return hours * 3600 + minutes * 60 + seconds;
  });

  // Update secondsLeft when timeUntilNext changes
  useEffect(() => {
    if (!timeUntilNext) return;
    const { hours, minutes, seconds } = timeUntilNext;
    setSecondsLeft(hours * 3600 + minutes * 60 + seconds);
  }, [timeUntilNext]);

  // Countdown timer effect - client-side only
  useEffect(() => {
    // Skip this effect during SSR
    if (typeof window === 'undefined') return;

    if (!timeUntilNext) return;

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 0) {
          // Stop the countdown when it reaches zero to prevent unnecessary updates
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeUntilNext]);

  return calculateCountdown(secondsLeft);
};