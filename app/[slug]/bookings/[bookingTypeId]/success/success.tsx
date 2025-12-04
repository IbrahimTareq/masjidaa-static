"use client";

import { Tables } from "@/database.types";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface BookingSuccessClientProps {
  masjid: Tables<"masjids">;
  bookingType: Tables<"booking_types">;
  booking?:
    | (Tables<"bookings"> & {
        booking_type?: Tables<"booking_types">;
        masjid?: Tables<"masjids">;
      })
    | null;
  location?: Tables<"masjid_locations"> | null;
  slug: string;
}

const BookingSuccessClient: React.FC<BookingSuccessClientProps> = ({
  masjid,
  bookingType,
  booking,
  location,
  slug,
}) => {
  const { formatTime } = useDateTimeFormat();
  const bookingStatus = booking?.status || "confirmed";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {bookingStatus === "confirmed"
              ? "Booking Confirmed!"
              : "Booking Submitted!"}
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            {bookingStatus === "confirmed"
              ? "Your appointment has been successfully booked."
              : "Your booking request has been submitted and is pending approval."}
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Booking Details
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Service Information */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <div className="font-medium text-gray-900">Service</div>
                  <div className="text-gray-600">{bookingType.name}</div>
                </div>
              </div>

              {booking?.booking_date && booking?.start_time && (
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Date & Time</div>
                    <div className="text-gray-600">
                      {new Date(booking.booking_date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                    <div className="text-gray-600">
                      {formatTime(booking.start_time)} -{" "}
                      {formatTime(booking.end_time || "")}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <div className="font-medium text-gray-900">Location</div>
                  <div className="text-gray-600">{masjid.name}</div>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            {booking && (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Name</div>
                    <div className="text-gray-600">{booking.guest_name}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-gray-600">{booking.guest_email}</div>
                  </div>
                </div>

                {booking.guest_phone && (
                  <div className="flex items-start space-x-3">
                    <div className="h-5 w-5 text-gray-400 mt-1 flex items-center justify-center">
                      <span className="text-xs">📞</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Phone</div>
                      <div className="text-gray-600">{booking.guest_phone}</div>
                    </div>
                  </div>
                )}

                {booking.notes && (
                  <div className="flex items-start space-x-3">
                    <div className="h-5 w-5 text-gray-400 mt-1 flex items-center justify-center">
                      <span className="text-xs">📝</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Notes</div>
                      <div className="text-gray-600">{booking.notes}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          {bookingStatus === "pending" ? (
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Pending Approval
                </h3>
                <p className="text-gray-600 mb-4">
                  Your booking is currently pending approval from the masjid
                  staff. You will receive an email confirmation once your
                  booking is approved.
                </p>
                <p className="text-sm text-gray-500">
                  This typically takes 1-2 business days. If you need immediate
                  assistance, please contact the masjid directly.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Confirmed</h3>
                <p className="text-gray-600 mb-4">
                  Your booking has been confirmed and a confirmation email has been
                  sent to your email address.
                </p>
                <p className="text-sm text-gray-500">
                  Please arrive on time for your appointment. If you need to
                  make changes, please contact the masjid directly.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${slug}/bookings`}
            className="bg-theme hover:bg-theme-accent text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
          >
            Book Another Service
          </Link>
          <Link
            href={`/${slug}`}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors text-center"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessClient;
