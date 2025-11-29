"use client";

import { createContext, useContext, useMemo } from "react";
import type { Tables } from "@/database.types";
import { useLocationContext } from "./locationContext";

interface DateTimeConfig {
  timeZone: string;
  is12Hour: boolean;
}

const defaultConfig: DateTimeConfig = {
  timeZone: "Australia/Melbourne",
  is12Hour: true,
};

const DateTimeContext = createContext<DateTimeConfig>(defaultConfig);

export function DateTimeProvider({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings?: Tables<"masjid_prayer_settings"> | null;
}) {
  const location = useLocationContext();
  
  const config: DateTimeConfig = useMemo(() => {
    if (!settings) return defaultConfig;
    return {
      timeZone: location?.timezone || defaultConfig.timeZone,
      is12Hour: settings.time_format === "12",
    };
  }, [settings, location]);

  return (
    <DateTimeContext.Provider value={config}>
      {children}
    </DateTimeContext.Provider>
  );
}

export const useDateTimeConfig = () => useContext(DateTimeContext);
