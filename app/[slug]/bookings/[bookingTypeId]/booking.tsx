"use client";

import BookingCalendar from "@/components/client/interactive/BookingCalendar";
import BookingForm from "@/components/client/interactive/BookingForm";
import TimeSlotPicker from "@/components/client/interactive/TimeSlotPicker";
import { Tables } from "@/database.types";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import {
  getAvailableSlotsAction,
  submitBookingAction,
} from "@/lib/server/actions/bookingActions";
import { formatDurationForDisplay } from "@/utils/booking/availability";
import {
  BookingFormData,
  validateCompleteBookingForm,
} from "@/utils/booking/validation";
import { formatCurrencyWithSymbol } from "@/utils/currency";
import { ArrowLeft, Calendar, Clock, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface MasjidDTO {
  id: string;
  name: string;
  local_currency: string;
}

interface BookingTypeDTO {
  id: string;
  name: string;
  price: number | null;
  duration_minutes: number | null;
  buffer_minutes: number | null;
  long_description: string | null;
  min_advance_booking_hours: number | null;
  max_advance_booking_days: number | null;
}

interface BookingClientProps {
  masjid: MasjidDTO;
  bookingType: BookingTypeDTO;
  availabilities: Tables<"booking_availabilities">[];
  blackouts: Tables<"booking_blackouts">[];
  existingBookings: Tables<"bookings">[];
  location?: Tables<"masjid_locations"> | null;
  slug: string;
}

type BookingStep = "date" | "time" | "details" | "loading";

interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

const BookingClient: React.FC<BookingClientProps> = ({
  masjid,
  bookingType,
  availabilities,
  blackouts,
  existingBookings,
  location,
  slug,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<BookingStep>("date");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    notes: "",
    booking_date: "",
    start_time: "",
    end_time: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setSubmitting(true);
    setCurrentStep("loading");
    setErrors({});

    try {
      // Validate form
      const validation = validateCompleteBookingForm(data, bookingType);
      if (!validation.valid) {
        setErrors(validation.errors);
        setCurrentStep("details");
        setSubmitting(false);
        return;
      }

      // Submit booking
      const result = await submitBookingAction({
        ...data,
        booking_type_id: bookingType.id,
        masjid_id: masjid.id,
      });

      if (result.success && result.booking) {
        // Redirect to success page
        router.push(
          `/${slug}/bookings/${bookingType.id}/success?bookingId=${result.booking.id}`
        );
      } else {
        setErrors({ submit: result.error || "Failed to submit booking" });
        setCurrentStep("details");
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      setErrors({ submit: "An unexpected error occurred. Please try again." });
      setCurrentStep("details");
    } finally {
      setSubmitting(false);
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
  const hasPrice = bookingType.price && bookingType.price > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${slug}/bookings`}
            className="inline-flex items-center text-theme mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all services
          </Link>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Book {bookingType.name}
              </h1>
              {hasPrice && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-theme">
                    {formatCurrencyWithSymbol({
                      amount: bookingType.price || 0,
                      currency: masjid.local_currency,
                      decimals: 2,
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              {bookingType.long_description && (
                <div
                  className="mt-3 text-gray-600 [&_p]:mb-4 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{
                    __html: bookingType.long_description,
                  }}
                />
              )}
            </div>

            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{masjid.name}</span>
              </div>
              {hasPrice && (
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {formatCurrencyWithSymbol({
                      amount: bookingType.price || 0,
                      currency: masjid.local_currency,
                      decimals: 2,
                    })}
                  </span>
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
                  : ["time", "details", "loading"].includes(currentStep)
                  ? "text-theme"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "date"
                    ? "bg-theme text-white"
                    : ["time", "details", "loading"].includes(currentStep)
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
                  ["time", "details", "loading"].includes(currentStep)
                    ? "bg-theme w-full"
                    : "bg-gray-200 w-0"
                }`}
              />
            </div>

            <div
              className={`flex items-center space-x-2 ${
                currentStep === "time"
                  ? "text-theme"
                  : ["details", "loading"].includes(currentStep)
                  ? "text-theme"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "time"
                    ? "bg-theme text-white"
                    : ["details", "loading"].includes(currentStep)
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
                  ["details", "loading"].includes(currentStep)
                    ? "bg-theme w-full"
                    : "bg-gray-200 w-0"
                }`}
              />
            </div>

            <div
              className={`flex items-center space-x-2 ${
                ["details", "loading"].includes(currentStep)
                  ? "text-theme"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ["details", "loading"].includes(currentStep)
                    ? "bg-theme text-white"
                    : "bg-gray-200"
                }`}
              >
                3
              </div>
              <span className="font-medium">Your Details</span>
            </div>
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
                onSubmit={handleFormSubmit}
                errors={errors}
                bookingType={bookingType}
                submitting={submitting}
                currency={masjid.local_currency}
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
