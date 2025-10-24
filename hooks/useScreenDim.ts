"use client";

import { useState, useEffect, useCallback } from 'react';

interface ScreenDimOptions {
  /**
   * Whether the condition for dimming is met
   */
  shouldDim: boolean;
  
  /**
   * Duration in minutes to keep the screen dimmed
   * @default 5
   */
  durationMinutes?: number;
  
  /**
   * Opacity level when dimmed (0-1)
   * @default 0.8
   */
  dimOpacity?: number;
}

/**
 * Hook to manage screen dimming based on a condition
 */
export const useScreenDim = ({
  shouldDim,
  durationMinutes = 5,
  dimOpacity = 0.8
}: ScreenDimOptions) => {
  const [isDimmed, setIsDimmed] = useState(false);
  const [dimStartTime, setDimStartTime] = useState<number | null>(null);
  const [remainingPercent, setRemainingPercent] = useState(100);
  
  // Effect to handle dimming based on shouldDim condition
  useEffect(() => {
    if (shouldDim && !isDimmed) {
      setIsDimmed(true);
      setDimStartTime(Date.now());
      setRemainingPercent(100);
    }
  }, [shouldDim, isDimmed]);
  
  // Effect to handle undimming after the specified duration
  useEffect(() => {
    if (!isDimmed || !dimStartTime) return;
    
    const dimDurationMs = durationMinutes * 60 * 1000;
    
    // Update remaining percentage every second
    const updateInterval = setInterval(() => {
      const elapsedMs = Date.now() - dimStartTime;
      const remainingMs = Math.max(0, dimDurationMs - elapsedMs);
      const percent = (remainingMs / dimDurationMs) * 100;
      setRemainingPercent(percent);
    }, 1000);
    
    // Set timeout to undim
    const timerId = setTimeout(() => {
      setIsDimmed(false);
      setDimStartTime(null);
      setRemainingPercent(0);
    }, dimDurationMs);
    
    return () => {
      clearTimeout(timerId);
      clearInterval(updateInterval);
    };
  }, [isDimmed, dimStartTime, durationMinutes]);
  
  // Calculate the opacity value for styling
  const opacity = isDimmed ? dimOpacity : 1;
  
  return { isDimmed, opacity, remainingPercent };
};