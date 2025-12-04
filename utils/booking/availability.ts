import { Tables } from "@/database.types";

// Minimal interfaces kept for potential future use

export function parseTimeString(timeString: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

export function timeStringToMinutes(timeString: string): number {
  const { hours, minutes } = parseTimeString(timeString);
  return hours * 60 + minutes;
}

export function minutesToTimeString(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function addMinutesToTimeString(timeString: string, minutesToAdd: number): string {
  const totalMinutes = timeStringToMinutes(timeString) + minutesToAdd;
  return minutesToTimeString(totalMinutes);
}

export function formatTimeForDisplay(timeString: string, is24Hour = false): string {
  const { hours, minutes } = parseTimeString(timeString);

  if (is24Hour) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function formatDurationForDisplay(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }

  return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
}

export function calculateBookingEndTime(
  startTime: string,
  durationMinutes: number
): string {
  return addMinutesToTimeString(startTime, durationMinutes);
}