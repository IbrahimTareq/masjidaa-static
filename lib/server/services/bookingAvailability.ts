import {
  addMinutesToTimeString,
  minutesToTimeString,
  timeStringToMinutes,
} from "@/utils/booking/availability";
import { cache } from "react";
import { getAvailabilitiesForDay } from "./bookingAvailabilities";
import { getBulkBlackoutStatusForTimeSlots } from "./bookingBlackouts";
import { getBulkBookingStatusForTimeSlots, isTimeSlotBooked } from "./bookings";
import { getBookingTypeById } from "./bookingTypes";

export interface TimeSlot {
  start_time: string;
  end_time: string;
}

export interface AvailableTimeSlot extends TimeSlot {
  available: boolean;
}

export const getAvailableSlots = cache(
  async (bookingTypeId: string, date: string): Promise<AvailableTimeSlot[]> => {
    // Get booking type details
    const bookingType = await getBookingTypeById(bookingTypeId);
    if (!bookingType) return [];

    // Check if booking is within allowed advance booking limits
    const now = new Date();
    // Follow events system pattern - use consistent date parsing
    const bookingDate = new Date(date); // Direct parsing of YYYY-MM-DD
    const hoursUntilBooking =
      (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    const daysUntilBooking = hoursUntilBooking / 24;

    // Check minimum advance booking days
    if (
      bookingType.min_advance_booking_days &&
      daysUntilBooking < bookingType.min_advance_booking_days
    ) {
      return [];
    }

    // Check maximum advance booking days
    if (
      bookingType.max_advance_booking_days &&
      daysUntilBooking > bookingType.max_advance_booking_days
    ) {
      return [];
    }

    // Get day of week consistently - use the same parsing method as events
    const dayOfWeek = bookingDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    // Get availabilities for this day
    const availabilities = await getAvailabilitiesForDay(
      bookingTypeId,
      dayOfWeek
    );
    if (availabilities.length === 0) return [];

    // Check if entire date is blacked out with a simple test slot
    const testSlot = [{ start_time: "00:00", end_time: "23:59" }];
    const dateBlackoutStatus = await getBulkBlackoutStatusForTimeSlots(
      bookingTypeId,
      date,
      testSlot
    );
    if (dateBlackoutStatus["00:00-23:59"]) return [];

    // Generate time slots
    const timeSlots: AvailableTimeSlot[] = [];
    const durationMinutes = bookingType.duration_minutes || 30;
    const bufferMinutes = bookingType.buffer_minutes || 0;

    for (const availability of availabilities) {
      if (!availability.start_time || !availability.end_time) continue;

      const slots = generateTimeSlotsForAvailability(
        availability.start_time,
        availability.end_time,
        durationMinutes,
        bufferMinutes
      );

      timeSlots.push(...slots);
    }

    // Check availability for all slots in bulk operations
    const [bookingStatuses, blackoutStatuses] = await Promise.all([
      getBulkBookingStatusForTimeSlots(bookingTypeId, date, timeSlots),
      getBulkBlackoutStatusForTimeSlots(bookingTypeId, date, timeSlots),
    ]);

    // Apply availability status to each slot
    const slotsWithAvailability = timeSlots.map((slot) => {
      const slotKey = `${slot.start_time}-${slot.end_time}`;
      const isBooked = bookingStatuses[slotKey] || false;
      const isBlackedOut = blackoutStatuses[slotKey] || false;

      return {
        ...slot,
        available: !isBooked && !isBlackedOut,
      };
    });

    return slotsWithAvailability;
  }
);

function generateTimeSlotsForAvailability(
  startTime: string,
  endTime: string,
  durationMinutes: number,
  bufferMinutes: number
): AvailableTimeSlot[] {
  const slots: AvailableTimeSlot[] = [];

  // Use shared time utilities
  const startTotalMinutes = timeStringToMinutes(startTime);
  const endTotalMinutes = timeStringToMinutes(endTime);

  let currentMinutes = startTotalMinutes;

  while (currentMinutes + durationMinutes <= endTotalMinutes) {
    const slotEndMinutes = currentMinutes + durationMinutes;

    slots.push({
      start_time: minutesToTimeString(currentMinutes),
      end_time: minutesToTimeString(slotEndMinutes),
      available: true, // Will be checked separately
    });

    // Move to next slot (including buffer time)
    currentMinutes += durationMinutes + bufferMinutes;
  }

  return slots;
}

export const isSlotAvailable = async (
  bookingTypeId: string,
  date: string,
  startTime: string
): Promise<boolean> => {
  const bookingType = await getBookingTypeById(bookingTypeId);
  if (!bookingType) return false;

  const durationMinutes = bookingType.duration_minutes || 30;
  const endTime = addMinutesToTimeString(startTime, durationMinutes);

  // Check if time slot is booked
  const isBooked = await isTimeSlotBooked(
    bookingTypeId,
    date,
    startTime,
    endTime
  );
  if (isBooked) return false;

  // Check if time slot is blacked out
  const slotToCheck = [{ start_time: startTime, end_time: endTime }];
  const blackoutStatuses = await getBulkBlackoutStatusForTimeSlots(
    bookingTypeId,
    date,
    slotToCheck
  );
  if (blackoutStatuses[`${startTime}-${endTime}`]) return false;

  // Check advance booking limits
  const now = new Date();
  const bookingDateTime = new Date(`${date}T${startTime}`);
  const hoursUntilBooking =
    (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  const daysUntilBooking = hoursUntilBooking / 24;

  if (
    bookingType.min_advance_booking_days &&
    daysUntilBooking < bookingType.min_advance_booking_days
  ) {
    return false;
  }

  if (
    bookingType.max_advance_booking_days &&
    daysUntilBooking > bookingType.max_advance_booking_days
  ) {
    return false;
  }

  // Check if time falls within availability windows
  // Use consistent date parsing like events system
  const bookingDate = new Date(date);
  const dayOfWeek = bookingDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const availabilities = await getAvailabilitiesForDay(
    bookingTypeId,
    dayOfWeek
  );

  return availabilities.some((availability) => {
    if (!availability.start_time || !availability.end_time) return false;
    // Use numeric comparison to avoid time format mismatch (HH:MM vs HH:MM:SS)
    const slotStartMinutes = timeStringToMinutes(startTime);
    const slotEndMinutes = timeStringToMinutes(endTime);
    const availStartMinutes = timeStringToMinutes(availability.start_time);
    const availEndMinutes = timeStringToMinutes(availability.end_time);
    return (
      slotStartMinutes >= availStartMinutes && slotEndMinutes <= availEndMinutes
    );
  });
};
