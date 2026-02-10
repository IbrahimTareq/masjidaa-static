"use client";

import { BookingFormData } from "@/utils/booking/validation";
import { formatCurrencyWithSymbol } from "@/utils/currency";
import { AlertCircle, CreditCard, Mail, MessageSquare, Phone, User } from "lucide-react";
import React, { useRef, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Tables } from "@/database.types";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

interface BookingTypeForForm {
  price?: number | null;
}

interface BookingFormProps {
  formData: BookingFormData;
  onFormDataChange: (data: BookingFormData) => void;
  onSubmit: (data: BookingFormData) => void;
  errors: Record<string, string>;
  bookingType: BookingTypeForForm;
  isLoading: boolean;
  currency: string;
  clientSecret?: string | null;
  onPaymentSuccess?: () => void;
  showPaymentForm?: boolean;
  hideSubmitButton?: boolean;
  bookingForm?: Tables<"booking_forms"> | null;
  additionalFormData?: Record<string, any>;
  onAdditionalFormDataChange?: (data: Record<string, any>) => void;
  dateWidget?: React.ComponentType<any>;
}

const BookingForm: React.FC<BookingFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  errors,
  bookingType,
  isLoading,
  currency,
  clientSecret,
  onPaymentSuccess,
  showPaymentForm = false,
  hideSubmitButton = false,
  bookingForm,
  additionalFormData = {},
  onAdditionalFormDataChange = () => {},
  dateWidget,
}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const rjsfFormRef = useRef<any>(null);

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

    // Validate additional form fields if a booking form schema is present
    // Uses native HTML validation (reportValidity) to show browser-native
    // "Please fill this field" tooltips, consistent with the event registration form
    if (bookingForm?.schema && rjsfFormRef.current) {
      const formElement = rjsfFormRef.current.formElement?.current ?? rjsfFormRef.current.formElement;
      if (formElement && !formElement.reportValidity()) {
        return; // Block submission; browser will show native validation errors
      }
    }

    // If payment form is not shown yet, just submit the form data
    // The parent will handle showing the payment form
    if (!showPaymentForm) {
      onSubmit(formData);
    }
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-theme focus:border-theme ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                disabled={isLoading}
                required
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-theme focus:border-theme ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Your email address"
                disabled={isLoading}
                required
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-theme focus:border-theme ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Your phone number"
                disabled={isLoading}
                required
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Notes */}
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
            disabled={isLoading}
          />
        </div>
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Optional - let us know if you have any special requirements
        </p>
      </div>

      {/* Additional Information Section */}
      {bookingForm?.schema && onAdditionalFormDataChange && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Additional Information
          </h3>
          <Form
            ref={rjsfFormRef}
            showErrorList={false}
            schema={(() => {
              const schema =
                typeof bookingForm.schema === "string"
                  ? JSON.parse(bookingForm.schema as string)
                  : bookingForm.schema;
              return schema;
            })()}
            uiSchema={(() => {
              let uiSchema = bookingForm.ui_schema
                ? typeof bookingForm.ui_schema === "string"
                  ? JSON.parse(bookingForm.ui_schema as string)
                  : bookingForm.ui_schema
                : {};

              // Hide the form title
              uiSchema["ui:title"] = "";

              // Enhance uiSchema for date fields
              const schema =
                typeof bookingForm.schema === "string"
                  ? JSON.parse(bookingForm.schema as string)
                  : bookingForm.schema;

              if (schema.properties) {
                Object.entries(schema.properties).forEach(
                  ([key, value]: [string, any]) => {
                    if (value.format === "date") {
                      uiSchema[key] = {
                        ...(uiSchema[key] || {}),
                        "ui:widget": "DateWidget",
                      };
                    }
                  }
                );
              }

              return uiSchema;
            })()}
            validator={validator as any}
            formData={additionalFormData}
            onChange={(e) => onAdditionalFormDataChange(e.formData || {})}
            disabled={isLoading}
            className="rjsf-form rjsf-form--booking"
            widgets={dateWidget ? {
              DateWidget: dateWidget,
            } : undefined}
          >
            {/* Hide RJSF's default submit button */}
            <div style={{ display: 'none' }}>
              <button type="submit" />
            </div>
          </Form>
        </div>
      )}

      {/* Payment Information (if applicable and not showing payment form yet) */}
      {hasPrice && !showPaymentForm && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Required
          </h4>
          <div className="text-2xl font-bold text-theme mb-2">
            {formatCurrencyWithSymbol({
              amount: bookingType.price || 0,
              currency: currency,
              decimals: 2,
            })}
          </div>
          <p className="text-sm text-gray-600">
            Payment will be processed on the next step.
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
            disabled={isLoading}
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            I agree to the booking terms and conditions. I understand that:
            <ul className="list-disc list-inside mt-2 space-y-1 text-xs text-gray-600">
              <li>I will arrive on time for my scheduled appointment</li>
              <li>I will notify the masjid if I need to cancel or reschedule</li>
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
      {!hideSubmitButton && (
        <>
          <div className="pt-4">
            <button
              type="submit"
              disabled={!acceptedTerms || isLoading}
              className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                !acceptedTerms || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-theme text-white'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : hasPrice ? (
                'Continue to Payment'
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            By submitting this form, you confirm that all information is accurate and complete.
          </div>
        </>
      )}
    </form>
  );
};

