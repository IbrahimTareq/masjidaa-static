import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/database.types";

export const getBookingAvailabilitiesByTypeId = cache(async (
  bookingTypeId: string
): Promise<Tables<"booking_availabilities">[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking_availabilities")
    .select("*")
    .eq("booking_type_id", bookingTypeId)
    .eq("is_active", true)
    .order("day_of_week");

  if (error) {
    console.error("Error fetching booking availabilities:", error);
    return [];
  }
  return data || [];
});

export const getAvailabilityScheduleByTypeId = cache(async (
  bookingTypeId: string
): Promise<Record<string, Tables<"booking_availabilities">[]>> => {
  const availabilities = await getBookingAvailabilitiesByTypeId(bookingTypeId);

  // Group availabilities by day of week
  const schedule: Record<string, Tables<"booking_availabilities">[]> = {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  };

  availabilities.forEach((availability) => {
    if (availability.day_of_week) {
      schedule[availability.day_of_week].push(availability);
    }
  });

  return schedule;
});

export const getAvailabilitiesForDay = cache(async (
  bookingTypeId: string,
  dayOfWeek: string
): Promise<Tables<"booking_availabilities">[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking_availabilities")
    .select("*")
    .eq("booking_type_id", bookingTypeId)
    .eq("day_of_week", dayOfWeek)
    .eq("is_active", true)
    .order("start_time");

  if (error) {
    console.error("Error fetching day availabilities:", error);
    return [];
  }
  return data || [];
});