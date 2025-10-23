"use client";

import { PaymentMode, RecurringMeta } from "@/donation/src/types";
import { formatCurrency } from "@/utils/currency";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import {
  getStripePromise,
  useDonationPayment,
} from "../hooks/useDonationPayment";
import { DonationButton } from "./ui";

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
  isRecurring?: boolean; // Added to indicate if this is a recurring donation
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
  isRecurring,
}) => {
  const { stripe, elements, isProcessing, errorMessage, handleSubmit } =
    useDonationPayment({
      masjid,
      mode,
      recurringMeta,
      onSuccess,
      onCancel,
    });

  // Determine button text based on whether this is a recurring donation
  const buttonText = isRecurring
    ? "Set Up Recurring Donation"
    : "Complete Donation";

  const frequencyText = recurringMeta?.frequency;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="p-5 pb-4 space-y-8">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <div className="text-lg font-medium">
            {isRecurring ? "Setting up " : "Donating "}
            {formatCurrency({ amount, currency })}
            {isRecurring && ` ${frequencyText}`}
          </div>
        </div>

        <PaymentElement />

        {errorMessage && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <DonationButton
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          isLoading={isProcessing}
          fullWidth
        >
          {buttonText}
        </DonationButton>
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
  isRecurring,
  ...props
}: DonationFormProps) {
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
    <Elements stripe={getStripePromise()} options={options}>
      <DonationFormContent mode={mode} isRecurring={isRecurring} {...props} />
    </Elements>
  );
}
