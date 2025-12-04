"use client";

import React, { useState } from "react";
import { Tables } from "@/database.types";
import { BookingFormData } from "@/utils/booking/validation";
import { User, Mail, Phone, MessageSquare, CreditCard, AlertCircle, Clock } from "lucide-react";

interface BookingFormProps {
  formData: BookingFormData;
  onFormDataChange: (data: BookingFormData) => void;
  onSubmit: (data: BookingFormData) => void;
  errors: Record<string, string>;
  bookingType: Tables<"booking_types">;
  submitting: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  errors,
  bookingType,
  submitting,
}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      return;
    }

    onSubmit(formData);
  };

  const hasPrice = bookingType.price && bookingType.price > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Contact Information
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 text-black">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label htmlFor="guest_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="guest_name"
                value={formData.guest_name}
                onChange={(e) => handleInputChange('guest_name', e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-theme focus:border-theme ${
                  errors.guest_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                disabled={submitting}
                required
              />
            </div>
            {errors.guest_name && (
              <p className="mt-1 text-sm text-red-600">{errors.guest_name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="guest_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                id="guest_email"
                value={formData.guest_email}
                onChange={(e) => handleInputChange('guest_email', e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-theme focus:border-theme ${
                  errors.guest_email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Your email address"
                disabled={submitting}
                required
              />
            </div>
            {errors.guest_email && (
              <p className="mt-1 text-sm text-red-600">{errors.guest_email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="guest_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="tel"
                id="guest_phone"
                value={formData.guest_phone || ''}
                onChange={(e) => handleInputChange('guest_phone', e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-theme focus:border-theme ${
                  errors.guest_phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Your phone number"
                disabled={submitting}
              />
            </div>
            {errors.guest_phone && (
              <p className="mt-1 text-sm text-red-600">{errors.guest_phone}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Optional - for appointment reminders
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-black mb-1">
          Additional Notes
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </div>
          <textarea
            id="notes"
            rows={4}
            value={formData.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-theme focus:border-theme text-black ${
              errors.notes ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Any special requirements or additional information..."
            disabled={submitting}
          />
        </div>
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Optional - let us know if you have any special requirements
        </p>
      </div>

      {/* Payment Information (if applicable) */}
      {hasPrice && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Information
          </h4>
          <div className="text-2xl font-bold text-theme mb-2">
            £{bookingType.price?.toFixed(2)}
          </div>
          <p className="text-sm text-gray-600">
            Payment will be processed immediately upon booking confirmation.
          </p>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 h-4 w-4 text-theme focus:ring-theme border-gray-300 rounded cursor-pointer"
            disabled={submitting}
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            I agree to the booking terms and conditions. I understand that:
            <ul className="list-disc list-inside mt-2 space-y-1 text-xs text-gray-600">
              <li>I will arrive on time for my scheduled appointment</li>
              <li>I will notify the masjid if I need to cancel or reschedule</li>
              {hasPrice && (
                <li>Payment is required and refunds are subject to the masjid's policy</li>
              )}
              <li>I will follow all masjid rules and guidelines during my visit</li>
            </ul>
          </label>
        </div>
      </div>

      {/* Form Errors */}
      {(errors.submit || errors.advance_booking || errors.booking_time) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800 mb-1">
                Booking Error
              </h4>
              <div className="text-sm text-red-700 space-y-1">
                {errors.submit && <p>{errors.submit}</p>}
                {errors.advance_booking && <p>{errors.advance_booking}</p>}
                {errors.booking_time && <p>{errors.booking_time}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={!acceptedTerms || submitting}
          className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors ${
            !acceptedTerms || submitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-theme hover:bg-theme-accent text-white'
          }`}
        >
          {submitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Submitting Booking...</span>
            </div>
          ) : (
            'Confirm Booking'
          )}
        </button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        By submitting this form, you confirm that all information is accurate and complete.
      </div>
    </form>
  );
};

export default BookingForm;