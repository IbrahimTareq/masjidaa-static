"use client";

interface DimmingOverlayProps {
  isDimmed: boolean;
  opacity: number;
  remainingPercent: number;
}

/**
 * Reusable dimming overlay component for prayer screens
 * Shows a dark overlay with "Salah in progress" text and progress bar
 */
export default function DimmingOverlay({
  isDimmed,
  opacity,
  remainingPercent,
}: DimmingOverlayProps) {
  if (!isDimmed) return null;

  return (
    <div
      className="absolute inset-0 bg-black z-50 pointer-events-none transition-opacity duration-500"
      style={{ opacity }}
    >
      {/* Progress indicator for remaining dim time */}
      <div
        className="absolute top-0 left-0 right-0 bg-theme-accent"
        style={{
          height: "clamp(0.25rem, 0.4vh, 0.5rem)",
          width: `${remainingPercent}%`,
          transition: "width 1s linear",
        }}
      ></div>

      {/* Salah in progress text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-wide font-montserrat">
          Salah in progress
        </div>
      </div>
    </div>
  );
}

