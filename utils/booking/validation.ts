import { Tables } from "@/database.types";

export interface BookingFormData {
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  notes?: string;
  booking_date: string;
  start_time: string;
  end_time: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// Shared validation patterns
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_PATTERN = /^[a-zA-Z\s\-'À-ÿ]+$/; // Updated to include accented characters
const PHONE_PATTERN = /^[\d\s\-\(\)\.\+]+$/;
const TIME_PATTERN = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;


interface BookingTypeForValidation {
  min_advance_booking_hours?: number | null;
  max_advance_booking_days?: number | null;
}

export function validateCompleteBookingForm(
  formData: BookingFormData,
  bookingType: BookingTypeForValidation
): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate guest name
  const name = formData.guest_name?.trim();
  if (!name) {
    errors.guest_name = "Name is required";
  } else if (name.length < 2) {
    errors.guest_name = "Name must be at least 2 characters long";
  } else if (name.length > 100) {
    errors.guest_name = "Name must be less than 100 characters";
  } else if (!NAME_PATTERN.test(name)) {
    errors.guest_name = "Name can only contain letters, spaces, hyphens, and apostrophes";
  }

  // Validate guest email
  const email = formData.guest_email?.trim();
  if (!email) {
    errors.guest_email = "Email is required";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.guest_email = "Please enter a valid email address";
  } else if (email.length > 255) {
    errors.guest_email = "Email must be less than 255 characters";
  }

  // Validate guest phone (optional)
  const phone = formData.guest_phone?.trim();
  if (phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    if (cleanPhone.length < 10) {
      errors.guest_phone = "Phone number must be at least 10 digits";
    } else if (cleanPhone.length > 15) {
      errors.guest_phone = "Phone number must be less than 15 digits";
    } else if (!PHONE_PATTERN.test(phone)) {
      errors.guest_phone = "Please enter a valid phone number";
    }
  }

  // Validate notes (optional)
  if (formData.notes && formData.notes.length > 1000) {
    errors.notes = "Notes must be less than 1000 characters";
  }

  // Validate booking date
  if (!formData.booking_date) {
    errors.booking_date = "Booking date is required";
  } else {
    const [year, month, day] = formData.booking_date.split('-').map(Number);
    const bookingDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(bookingDate.getTime())) {
      errors.booking_date = "Invalid date format";
    } else if (bookingDate < today) {
      errors.booking_date = "Cannot book appointments in the past";
    }
  }

  // Validate booking time
  if (!formData.start_time) {
    errors.booking_time = "Start time is required";
  } else if (!formData.end_time) {
    errors.booking_time = "End time is required";
  } else if (!TIME_PATTERN.test(formData.start_time)) {
    errors.booking_time = "Invalid start time format";
  } else if (!TIME_PATTERN.test(formData.end_time)) {
    errors.booking_time = "Invalid end time format";
  } else {
    const [startHour, startMinute] = formData.start_time.split(':').map(Number);
    const [endHour, endMinute] = formData.end_time.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (endMinutes <= startMinutes) {
      errors.booking_time = "End time must be after start time";
    }
  }

  // Validate advance booking requirements (only if date/time are valid)
  if (!errors.booking_date && !errors.booking_time) {
    const now = new Date();
    const bookingDateTime = new Date(`${formData.booking_date}T${formData.start_time}`);
    const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Check minimum advance booking
    if (bookingType.min_advance_booking_hours && hoursUntilBooking < bookingType.min_advance_booking_hours) {
      const minHours = bookingType.min_advance_booking_hours;
      if (minHours < 24) {
        errors.advance_booking = `Bookings must be made at least ${minHours} hours in advance`;
      } else {
        const days = Math.floor(minHours / 24);
        errors.advance_booking = `Bookings must be made at least ${days} day${days > 1 ? 's' : ''} in advance`;
      }
    }

    // Check maximum advance booking
    if (bookingType.max_advance_booking_days) {
      const maxAdvanceHours = bookingType.max_advance_booking_days * 24;
      if (hoursUntilBooking > maxAdvanceHours) {
        const maxDays = bookingType.max_advance_booking_days;
        errors.advance_booking = `Bookings cannot be made more than ${maxDays} day${maxDays > 1 ? 's' : ''} in advance`;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function sanitizeBookingFormData(formData: BookingFormData): BookingFormData {
  return {
    guest_name: formData.guest_name.trim(),
    guest_email: formData.guest_email.trim().toLowerCase(),
    guest_phone: formData.guest_phone?.trim() || undefined,
    notes: formData.notes?.trim() || undefined,
    booking_date: formData.booking_date,
    start_time: formData.start_time,
    end_time: formData.end_time,
  };
}

