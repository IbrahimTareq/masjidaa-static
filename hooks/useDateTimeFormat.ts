import { useDateTimeConfig } from "@/context/dateTimeContext";
import { useMasjidContext } from "@/context/masjidContext";

const DATE_FORMAT = "en-US";

export function useDateTimeFormat() {
  const config = useDateTimeConfig();
  const masjid = useMasjidContext();

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString(DATE_FORMAT, {
      timeZone: config.timeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: config.is12Hour,
    });
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    // Use fixed month abbreviations to avoid hydration errors
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      day: date.getDate(),
      month: months[date.getMonth()],
    };
  };

  const formatCurrentTime = () =>
    new Date().toLocaleTimeString(DATE_FORMAT, {
      timeZone: config.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: config.is12Hour,
    });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(DATE_FORMAT, {
      timeZone: config.timeZone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString(DATE_FORMAT, {
      timeZone: config.timeZone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: config.is12Hour,
    });

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(DATE_FORMAT, { numeric: "auto" });

    if (diffInSeconds < 60) return rtf.format(-diffInSeconds, "second");
    if (diffInSeconds < 3600)
      return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
    if (diffInSeconds < 86400)
      return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
    if (diffInSeconds < 2592000)
      return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
    if (diffInSeconds < 31536000)
      return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
    return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
  };

  const hijriDate = (isoDateString = new Date().toISOString()) => {
    const adjustment = masjid?.hijri_date_adjustment || 0;
    const date = new Date(isoDateString);
    date.setDate(date.getDate() + adjustment);

    return new Intl.DateTimeFormat("en-AU-u-ca-islamic", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const gregorianDate = (isoDateString = new Date().toISOString()) => {
    const date = new Date(isoDateString);
    const dayName = date.toLocaleDateString("en-AU", { weekday: "long" });
    const gregorian = date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${dayName}, ${gregorian}`;
  };

  const timeAgo = (isoDateString: string): string => {
    if (!isoDateString) {
      return "Last updated some time ago";
    }
  
    try {
      const date = new Date(isoDateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date format:", isoDateString);
        return "Last updated some time ago";
      }
  
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInSeconds = Math.floor(diffInMs / 1000);
  
      // Less than 1 minute
      if (diffInSeconds < 60) {
        return "Last updated just now";
      }
  
      // Less than 1 hour
      if (diffInSeconds < 3600) {
        const mins = Math.floor(diffInSeconds / 60);
        return `Last updated ${mins} minute${mins !== 1 ? "s" : ""} ago`;
      }
  
      // Less than 1 day
      if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `Last updated ${hours} hour${hours !== 1 ? "s" : ""} ago`;
      }
  
      const diffInDays = Math.floor(diffInSeconds / 86400);
  
      // Yesterday
      if (diffInDays === 1) {
        return "Last updated yesterday";
      }
  
      // Less than 30 days
      if (diffInDays < 30) {
        return `Last updated ${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
      }
  
      const diffInMonths = Math.floor(diffInDays / 30);
  
      // Less than 12 months
      if (diffInMonths < 12) {
        return `Last updated ${diffInMonths} month${
          diffInMonths !== 1 ? "s" : ""
        } ago`;
      }
  
      // 12+ months
      const diffInYears = Math.floor(diffInMonths / 12);
      return `Last updated ${diffInYears} year${
        diffInYears !== 1 ? "s" : ""
      } ago`;
    } catch (error) {
      console.error("Error in timeAgo function:", error);
      return "Last updated some time ago";
    }
  };

  return {
    formatTime,
    formatEventDate,
    formatCurrentTime,
    formatDate,
    formatDateTime,
    formatRelativeTime,
    hijriDate,
    gregorianDate,
    timeAgo,
  };
}
