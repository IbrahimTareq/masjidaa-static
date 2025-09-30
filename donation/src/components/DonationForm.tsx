"use client";

import { PaymentMode, RecurringMeta } from "@/donation/src/types";
import { formatCurrency } from "@/utils/currency";
import { BRAND_NAME, DOMAIN_NAME } from "@/utils/shared/constants";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useMemo, useState } from "react";

/**
 * Props for the DonationForm component
 */
interface DonationFormProps {
  masjid: string;
  name: string;
  currency: string;
  amount: number;
  clientSecret?: string;
  mode: PaymentMode;
  stripeAccountId?: string;
  recurringMeta?: RecurringMeta;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Internal form content component that handles the Stripe payment elements
 */
const DonationFormContent: React.FC<DonationFormProps> = ({
  masjid,
  currency,
  amount,
  mode,
  recurringMeta,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Builds the return URL with appropriate query parameters
   */
  const buildReturnUrl = (isRecurring = false) => {
    const baseUrl = `${window.location.origin}/${masjid}/donation-result`;
    const params = new URLSearchParams({
      ...(isRecurring ? { mode: "recurring" } : { mode: "one_off" }),
    });

    return `${baseUrl}?${params.toString()}`;
  };

  /**
   * Handles one-time payment confirmation
   */
  const handleOneTimePayment = async () => {
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: buildReturnUrl(),
      },
    });

    if (error) {
      setErrorMessage(error.message);
      return false;
    }

    return true;
  };

  /**
   * Handles recurring payment setup
   */
  const handleRecurringPayment = async () => {
    if (!stripe || !elements || !recurringMeta) return;

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: buildReturnUrl(true),
      },
    });

    if (error) {
      setErrorMessage(error.message);
      return false;
    }

    return true;
  };

  /**
   * Main form submission handler
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    let success = false;

    try {
      if (mode === "one_off") {
        const result = await handleOneTimePayment();
        success = result === true;
      } else {
        const result = await handleRecurringPayment();
        success = result === true;
      }

      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Form header with back button and donation amount
   */
  const FormHeader = () => (
    <div className="flex justify-between items-center">
      <button
        type="button"
        onClick={onCancel}
        className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
      >
        ← Back
      </button>
      <div className="text-lg font-medium">
        Donating {formatCurrency({ amount, currency })}
      </div>
    </div>
  );

  /**
   * Submit button with loading state
   */
  const SubmitButton = () => (
    <button
      type="submit"
      disabled={isProcessing || !stripe || !elements}
      className="w-full py-3 bg-theme hover:bg-theme-gradient disabled:bg-theme-accent text-white font-medium rounded-lg transition-colors cursor-pointer"
    >
      {isProcessing ? "Processing..." : "Complete Donation"}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="p-5 pb-4 space-y-8">
        <FormHeader />
        <PaymentElement />

        {errorMessage && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <SubmitButton />
      </div>
    </form>
  );
};

/**
 * Main DonationForm component that wraps the Stripe Elements provider
 */
export default function DonationForm({
  clientSecret,
  mode,
  ...props
}: DonationFormProps) {
  // Initialize Stripe with the public key
  const stripePromise = useMemo(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_CONNECT_PUBLIC_KEY!;
    return loadStripe(pk);
  }, []);

  // Get theme color directly from document if available
  const [themeColor, setThemeColor] = useState("#0c8c4d");

  useEffect(() => {
    // Get the computed style of the root element to access CSS variables
    const computedStyle = getComputedStyle(document.documentElement);
    const currentThemeColor =
      computedStyle.getPropertyValue("--theme-color").trim() || "#0c8c4d";
    setThemeColor(currentThemeColor);
  }, []);

  // Configure Stripe Elements appearance
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: themeColor,
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <DonationFormContent mode={mode} {...props} />
    </Elements>
  );
}