// Payment Form Content Component (uses Stripe hooks inside Elements)
function PaymentFormContent({
  amount,
  currency,
  acceptedTerms,
  onSuccess,
}: {
  amount: number;
  currency: string;
  acceptedTerms: boolean;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handlePaymentSubmit = async () => {
    if (!stripe || !elements || !acceptedTerms) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(undefined);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href + "?payment=success",
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message);
        setIsProcessing(false);
      } else {
        onSuccess();
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Amount */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <CreditCard className="h-4 w-4 mr-2" />
          Payment Information
        </h4>
        <div className="text-2xl font-bold text-theme mb-4">
          {formatCurrencyWithSymbol({
            amount: amount,
            currency: currency,
            decimals: 2,
          })}
        </div>
      </div>

      {/* Payment Element */}
      <PaymentElement />

      {/* Terms and Conditions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="payment-terms"
            checked={acceptedTerms}
            disabled
            className="mt-1 h-4 w-4 text-theme focus:ring-theme border-gray-300 rounded"
          />
          <label htmlFor="payment-terms" className="text-sm text-gray-700">
            I agree to the booking terms and conditions. I understand that:
            <ul className="list-disc list-inside mt-2 space-y-1 text-xs text-gray-600">
              <li>I will arrive on time for my scheduled appointment</li>
              <li>I will notify the masjid if I need to cancel or reschedule</li>
              <li>I will follow all masjid rules and guidelines during my visit</li>
            </ul>
          </label>
        </div>
      </div>

      {/* Payment Error */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="text-sm text-red-700">{errorMessage}</div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={handlePaymentSubmit}
          disabled={!acceptedTerms || isProcessing || !stripe || !elements}
          className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer ${
            !acceptedTerms || isProcessing || !stripe || !elements
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-theme text-white"
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            "Complete Payment"
          )}
        </button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        By completing this payment, you confirm that all information is accurate and complete.
      </div>
    </div>
  );
}

// Separate Payment Step Component (exported for use in booking.tsx)
export function BookingPaymentForm({
  clientSecret,
  amount,
  currency,
  onSuccess,
}: {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
}) {
  const stripePromise = React.useMemo(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_CONNECT_PUBLIC_KEY!;
    return loadStripe(pk);
  }, []);

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary:
          getComputedStyle(document.documentElement)
            .getPropertyValue("--theme-color")
            .trim() || "#0c8c4d",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormContent
        amount={amount}
        currency={currency}
        acceptedTerms={true}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}

export default BookingForm;