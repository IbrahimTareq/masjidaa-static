"use client";

import { useState } from "react";
import { PaymentMode, RecurringMeta, DonationMeta } from "../types";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { finalizeRecurringDonation } from "../services/payment";

// Initialize Stripe with the public key
export const getStripePromise = () => {
  const pk = process.env.NEXT_PUBLIC_STRIPE_CONNECT_PUBLIC_KEY!;
  return loadStripe(pk);
};

/**
 * Builds the return URL with appropriate query parameters
 */
export const buildReturnUrl = (masjid: string, isRecurring = false) => {
  if (typeof window === 'undefined') return '';
  
  const baseUrl = `${window.location.origin}/${masjid}/donation-result`;
  const params = new URLSearchParams({
    ...(isRecurring ? { mode: "recurring" } : { mode: "one_off" }),
  });

  return `${baseUrl}?${params.toString()}`;
};

interface UseDonationPaymentProps {
  masjid: string;
  mode: PaymentMode;
  recurringMeta?: RecurringMeta;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Hook for managing payment processing with Stripe
 * Handles payment submission and error handling
 * IMPORTANT: Must be used within a Stripe Elements provider
 */
export function useDonationPayment({
  masjid,
  mode,
  recurringMeta,
  onSuccess,
  onCancel,
}: UseDonationPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Handles one-time payment confirmation
   */
  const handleOneTimePayment = async () => {
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: buildReturnUrl(masjid),
      },
    });

    if (error) {
      setErrorMessage(error.message);
      return false;
    }

    return true;
  };

  /**
   * Handles recurring payment setup and finalization
   * This now handles both setup and subscription creation in one flow
   */
  const handleRecurringPayment = async () => {
    if (!stripe || !elements || !recurringMeta) return;

    try {
      // First, set up the payment method
      const { setupIntent, error } = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message);
        return false;
      }

      if (!setupIntent || setupIntent.status !== "succeeded") {
        setErrorMessage("Setup intent did not succeed");
        return false;
      }

      const paymentMethodId = setupIntent.payment_method as string | null;
      if (!paymentMethodId) {
        setErrorMessage("Missing payment method");
        return false;
      }

      // Get donation metadata from session storage
      const donationMetaStr = sessionStorage.getItem("donationMeta");
      if (!donationMetaStr) {
        setErrorMessage("Missing donation metadata");
        return false;
      }

      // Now that we have the payment method, finalize the recurring donation
      const donationMeta = JSON.parse(donationMetaStr) as DonationMeta;
      
      // Call the server action to finalize the recurring donation
      const result = await finalizeRecurringDonation(
        paymentMethodId,
        {
          masjid_id: donationMeta.masjid_id,
          campaign_id: donationMeta.campaign_id,
          campaign_title: donationMeta.campaign_title,
          email: donationMeta.email,
          first_name: donationMeta.first_name,
          last_name: donationMeta.last_name,
          is_anonymous: donationMeta.is_anonymous,
          amount_cents: donationMeta.amount_cents,
          currency: donationMeta.currency,
          fee_covered: donationMeta.fee_covered,
          address: donationMeta.address,
          gift_aid_declared: donationMeta.gift_aid_declared
        },
        {
          frequency: recurringMeta.frequency,
          start_date: recurringMeta.start_date,
          end_date: recurringMeta.end_date,
          stripe_customer_id: recurringMeta.stripe_customer_id,
          stripe_account_id: recurringMeta.stripe_account_id
        }
      );

      if (!result.success) {
        setErrorMessage(result.error || "Failed to create subscription");
        return false;
      }

      // Store subscription ID in donation metadata
      if (result.subscription_id) {
        try {
          const updatedDonationData = { ...donationMeta, subscription_id: result.subscription_id };
          sessionStorage.setItem("donationMeta", JSON.stringify(updatedDonationData));
        } catch (e) {
          console.error("Failed to update donation metadata with subscription ID", e);
        }
      }
      
      // Clean up recurring metadata as it's no longer needed
      sessionStorage.removeItem("recurringMeta");

      // Redirect to the result page
      window.location.href = buildReturnUrl(masjid, true);
      return true;
    } catch (error) {
      console.error("Recurring payment error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
      return false;
    }
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

      if (success && mode === "one_off") {
        onSuccess();
      }
      // For recurring payments, we've already redirected in handleRecurringPayment
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    stripe,
    elements,
    isProcessing,
    errorMessage,
    handleSubmit,
  };
}