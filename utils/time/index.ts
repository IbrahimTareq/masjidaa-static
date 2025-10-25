export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMonths > 0) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  } else if (diffInDays > 0) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  } else {
    return "just now";
  }
};

export const formatTimeTo12Hour = (timeString: string) => {
  if (!timeString) return "";

  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  const formatted = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return formatted.toLowerCase();
};

export const formatDateToReadable = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" }); // e.g. "Tuesday"
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g. "Oct"
  const year = date.getFullYear();

  // Add ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${dayOfWeek}, ${day}${suffix} ${month} ${year}`;
};

/**
 * Parse a time string to seconds since midnight
 * Supports both 12-hour (e.g., "6:50 PM") and 24-hour (e.g., "18:50") formats
 * 
 * @param timeStr - Time string to parse
 * @returns Seconds since midnight, or null if parsing fails
 */
export function parseTimeToSeconds(timeStr: string | null | undefined): number | null {
  if (!timeStr) return null;
  
  // Handle both 12-hour (e.g., "6:50 PM") and 24-hour (e.g., "18:50") formats
  const time12Match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  const time24Match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  
  if (time12Match) {
    let hours = parseInt(time12Match[1]);
    const minutes = parseInt(time12Match[2]);
    const isPM = time12Match[3].toUpperCase() === "PM";
    
    if (hours === 12) hours = 0;
    if (isPM) hours += 12;
    
    return hours * 3600 + minutes * 60;
  } else if (time24Match) {
    const hours = parseInt(time24Match[1]);
    const minutes = parseInt(time24Match[2]);
    return hours * 3600 + minutes * 60;
  }
  
  return null;
}

/**
 * Get current time in seconds since midnight in the specified timezone
 * 
 * @param timeZone - IANA timezone string (e.g., "America/New_York")
 * @returns Current time as seconds since midnight
 */
export function getCurrentTimeInSeconds(timeZone: string): number {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  
  const parts = formatter.format(now).split(':');
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parseInt(parts[2]);
  
  return hours * 3600 + minutes * 60 + seconds;
}
