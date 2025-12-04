import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { Tables, TablesInsert, TimeSlot } from "@/database.types";





export const createBooking = async (
  bookingData: TablesInsert<"bookings">
): Promise<Tables<"bookings"> | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .insert(bookingData)
    .select()
    .single();

  if (error) {
    console.error("Error creating booking:", error);
    return null;
  }
  return data;
};



export const isTimeSlotBooked = async (
  bookingTypeId: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> => {
  const supabase = await createClient();

  // Check for overlapping bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("id")
    .eq("booking_type_id", bookingTypeId)
    .eq("booking_date", date)
    .in("status", ["pending", "confirmed"])
    .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`);

  if (error) {
    console.error("Error checking time slot availability:", error);
    return true; // Assume booked on error for safety
  }

  return (data?.length || 0) > 0;
};


export const getBulkBookingStatusForTimeSlots = cache(async (
  bookingTypeId: string,
  date: string,
  timeSlots: TimeSlot[]
): Promise<Record<string, boolean>> => {
  const supabase = await createClient();

  // Get all bookings for the date in one query
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("start_time, end_time")
    .eq("booking_type_id", bookingTypeId)
    .eq("booking_date", date)
    .in("status", ["pending", "confirmed"]);

  if (error) {
    console.error("Error fetching bulk booking status:", error);
    // Return all slots as booked for safety
    return timeSlots.reduce((acc, slot) => {
      acc[`${slot.start_time}-${slot.end_time}`] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }

  const existingBookings = bookings || [];
  const slotStatus: Record<string, boolean> = {};

  // Check each time slot against existing bookings
  timeSlots.forEach((slot) => {
    const slotKey = `${slot.start_time}-${slot.end_time}`;

    // Check if this slot overlaps with any existing booking
    const isBooked = existingBookings.some((booking) => {
      // Time slots overlap if: startA < endB AND endA > startB
      return booking.start_time < slot.end_time && booking.end_time > slot.start_time;
    });

    slotStatus[slotKey] = isBooked;
  });

  return slotStatus;
});