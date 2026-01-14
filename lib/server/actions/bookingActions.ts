"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables, TablesInsert } from "@/database.types";
import { createBooking, isTimeSlotBooked, createBookingPaymentIntent } from "../services/bookings";
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
    status?: "pending" | "confirmed";
    [key: string]: any; // Allow additional form fields
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

    // Determine status: pending for paid bookings, confirmed for free bookings
    const status = formData.status || "confirmed";

    // Set session expiration time (30 minutes from now) for pending bookings
    const sessionExpiresAt = status === "pending" 
      ? new Date(Date.now() + 30 * 60 * 1000).toISOString()
      : null;

    // Extract additional form fields (excluding base booking fields)
    const baseFields = [
      'booking_type_id', 'masjid_id', 'status', 'booking_date', 
      'start_time', 'end_time', 'name', 'email', 'phone', 'notes'
    ];
    const additionalFields: Record<string, any> = {};
    Object.keys(formData).forEach(key => {
      if (!baseFields.includes(key)) {
        additionalFields[key] = formData[key];
      }
    });

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
      phone: sanitizedData.phone,
      notes: sanitizedData.notes || null,
      admin_notes: null,
      status: status,
      session_expires_at: sessionExpiresAt,
      data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        notes: sanitizedData.notes || null,
        ...additionalFields, // Include all additional form fields
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

export async function createBookingPaymentIntentAction({
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
}): Promise<{ client_secret: string }> {
  return createBookingPaymentIntent({
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
  });
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show"
): Promise<BookingActionResult> {
  try {
    const supabase = await createClient();
    
    // Clear session_expires_at when status changes to confirmed (payment successful)
    const updateData: { status: typeof status; session_expires_at?: null } = { status };
    if (status === "confirmed") {
      updateData.session_expires_at = null;
    }
    
    const { error } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", bookingId);

    if (error) {
      console.error("Error updating booking status:", error);
      return {
        success: false,
        error: "Failed to update booking status",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

