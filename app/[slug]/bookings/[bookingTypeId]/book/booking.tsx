"use client";

import BookingCalendar from "@/components/client/interactive/BookingCalendar";
import BookingForm, {
  BookingPaymentForm,
} from "@/components/client/interactive/BookingForm";
import TimeSlotPicker from "@/components/client/interactive/TimeSlotPicker";
import { Tables } from "@/database.types";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import {
  createBookingPaymentIntentAction,
  getAvailableSlotsAction,
  submitBookingAction,
  updateBookingStatusAction,
} from "@/lib/server/actions/bookingActions";
import { formatDurationForDisplay } from "@/utils/booking/availability";
import {
  BookingFormData,
  validateCompleteBookingForm,
} from "@/utils/booking/validation";
import { formatCurrencyWithSymbol } from "@/utils/currency";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

interface MasjidDTO {
  id: string;
  name: string;
  local_currency: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface BookingTypeDTO {
  id: string;
  name: string;
  price: number | null;
  duration_minutes: number | null;
  buffer_minutes: number | null;
  long_description: string | null;
  min_advance_booking_days: number | null;
  max_advance_booking_days: number | null;
  bank_account_id: string | null;
  faqs: FAQItem[] | null;
}

interface BookingClientProps {
  masjid: MasjidDTO;
  bookingType: BookingTypeDTO;
  availabilities: Tables<"booking_availabilities">[];
  blackouts: Tables<"booking_blackouts">[];
  existingBookings: Tables<"bookings">[];
  location?: Tables<"masjid_locations"> | null;
  slug: string;
  bankAccount?: Tables<"masjid_bank_accounts"> | null;
  bookingForm?: Tables<"booking_forms"> | null;
}

type BookingStep = "date" | "time" | "details" | "payment" | "loading";

interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

// Custom date widget with day, month, year dropdowns
const DateWidget = (props: any) => {
  const { id, value, onChange, required } = props;

  // Parse the date value (if any)
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  // Initialize the date values when the component mounts or value changes
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setDay(date.getDate().toString());
        setMonth((date.getMonth() + 1).toString());
        setYear(date.getFullYear().toString());
      }
    }
  }, [value]);

  // Generate options for days (1-31)
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  // Generate options for months (1-12) with names
  const monthOptions = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Generate options for years (current year and 10 years into the future)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear + i);

  // Update the date when any dropdown changes
  const updateDate = (newDay: string, newMonth: string, newYear: string) => {
    if (newDay && newMonth && newYear) {
      // Create a date string in ISO format (YYYY-MM-DD)
      const monthStr = newMonth.padStart(2, "0");
      const dayStr = newDay.padStart(2, "0");
      const dateStr = `${newYear}-${monthStr}-${dayStr}`;
      onChange(dateStr);
    } else {
      onChange(undefined);
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDay = e.target.value;
    setDay(newDay);
    updateDate(newDay, month, year);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    updateDate(day, newMonth, year);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setYear(newYear);
    updateDate(day, month, newYear);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Month dropdown */}
      <div className="flex-1 min-w-[120px]">
        <select
          id={`${id}_month`}
          className="block w-full py-3 px-4 border-gray-200 rounded-lg focus:ring-[var(--theme-color)] focus:border-[var(--theme-color)] bg-gray-50"
          value={month}
          onChange={handleMonthChange}
          required={required}
        >
          <option value="">Month</option>
          {monthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Day dropdown */}
      <div className="w-24">
        <select
          id={`${id}_day`}
          className="block w-full py-3 px-4 border-gray-200 rounded-lg focus:ring-[var(--theme-color)] focus:border-[var(--theme-color)] bg-gray-50"
          value={day}
          onChange={handleDayChange}
          required={required}
        >
          <option value="">Day</option>
          {dayOptions.map((day) => (
            <option key={day} value={day.toString()}>
              {day}
            </option>
          ))}
        </select>
      </div>

      {/* Year dropdown */}
      <div className="w-28">
        <select
          id={`${id}_year`}
          className="block w-full py-3 px-4 border-gray-200 rounded-lg focus:ring-[var(--theme-color)] focus:border-[var(--theme-color)] bg-gray-50"
          value={year}
          onChange={handleYearChange}
          required={required}
        >
          <option value="">Year</option>
          {yearOptions.map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const BookingClient: React.FC<BookingClientProps> = ({
  masjid,
  bookingType,
  availabilities,
  blackouts,
  existingBookings,
  location,
  slug,
  bankAccount,
  bookingForm,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<BookingStep>("date");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formData, setFormData] = useState<BookingFormData & Record<string, any>>({
    name: "",
    email: "",
    phone: "",
    notes: "",
    booking_date: "",
    start_time: "",
    end_time: "",
  });
  const [additionalFormData, setAdditionalFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Load available slots when date is selected
  useEffect(() => {
    if (selectedDate && currentStep === "time") {
      loadAvailableSlots(selectedDate);
    }
  }, [selectedDate, currentStep]);

  const loadAvailableSlots = async (date: string) => {
    setLoadingSlots(true);
    try {
      const result = await getAvailableSlotsAction(bookingType.id, date);
      if (result.success && result.slots) {
        setAvailableSlots(result.slots);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error("Failed to load slots:", error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setCurrentStep("time");
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setFormData((prev) => ({
      ...prev,
      booking_date: selectedDate,
      start_time: slot.start_time,
      end_time: slot.end_time,
    }));
    setCurrentStep("details");
  };

  const handleFormSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate form
      const validation = validateCompleteBookingForm(data, bookingType);
      if (!validation.valid) {
        setErrors(validation.errors);
        setIsLoading(false);
        return;
      }

      const isPaid = hasPrice && bookingType.bank_account_id && bankAccount;

      // Determine status based on whether payment is required
      const status = isPaid ? "pending" : "confirmed";

      // Always submit booking first, regardless of payment requirement
      const result = await submitBookingAction({
        ...data,
        booking_type_id: bookingType.id,
        masjid_id: masjid.id,
        status: status,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to submit booking");
      }

      // Store the booking ID for later use
      setBookingId(result.booking!.id);

      // For free bookings, redirect to success immediately
      if (!isPaid) {
        router.push(`/${slug}/bookings/${bookingType.id}/success`);
      }
      // For paid bookings, proceed to payment with the booking ID
      else if (isPaid) {
        try {
          const amountInCents = Math.round(bookingType.price! * 100);

          const paymentData = await createBookingPaymentIntentAction({
            amount: amountInCents,
            currency: masjid.local_currency.toLowerCase(),
            bookingTypeId: bookingType.id,
            bookingTypeName: bookingType.name,
            masjidId: masjid.id,
            stripeAccountId: bankAccount.stripe_account_id,
            email: data.email,
            name: data.name,
            phone: data.phone,
            bookingDate: data.booking_date,
            startTime: data.start_time,
            endTime: data.end_time,
            notes: data.notes,
            bookingId: result.booking!.id,
          });

          setClientSecret(paymentData.client_secret);
          setCurrentStep("payment");
        } catch (paymentIntentError) {
          // If payment intent creation fails, cancel the booking
          if (bookingId) {
            await updateBookingStatusAction(bookingId, "cancelled");
            setBookingId(null);
          }
          throw paymentIntentError; // Re-throw to be caught by outer catch
        }
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setCurrentStep("details"); // Stay on details step to show error
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // After successful payment, update the booking status to "confirmed"
      if (bookingId) {
        const result = await updateBookingStatusAction(bookingId, "confirmed");

        if (!result.success) {
          console.error(
            "Failed to update booking status after payment:",
            result.error
          );
        }
      }
    } catch (err) {
      console.error("Error updating booking status after payment:", err);
    } finally {
      // Reset state and redirect to success page
      setBookingId(null);
      router.push(`/${slug}/bookings/${bookingType.id}/success`);
    }
  };

  const handleBackToDate = () => {
    setCurrentStep("date");
    setSelectedDate("");
    setSelectedTimeSlot(null);
  };

  const handleBackToTime = () => {
    setCurrentStep("time");
    setSelectedTimeSlot(null);
  };

  const { formatTime } = useDateTimeFormat();
  const duration = formatDurationForDisplay(bookingType.duration_minutes || 30);
  const hasPrice =
    bookingType.price !== null &&
    bookingType.price !== undefined &&
    bookingType.price > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${slug}/bookings/${bookingType.id}`}
            className="inline-flex items-center text-theme mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to service details
          </Link>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Book {bookingType.name}
                </h1>
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{masjid.name}</span>
                  </div>
                </div>
              </div>
              {hasPrice && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-theme">
                    {formatCurrencyWithSymbol({
                      amount: bookingType.price!,
                      currency: masjid.local_currency,
                      decimals: 2,
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${
                currentStep === "date"
                  ? "text-theme"
                  : ["time", "details", "payment", "loading"].includes(
                      currentStep
                    )
                  ? "text-theme"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "date"
                    ? "bg-theme text-white"
                    : ["time", "details", "payment", "loading"].includes(
                        currentStep
                      )
                    ? "bg-theme text-white"
                    : "bg-gray-200"
                }`}
              >
                1
              </div>
              <span className="font-medium">Choose Date</span>
            </div>

            <div className="w-12 h-0.5 bg-gray-200">
              <div
                className={`h-full transition-all duration-300 ${
                  ["time", "details", "payment", "loading"].includes(
                    currentStep
                  )
                    ? "bg-theme w-full"
                    : "bg-gray-200 w-0"
                }`}
              />
            </div>

            <div
              className={`flex items-center space-x-2 ${
                currentStep === "time"
                  ? "text-theme"
                  : ["details", "payment", "loading"].includes(currentStep)
                  ? "text-theme"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "time"
                    ? "bg-theme text-white"
                    : ["details", "payment", "loading"].includes(currentStep)
                    ? "bg-theme text-white"
                    : "bg-gray-200"
                }`}
              >
                2
              </div>
              <span className="font-medium">Choose Time</span>
            </div>

            <div className="w-12 h-0.5 bg-gray-200">
              <div
                className={`h-full transition-all duration-300 ${
                  ["details", "payment", "loading"].includes(currentStep)
                    ? "bg-theme w-full"
                    : "bg-gray-200 w-0"
                }`}
              />
            </div>

            <div
              className={`flex items-center space-x-2 ${
                currentStep === "details"
                  ? "text-theme"
                  : ["payment", "loading"].includes(currentStep)
                  ? "text-theme"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "details"
                    ? "bg-theme text-white"
                    : ["payment", "loading"].includes(currentStep)
                    ? "bg-theme text-white"
                    : "bg-gray-200"
                }`}
              >
                3
              </div>
              <span className="font-medium">Your Details</span>
            </div>

            {hasPrice && (
              <>
                <div className="w-12 h-0.5 bg-gray-200">
                  <div
                    className={`h-full transition-all duration-300 ${
                      ["payment", "loading"].includes(currentStep)
                        ? "bg-theme w-full"
                        : "bg-gray-200 w-0"
                    }`}
                  />
                </div>

                <div
                  className={`flex items-center space-x-2 ${
                    ["payment", "loading"].includes(currentStep)
                      ? "text-theme"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ["payment", "loading"].includes(currentStep)
                        ? "bg-theme text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    4
                  </div>
                  <span className="font-medium">Payment</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {currentStep === "date" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Choose a Date
              </h2>
              <BookingCalendar
                availabilities={availabilities}
                existingBookings={existingBookings}
                blackouts={blackouts}
                onDateSelect={handleDateSelect}
                timezone={location?.timezone}
                bookingType={bookingType}
              />
            </div>
          )}

          {currentStep === "time" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Choose a Time
                </h2>
                <button
                  onClick={handleBackToDate}
                  className="text-theme text-sm cursor-pointer"
                >
                  ← Change date
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">
                  {selectedDate &&
                    new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </div>
              </div>

              <TimeSlotPicker
                date={selectedDate}
                slots={availableSlots}
                loading={loadingSlots}
                onSlotSelect={handleTimeSlotSelect}
                bookingType={bookingType}
                timezone={location?.timezone}
              />
            </div>
          )}

          {currentStep === "details" && (
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Details
                </h2>
                <button
                  onClick={handleBackToTime}
                  className="text-theme text-sm cursor-pointer"
                >
                  ← Change time
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900 mb-2">
                  Booking Summary
                </div>
                <div className="text-gray-600 space-y-1">
                  <div>
                    {selectedDate &&
                      new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </div>
                  <div>
                    {selectedTimeSlot && (
                      <>
                        {formatTime(selectedTimeSlot.start_time)} -{" "}
                        {formatTime(selectedTimeSlot.end_time)}
                      </>
                    )}
                  </div>
                  <div>
                    {bookingType.name} at {masjid.name}
                  </div>
                </div>
              </div>

              <BookingForm
                formData={formData}
                onFormDataChange={setFormData}
                onSubmit={(data) => {
                  // Merge base form data with additional form data
                  const mergedData = {
                    ...data,
                    ...additionalFormData,
                  };
                  handleFormSubmit(mergedData);
                }}
                errors={errors}
                bookingType={bookingType}
                isLoading={isLoading}
                currency={masjid.local_currency}
                bookingForm={bookingForm}
                additionalFormData={additionalFormData}
                onAdditionalFormDataChange={setAdditionalFormData}
                dateWidget={DateWidget}
              />
            </div>
          )}

          {currentStep === "payment" && clientSecret && (
            <div className="p-6">
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900 mb-2">
                  Booking Summary
                </div>
                <div className="text-gray-600 space-y-1">
                  <div>
                    {selectedDate &&
                      new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </div>
                  <div>
                    {selectedTimeSlot && (
                      <>
                        {formatTime(selectedTimeSlot.start_time)} -{" "}
                        {formatTime(selectedTimeSlot.end_time)}
                      </>
                    )}
                  </div>
                  <div>
                    {bookingType.name} at {masjid.name}
                  </div>
                </div>
              </div>

              <BookingPaymentForm
                clientSecret={clientSecret}
                amount={bookingType.price || 0}
                currency={masjid.local_currency}
                onSuccess={handlePaymentSuccess}
              />
            </div>
          )}

          {currentStep === "loading" && (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Processing Your Booking...
              </h3>
              <p className="text-gray-600">
                Please wait while we confirm your appointment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingClient;
