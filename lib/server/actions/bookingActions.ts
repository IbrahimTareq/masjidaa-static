"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables, TablesInsert } from "@/database.types";
import { createBooking, isTimeSlotBooked } from "../services/bookings";
import { getBookingTypeById } from "../services/bookingTypes";
import { isSlotAvailable, getAvailableSlots } from "../services/bookingAvailability";
import {
  validateCompleteBookingForm,
  sanitizeBookingFormData,
  BookingFormData
} from "@/utils/booking/validation";
import { calculateBookingEndTime } from "@/utils/booking/availability";

export interface BookingActionResult {
  success: boolean;
  error?: string;
  booking?: Tables<"bookings">;
}

export async function submitBookingAction(
  formData: BookingFormData & {
    booking_type_id: string;
    masjid_id: string;
  }
): Promise<BookingActionResult> {
  try {
    // Get booking type details
    const bookingType = await getBookingTypeById(formData.booking_type_id);
    if (!bookingType) {
      return {
        success: false,
        error: "Booking type not found",
      };
    }

    // Sanitize form data
    const sanitizedData = sanitizeBookingFormData(formData);

    // Validate form data
    const validation = validateCompleteBookingForm(sanitizedData, bookingType);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      return {
        success: false,
        error: firstError,
      };
    }

    // Calculate end time if not provided
    const endTime = formData.end_time || calculateBookingEndTime(
      formData.start_time,
      bookingType.duration_minutes || 30
    );

    // Double-check slot availability
    const isAvailable = await isSlotAvailable(
      formData.booking_type_id,
      formData.booking_date,
      formData.start_time
    );

    if (!isAvailable) {
      return {
        success: false,
        error: "This time slot is no longer available",
      };
    }

    // Prepare booking data
    const bookingData: TablesInsert<"bookings"> = {
      masjid_id: formData.masjid_id,
      booking_type_id: formData.booking_type_id,
      booking_form_id: bookingType.booking_form_id || null,
      booking_date: sanitizedData.booking_date,
      start_time: sanitizedData.start_time,
      end_time: endTime,
      name: sanitizedData.name,
      email: sanitizedData.email,
      phone: sanitizedData.phone || null,
      notes: sanitizedData.notes || null,
      admin_notes: null,
      data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone || null,
        notes: sanitizedData.notes || null,
      },
    };

    // Create the booking
    const { data: booking, error: createError } = await createBooking(bookingData);
    if (createError || !booking) {
      return {
        success: false,
        error: createError || "Failed to create booking. Please try again.",
      };
    }

    return {
      success: true,
      booking,
    };
  } catch (error) {
    console.error("Error submitting booking:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function getAvailableSlotsAction(
  bookingTypeId: string,
  date: string
): Promise<{
  success: boolean;
  slots?: Array<{
    start_time: string;
    end_time: string;
    available: boolean;
  }>;
  error?: string;
}> {
  try {
    const slots = await getAvailableSlots(bookingTypeId, date);

    return {
      success: true,
      slots,
    };
  } catch (error) {
    console.error("Error getting available slots:", error);
    return {
      success: false,
      error: "Failed to load available slots",
    };
  }
}

export async function cancelBookingAction(
  bookingId: string,
  reason?: string
): Promise<BookingActionResult> {
  try {
    const supabase = await createClient();

    // Get the booking first to verify it exists and can be cancelled
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return {
        success: false,
        error: "Booking not found",
      };
    }

    // Check if booking is in the past
    const now = new Date();
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);

    if (bookingDateTime < now) {
      return {
        success: false,
        error: "Cannot cancel bookings in the past",
      };
    }

    // Delete the booking
    const { error: deleteError } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (deleteError) {
      return {
        success: false,
        error: "Failed to cancel booking",
      };
    }

    return {
      success: true,
      booking,
    };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function checkSlotAvailabilityAction(
  bookingTypeId: string,
  date: string,
  startTime: string
): Promise<{
  success: boolean;
  available?: boolean;
  error?: string;
}> {
  try {
    const available = await isSlotAvailable(bookingTypeId, date, startTime);

    return {
      success: true,
      available,
    };
  } catch (error) {
    console.error("Error checking slot availability:", error);
    return {
      success: false,
      error: "Failed to check availability",
    };
  }
}

export async function getBookingDetailsAction(
  bookingId: string
): Promise<{
  success: boolean;
  booking?: Tables<"bookings"> & {
    booking_type?: Tables<"booking_types">;
    masjid?: Tables<"masjids">;
  };
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(`
        *,
        booking_types (*),
        masjids (*)
      `)
      .eq("id", bookingId)
      .single();

    if (error || !booking) {
      return {
        success: false,
        error: "Booking not found",
      };
    }

    return {
      success: true,
      booking: {
        ...booking,
        booking_type: booking.booking_types,
        masjid: booking.masjids,
      },
    };
  } catch (error) {
    console.error("Error getting booking details:", error);
    return {
      success: false,
      error: "Failed to load booking details",
    };
  }
}
