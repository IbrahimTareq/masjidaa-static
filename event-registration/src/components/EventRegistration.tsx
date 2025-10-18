"use client";

import { Tables } from "@/database.types";
import {
  createEventPaymentIntentAction,
  submitEventRegistrationAction,
} from "@/lib/server/actions/eventRegistrationActions";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckIcon, TicketIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

type Step = "initial" | "form" | "payment" | "success";

// Helper function to transform form data to use titles as keys
function transformFormData(
  formData: Record<string, any>,
  schema: any
): Record<string, any> {
  // Parse schema if it's a string
  const parsedSchema = typeof schema === "string" ? JSON.parse(schema) : schema;

  if (!parsedSchema.properties) {
    return formData;
  }

  const transformedData: Record<string, any> = {};

  Object.entries(parsedSchema.properties).forEach(
    ([fieldKey]: [string, any]) => {
      if (formData[fieldKey] !== undefined) {
        transformedData[fieldKey] = formData[fieldKey];
      }
    }
  );

  return transformedData;
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

interface EventRegistrationProps {
  event: Tables<"events">;
  masjid: Tables<"masjids">;
  eventForm?: Tables<"event_forms"> | null;
  bankAccount?: Tables<"masjid_bank_accounts"> | null;
}

interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: any;
}

