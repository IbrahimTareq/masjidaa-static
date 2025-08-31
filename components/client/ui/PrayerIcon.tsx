import { Calendar, Moon, Sun, Sunrise, Sunset } from "lucide-react";
import React from "react";

export interface PrayerIconProps {
  type: string;
  className?: string;
  size?: number;
}

export const PrayerIcon: React.FC<PrayerIconProps> = ({
  type,
  className = "w-full h-full text-[#01abb6]",
  size,
}) => {
  const iconProps = {
    className,
    ...(size ? { width: size, height: size } : {}),
  };

  switch (type) {
    case "sunrise":
      return <Sunrise {...iconProps} />;
    case "sun":
      return <Sun {...iconProps} />;
    case "sundim":
      return <Sun {...iconProps} className={`${className} opacity-70`} />;
    case "sunset":
      return <Sunset {...iconProps} />;
    case "moon":
      return <Moon {...iconProps} />;
    case "calendar":
      return <Calendar {...iconProps} />;
    default:
      return <Sun {...iconProps} />;
  }
};
