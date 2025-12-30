"use client";

import { useState, useEffect } from 'react';

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

const DIM_STORAGE_KEY = 'screen_dim_start_time';

/**
 * Hook to manage screen dimming based on a condition
 * Persists dim state across page refreshes using localStorage
 */
export const useScreenDim = ({
  shouldDim,
  durationMinutes = 5,
  dimOpacity = 0.9
}: ScreenDimOptions) => {
  const [isDimmed, setIsDimmed] = useState(false);
  const [dimStartTime, setDimStartTime] = useState<number | null>(null);
  const [remainingPercent, setRemainingPercent] = useState(100);
  
  // On mount, check if there's an existing dim session
  useEffect(() => {
    const storedStartTime = localStorage.getItem(DIM_STORAGE_KEY);
    if (storedStartTime) {
      const startTime = parseInt(storedStartTime, 10);
      const dimDurationMs = durationMinutes * 60 * 1000;
      const elapsed = Date.now() - startTime;
      
      // If the dim period hasn't expired, restore the dimmed state
      if (elapsed < dimDurationMs) {
        setIsDimmed(true);
        setDimStartTime(startTime);
      } else {
        // Clean up expired dim session
        localStorage.removeItem(DIM_STORAGE_KEY);
      }
    }
  }, [durationMinutes]);
  
  // Effect to handle dimming based on shouldDim condition
  useEffect(() => {
    if (shouldDim && !isDimmed) {
      const startTime = Date.now();
      setIsDimmed(true);
      setDimStartTime(startTime);
      setRemainingPercent(100);
      localStorage.setItem(DIM_STORAGE_KEY, startTime.toString());
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
    
    // Calculate remaining time from when dimming started (handles page refreshes)
    const remainingTime = dimDurationMs - (Date.now() - dimStartTime);
    
    // Set timeout to undim
    const timerId = setTimeout(() => {
      setIsDimmed(false);
      setDimStartTime(null);
      setRemainingPercent(0);
      localStorage.removeItem(DIM_STORAGE_KEY);
    }, Math.max(0, remainingTime));
    
    return () => {
      clearTimeout(timerId);
      clearInterval(updateInterval);
    };
  }, [isDimmed, dimStartTime, durationMinutes]);
  
  // Calculate the opacity value for styling
  const opacity = isDimmed ? dimOpacity : 1;
  
  return { isDimmed, opacity, remainingPercent };
};