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
}

export type PaymentStatus = "success" | "processing" | "failed" | "loading";

interface PaymentStatusResult {
  status: PaymentStatus;
  isLoading: boolean;
  error?: string;
}

export const usePaymentStatus = (): PaymentStatusResult => {
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processPayment = async () => {
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

        // Handle recurring payment
        if (siSecret || mode === "recurring") {
          const { setupIntent, error: siError } =
            await stripe.retrieveSetupIntent(siSecret!);

          if (siError) {
            setStatus("failed");
            setError(siError.message || "Setup lookup failed");
            return;
          }

          if (!setupIntent || setupIntent.status !== "succeeded") {
            setStatus("failed");
            setError("Setup intent did not succeed");
            return;
          }

          const pmId = setupIntent.payment_method as string | null;
          if (!pmId) {
            setStatus("failed");
            setError("Missing payment method");
            return;
          }

          // Get recurring metadata from session storage
          const recurringMeta = sessionStorage.getItem("recurringMeta");
          if (!recurringMeta) {
            setStatus("failed");
            setError("Missing recurring metadata");
            return;
          }

          const donationMeta = sessionStorage.getItem("donationMeta");
          if (!donationMeta) {
            setStatus("failed");
            setError("Missing donation metadata");
            return;
          }

          const donationMetaParsed = JSON.parse(donationMeta) as DonationMeta;
          const recurringMetaParsed = JSON.parse(
            recurringMeta
          ) as RecurringMeta;

          // Start recurring donation
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_API}/stripe-donation-combined`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "recurring.start",
                masjid_id: donationMetaParsed.masjid_id,
                campaign_id: donationMetaParsed.campaign_id,
                stripe_account_id: recurringMetaParsed.stripe_account_id,
                email: donationMetaParsed.email,
                first_name: donationMetaParsed.first_name,
                last_name: donationMetaParsed.last_name,
                is_anonymous: donationMetaParsed.is_anonymous,
                stripe_customer_id: recurringMetaParsed.stripe_customer_id,
                stripe_payment_method_id: pmId,
                currency: donationMetaParsed.currency,
                amount_cents: donationMetaParsed.amount_cents,
                frequency: recurringMetaParsed.frequency,
                start_date: recurringMetaParsed.start_date,
                end_date: recurringMetaParsed.end_date,
                charge_now: true,
              }),
            }
          );

          const json = await res.json();
          if (!res.ok) {
            setStatus("failed");
            setError((json as { error?: string })?.error || "Could not start recurring donation");
            return;
          }

          setStatus("success");
          sessionStorage.removeItem("recurringMeta");
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

    processPayment();
  }, []);

  return { status: "success", isLoading, error };
};

export default usePaymentStatus;
