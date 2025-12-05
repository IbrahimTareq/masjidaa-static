import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/database.types";
import { TimeSlot } from "./bookingAvailability";

export const getActiveBlackoutsByTypeId = cache(async (
  bookingTypeId: string
): Promise<Tables<"booking_blackouts">[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking_blackouts")
    .select("*")
    .eq("booking_type_id", bookingTypeId)
    .eq("is_active", true)
    .order("start_date");

  if (error) {
    console.error("Error fetching active blackouts:", error);
    return [];
  }
  return data || [];
});




export const getBulkBlackoutStatusForTimeSlots = cache(async (
  bookingTypeId: string,
  date: string,
  timeSlots: TimeSlot[]
): Promise<Record<string, boolean>> => {
  const supabase = await createClient();

  // Get all active blackouts for the date in one query
  const { data: blackouts, error } = await supabase
    .from("booking_blackouts")
    .select("start_time, end_time")
    .eq("booking_type_id", bookingTypeId)
    .eq("is_active", true)
    .lte("start_date", date)
    .gte("end_date", date);

  if (error) {
    console.error("Error fetching bulk blackout status:", error);
    // Return all slots as blacked out for safety
    return timeSlots.reduce((acc, slot) => {
      acc[`${slot.start_time}-${slot.end_time}`] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }

  const activeBlackouts = blackouts || [];
  const slotStatus: Record<string, boolean> = {};

  // Check each time slot against blackouts
  timeSlots.forEach((slot) => {
    const slotKey = `${slot.start_time}-${slot.end_time}`;

    // Check if this slot overlaps with any blackout
    const isBlackedOut = activeBlackouts.some((blackout) => {
      // All-day blackout (no start/end time specified)
      if (!blackout.start_time || !blackout.end_time) {
        return true;
      }

      // Time-specific blackout - check overlap
      // Time slots overlap if: startA < endB AND endA > startB
      return slot.start_time < blackout.end_time && slot.end_time > blackout.start_time;
    });

    slotStatus[slotKey] = isBlackedOut;
  });

  return slotStatus;
});