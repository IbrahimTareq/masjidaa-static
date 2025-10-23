import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export interface RecurringMeta {
  frequency: "daily" | "weekly" | "monthly";
  start_date?: string;
  end_date?: string;
  stripe_customer_id: string;
  stripe_account_id: string;
}

export interface DonationMeta {
  masjid_id: string;
  campaign_id: string;
  campaign_title: string;
  email: string;
  first_name: string;
  last_name: string;
  is_anonymous: boolean;
  amount_cents: number;
  currency: string;
  short_link?: string;
  address?: string;
  gift_aid_declared?: boolean;
}

export type PaymentStatus = "success" | "processing" | "failed" | "loading";

interface PaymentStatusResult {
  status: PaymentStatus;
  isLoading: boolean;
  error?: string;
}

/**
 * Hook to check the status of a payment or setup intent
 * Focused solely on payment status verification
 */
export const usePaymentStatus = (): PaymentStatusResult => {
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        setIsLoading(true);

        // Initialize Stripe
        const pk = process.env.NEXT_PUBLIC_STRIPE_CONNECT_PUBLIC_KEY!;
        const stripe = await loadStripe(pk);
        if (!stripe) {
          setStatus("failed");
          setError("Stripe failed to load");
          return;
        }

        // Get payment parameters from URL
        const qs = new URLSearchParams(window.location.search);
        const siSecret = qs.get("setup_intent_client_secret");
        const piSecret = qs.get("payment_intent_client_secret");
        const mode = qs.get("mode");

        // Handle one-time payment
        if (piSecret) {
          const { paymentIntent, error: piError } =
            await stripe.retrievePaymentIntent(piSecret);

          if (piError) {
            setStatus("failed");
            setError(piError.message || "Payment lookup failed");
            return;
          }

          if (paymentIntent?.status === "succeeded") {
            setStatus("success");
          } else if (paymentIntent?.status === "processing") {
            setStatus("processing");
          } else {
            setStatus("failed");
            setError(
              paymentIntent?.last_payment_error?.message || "Payment failed"
            );
          }
          return;
        }

        // Handle recurring payment setup intent
        // For recurring payments, we assume success if we've reached this page
        // since the actual subscription creation happens before redirect
        if (siSecret || mode === "recurring") {
          setStatus("success");
          return;
        }

        // No payment intent or setup intent found
        setStatus("failed");
        setError("No payment information found");
      } catch (error) {
        console.error("Payment processing error:", error);
        setStatus("failed");
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, []);

  return { 
    status, 
    isLoading, 
    error
  };
};

export default usePaymentStatus;