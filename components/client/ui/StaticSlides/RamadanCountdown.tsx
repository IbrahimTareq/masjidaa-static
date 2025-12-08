"use client";

import { useState, useEffect } from "react";

const RAMADAN_START_DATE = new Date("2026-02-16T00:00:00");

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function RamadanCountdown() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeRemaining = (): TimeRemaining => {
      const now = new Date();
      const difference = RAMADAN_START_DATE.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    // Calculate immediately
    setTimeRemaining(calculateTimeRemaining());

    // Update every second
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Show loading state during SSR or initial mount
  if (!mounted || !timeRemaining) {
    return (
      <div
        className="w-full h-full relative overflow-hidden flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #000000 0%, #1f1f1f 50%, #333333 100%)",
        }}
      >
        <div className="text-white/50 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  // Check if Ramadan has arrived
  const isRamadan =
    timeRemaining.days === 0 &&
    timeRemaining.hours === 0 &&
    timeRemaining.minutes === 0 &&
    timeRemaining.seconds === 0;

  // Show Ramadan Mubarak message when countdown reaches zero
  if (isRamadan) {
    return (
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for better text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(31, 31, 31, 0.8) 50%, rgba(51, 51, 51, 0.75) 100%)",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center px-[8vw] py-[6vh] max-w-[95vw]">
          {/* Decorative top element */}
          <div className="mb-[4vh] flex items-center gap-6">
            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-white/40" />
            <div
              className="text-white/70"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 4.5rem)",
                filter: "drop-shadow(0 0 30px rgba(255, 255, 255, 0.4))",
              }}
            >
              ☾
            </div>
            <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-white/40" />
          </div>

          {/* Ramadan Mubarak Message */}
          <h1
            className="text-white text-center font-light tracking-wide mb-[3vh] whitespace-nowrap"
            style={{
              fontSize: "clamp(2rem, 5vw, 6rem)",
              fontWeight: "300",
              letterSpacing: "0.1em",
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            }}
          >
            RAMADAN MUBARAK
          </h1>

          <p
            className="text-white/70 text-center font-light leading-relaxed max-w-4xl px-4"
            style={{
              fontSize: "clamp(1rem, 2vw, 2.5rem)",
              letterSpacing: "0.05em",
            }}
          >
            May this blessed month bring peace, prosperity and blessings to you
            and your family
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for better text contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(31, 31, 31, 0.8) 50%, rgba(51, 51, 51, 0.75) 100%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-[6vw] py-[8vh]">
        {/* Decorative top element */}
        <div className="mb-[4vh] flex items-center gap-6">
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent to-white/40" />
          <div
            className="text-white/70"
            style={{
              fontSize: "clamp(2.5rem, 4vw, 5rem)",
              filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))",
            }}
          >
            ☾
          </div>
          <div className="h-[2px] w-24 bg-gradient-to-l from-transparent to-white/40" />
        </div>

        {/* Title */}
        <div className="mb-[8vh]">
          <h1
            className="text-white text-center font-light tracking-wide"
            style={{
              fontSize: "clamp(2rem, 4vw, 5rem)",
              fontWeight: "300",
              letterSpacing: "0.1em",
            }}
          >
            RAMADAN STARTING IN
          </h1>
        </div>

        {/* Countdown Display - Cleaner grid layout */}
        <div className="grid grid-cols-4 gap-[4vw]">
          {/* Days */}
          <div className="flex flex-col items-center gap-[1.5vh]">
            <div
              className="text-white tabular-nums font-extralight tracking-tight"
              style={{
                fontSize: "clamp(3.5rem, 10vw, 13rem)",
                lineHeight: "0.9",
                fontWeight: "200",
              }}
            >
              {String(timeRemaining.days).padStart(2, "0")}
            </div>
            <div className="h-[1px] w-12 bg-white/20 my-1" />
            <div
              className="text-white/60 uppercase tracking-[0.3em] font-medium"
              style={{
                fontSize: "clamp(1rem, 1.8vw, 2.5rem)",
              }}
            >
              DAYS
            </div>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center gap-[1.5vh]">
            <div
              className="text-white tabular-nums font-extralight tracking-tight"
              style={{
                fontSize: "clamp(3.5rem, 10vw, 13rem)",
                lineHeight: "0.9",
                fontWeight: "200",
              }}
            >
              {String(timeRemaining.hours).padStart(2, "0")}
            </div>
            <div className="h-[1px] w-12 bg-white/20 my-1" />
            <div
              className="text-white/60 uppercase tracking-[0.3em] font-medium"
              style={{
                fontSize: "clamp(1rem, 1.8vw, 2.5rem)",
              }}
            >
              HOURS
            </div>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center gap-[1.5vh]">
            <div
              className="text-white tabular-nums font-extralight tracking-tight"
              style={{
                fontSize: "clamp(3.5rem, 10vw, 13rem)",
                lineHeight: "0.9",
                fontWeight: "200",
              }}
            >
              {String(timeRemaining.minutes).padStart(2, "0")}
            </div>
            <div className="h-[1px] w-12 bg-white/20 my-1" />
            <div
              className="text-white/60 uppercase tracking-[0.3em] font-medium"
              style={{
                fontSize: "clamp(1rem, 1.8vw, 2.5rem)",
              }}
            >
              MINS
            </div>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center gap-[1.5vh]">
            <div
              className="text-white tabular-nums font-extralight tracking-tight"
              style={{
                fontSize: "clamp(3.5rem, 10vw, 13rem)",
                lineHeight: "0.9",
                fontWeight: "200",
              }}
            >
              {String(timeRemaining.seconds).padStart(2, "0")}
            </div>
            <div className="h-[1px] w-12 bg-white/20 my-1" />
            <div
              className="text-white/60 uppercase tracking-[0.3em] font-medium"
              style={{
                fontSize: "clamp(1rem, 1.8vw, 2.5rem)",
              }}
            >
              SECS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
