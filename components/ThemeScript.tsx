"use client";

import { useEffect } from "react";

// Client component that applies theme variables after hydration
export default function ThemeScript({ 
  baseColor, 
  accentColor, 
  gradientColor 
}: { 
  baseColor: string;
  accentColor: string;
  gradientColor: string;
}) {
  // Apply theme variables after component mounts
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-color', baseColor);
    root.style.setProperty('--theme-color-accent', accentColor);
    root.style.setProperty('--theme-color-gradient', gradientColor);
  }, [baseColor, accentColor, gradientColor]);

  // No visible output - just applies the theme
  return null;
}
