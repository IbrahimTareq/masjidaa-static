"use client";

import { useState, useEffect, useMemo } from "react";

export interface ThemeColors {
  baseColor: string;
  accentColor: string;
  gradientColor: string;
}

/**
 * Hook to access and observe theme colors from CSS variables
 * @returns An object containing theme colors and an array of color variations
 */
export function useThemeColors() {
  const [themeColors, setThemeColors] = useState<ThemeColors>({
    baseColor: "",
    accentColor: "",
    gradientColor: "",
  });

  useEffect(() => {
    // Function to get current theme colors from CSS variables
    const getThemeColors = (): ThemeColors => {
      const baseColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--theme-color")
        .trim();
      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--theme-color-accent")
        .trim();
      const gradientColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--theme-color-gradient")
        .trim();

      return { baseColor, accentColor, gradientColor };
    };

    // Initial set
    setThemeColors(getThemeColors());

    // Set up observer for theme changes
    const observer = new MutationObserver(() => {
      setThemeColors(getThemeColors());
    });

    // Watch for changes to document root's style attribute
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, []);

  // Generate theme colors array for components like WavyBackground
  const colorVariations = useMemo(() => {
    return [
      themeColors.baseColor,
      themeColors.accentColor,
      themeColors.gradientColor,
    ];
  }, [themeColors.baseColor, themeColors.accentColor, themeColors.gradientColor]);

  return {
    themeColors,
    colorVariations
  };
}