export default function EventRegistration({
  event,
  masjid,
  eventForm,
  bankAccount,
}: EventRegistrationProps) {
  const [currentStep, setCurrentStep] = useState<Step>("initial");
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isPaid =
    event.type === "paid" && !!event.enrolment_fee && !!bankAccount;
  const showRegistrationForm =
    event.type !== "none" && (event.event_form_id || isPaid);

  // If the event doesn't require registration, don't show anything
  if (!showRegistrationForm) {
    return null;
  }

  const handleRegisterClick = () => {
    setCurrentStep("form");
  };

  const handleBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("form");
    } else {
      setCurrentStep("initial");
    }
  };

  const handleFormSubmit = async (data: { formData: FormData }) => {
    setFormData(data.formData);
    setIsLoading(true);
    setError(null);

    try {
      // Extract basic user info from form data
      const firstName = data.formData.firstName || "";
      const lastName = data.formData.lastName || "";
      const email = data.formData.email || "";

      // For free events, submit the form data immediately
      if (!isPaid && event.event_form_id && eventForm?.schema) {
        // Transform the data to use titles as keys
        const transformedData = transformFormData(
          data.formData,
          eventForm.schema
        );

        const result = await submitEventRegistrationAction({
          formId: eventForm.id,
          eventId: event.id,
          masjidId: masjid.id,
          firstName: firstName,
          lastName: lastName,
          email: email,
          data: transformedData,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to submit registration");
        }
        
        // For free events, show success immediately
        setFormData({}); // Reset form data
        setCurrentStep("success");
      } 
      // If it's a paid event, proceed to payment without submitting form yet
      else if (isPaid && event.enrolment_fee && bankAccount) {
        const amountInCents = Math.round(event.enrolment_fee * 100);

        const paymentData = await createEventPaymentIntentAction({
          amount: amountInCents,
          currency: masjid.local_currency.toLowerCase(),
          eventId: event.id,
          eventTitle: event.title,
          masjidId: masjid.id,
          stripeAccountId: bankAccount.stripe_account_id,
          email: email,
          firstName: firstName,
          lastName: lastName,
        });

        setClientSecret(paymentData.client_secret);
        setCurrentStep("payment");
      } else {
        // For events without forms or payments
        setFormData({}); // Reset form data
        setCurrentStep("success");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // After successful payment, submit the form data if there's an event form
      if (event.event_form_id && eventForm?.schema && formData) {
        // Extract basic user info from form data
        const firstName = formData.firstName || "";
        const lastName = formData.lastName || "";
        const email = formData.email || "";
        
        // Transform the data to use titles as keys
        const transformedData = transformFormData(
          formData,
          eventForm.schema
        );

        const result = await submitEventRegistrationAction({
          formId: eventForm.id,
          eventId: event.id,
          masjidId: masjid.id,
          firstName: firstName,
          lastName: lastName,
          email: email,
          data: transformedData,
        });

        if (!result.success) {
          console.error("Failed to submit registration after payment:", result.error);
        }
      }
    } catch (err) {
      console.error("Error submitting form after payment:", err);
    } finally {
      // Reset form data and show success screen regardless of submission result
      // since payment was successful
      setFormData({}); // Reset form data
      setCurrentStep("success");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "initial":
        return (
          <div className="p-5">
            <button
              onClick={handleRegisterClick}
              className="w-full py-3 bg-theme hover:bg-theme-gradient text-white font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center"
            >
              <TicketIcon className="w-5 h-5 mr-2 text-white" />
              {isPaid
                ? `Register (${formatAmount(
                    event.enrolment_fee!,
                    masjid.local_currency
                  )})`
                : "Register for this Event"}
            </button>
          </div>
        );

      case "form":
        if (!eventForm?.schema) {
          return (
            <div className="p-5">
              <p className="text-red-500">No form schema available</p>
              <button
                onClick={() => setCurrentStep("initial")}
                className="mt-4 w-full py-3 bg-gray-200 text-gray-800 rounded-lg"
              >
                Back
              </button>
            </div>
          );
        }

        const schema =
          typeof eventForm.schema === "string"
            ? JSON.parse(eventForm.schema as string)
            : eventForm.schema;

        // Parse the UI schema if available
        let uiSchema = eventForm.ui_schema
          ? typeof eventForm.ui_schema === "string"
            ? JSON.parse(eventForm.ui_schema as string)
            : eventForm.ui_schema
          : {};

        // Hide the form title
        uiSchema["ui:title"] = "";

        // Enhance uiSchema for date fields
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

        return (
          <div className="p-5">
            <div className="flex justify-between items-center mb-8">
              <button
                type="button"
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                ← Back
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <Form
              schema={schema}
              uiSchema={uiSchema}
              validator={validator as any}
              formData={formData}
              onSubmit={handleFormSubmit as any}
              disabled={isLoading}
              className="rjsf-form"
              widgets={{
                DateWidget: DateWidget,
              }}
            >
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-theme hover:bg-theme-gradient disabled:bg-theme-accent text-white font-medium rounded-lg transition-colors cursor-pointer"
                >
                  {isLoading ? (
                    <BeatLoader color="#fff" size={8} />
                  ) : isPaid ? (
                    "Continue to Payment"
                  ) : (
                    "Submit Registration"
                  )}
                </button>
              </div>
            </Form>
          </div>
        );

      case "payment":
        if (!clientSecret) {
          return (
            <div className="p-5">
              <p className="text-red-500">Payment setup failed</p>
              <button
                onClick={() => setCurrentStep("form")}
                className="mt-4 w-full py-3 bg-gray-200 text-gray-800 rounded-lg"
              >
                Back
              </button>
            </div>
          );
        }

        return (
          <div className="p-5">
            <StripePaymentForm
              clientSecret={clientSecret}
              amount={event.enrolment_fee!}
              currency={masjid.local_currency}
              onSuccess={handlePaymentSuccess}
              onCancel={handleBack}
            />
          </div>
        );

      case "success":
        return (
          <div className="p-5">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Registration Complete!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for registering for {event.title}
              </p>
              <button
                onClick={() => {
                  setFormData({}); // Reset form data
                  setCurrentStep("initial");
                }}
                className="px-6 py-2 bg-theme text-white rounded-lg hover:bg-theme/90 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div id="event-registration" className="w-full flex flex-col gap-6 mt-2">
      <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 overflow-hidden">
        {renderStep()}
      </div>
    </div>
  );
}

// Helper component for Stripe payment
function StripePaymentForm({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onCancel,
}: {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const stripePromise = React.useMemo(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_CONNECT_PUBLIC_KEY!;
    return loadStripe(pk);
  }, []);

  // Configure Stripe Elements appearance
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
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
}

function PaymentFormContent({
  amount,
  currency,
  onSuccess,
  onCancel,
}: {
  amount: number;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

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
      } else {
        onSuccess();
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <div className="text-lg font-medium">
            Payment: {formatAmount(amount, currency)}
          </div>
        </div>

        <PaymentElement />

        {errorMessage && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="w-full py-3 bg-theme hover:bg-theme-gradient disabled:bg-theme-accent text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          {isProcessing ? "Processing..." : "Complete Payment"}
        </button>
      </div>
    </form>
  );
}

// Helper function to format the amount
function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
