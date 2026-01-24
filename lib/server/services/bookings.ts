import { Tables, TablesInsert } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getBookingsByTypeId = cache(async (
  bookingTypeId: string
): Promise<Tables<"bookings">[]> => {
  const supabase = await createClient();
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_type_id", bookingTypeId)
    .in("status", ["pending", "confirmed"])
    .order("booking_date", { ascending: true });

  if (error) {
    console.error("Error fetching bookings by type:", error);
    return [];
  }
  
  // Filter out expired pending bookings
  const activeBookings = data?.filter(booking => {
    if (booking.status === "pending" && booking.session_expires_at) {
      return new Date(booking.session_expires_at) > new Date(now);
    }
    return true; // Include all confirmed bookings
  }) || [];
  
  return activeBookings;
});

export const createBooking = async (
  bookingData: TablesInsert<"bookings">
): Promise<{ data: Tables<"bookings"> | null; error: string | null }> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .insert(bookingData)
    .select()
    .single();

  if (error) {
    console.error("Error creating booking:", error);
    return { data: null, error: error.message };
  }
  return { data, error: null };
};

export const isTimeSlotBooked = async (
  bookingTypeId: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> => {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Check for overlapping bookings
  // Include: confirmed bookings, completed bookings, and pending bookings that haven't expired
  const { data, error } = await supabase
    .from("bookings")
    .select("id, status, session_expires_at")
    .eq("booking_type_id", bookingTypeId)
    .eq("booking_date", date)
    .in("status", ["pending", "confirmed", "completed"])
    .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`);

  if (error) {
    console.error("Error checking time slot availability:", error);
    return true; // Assume booked on error for safety
  }

  // Filter out expired pending bookings
  const activeBookings = data?.filter(booking => {
    if (booking.status === "pending" && booking.session_expires_at) {
      return new Date(booking.session_expires_at) > new Date(now);
    }
    return true; // Include all confirmed and completed bookings
  }) || [];

  return activeBookings.length > 0;
};

export const getBulkBookingStatusForTimeSlots = cache(
  async (
    bookingTypeId: string,
    date: string,
    timeSlots: { start_time: string; end_time: string }[]
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
        return (
          booking.start_time < slot.end_time &&
          booking.end_time > slot.start_time
        );
      });

      slotStatus[slotKey] = isBooked;
    });

    return slotStatus;
  }
);

export async function createBookingPaymentIntent({
  amount,
  currency,
  bookingTypeId,
  bookingTypeName,
  masjidId,
  stripeAccountId,
  email,
  name,
  phone,
  bookingDate,
  startTime,
  endTime,
  notes,
  bookingId,
}: {
  amount: number;
  currency: string;
  bookingTypeId: string;
  bookingTypeName?: string;
  masjidId: string;
  stripeAccountId?: string;
  email: string;
  name: string;
  phone: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
  bookingId: string;
}): Promise<{ client_secret: string }> {
  const supabase = await createClient();
  
  // Prepare the request body with snake_case field names
  const requestBody = {
    amount,
    currency,
    booking_type_id: bookingTypeId,
    booking_type_name: bookingTypeName,
    masjid_id: masjidId,
    stripe_account_id: stripeAccountId,
    email,
    name,
    phone,
    booking_date: bookingDate,
    start_time: startTime,
    end_time: endTime,
    notes: notes || undefined,
    booking_id: bookingId,
  };

  const { data, error } = await supabase.functions.invoke(
    "stripe-booking-payment",
    {
      body: requestBody,
    }
  );

  if (error) throw error;
  return data as { client_secret: string };
}
