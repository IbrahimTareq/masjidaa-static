"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Creates a one-time payment intent
 * Server-side implementation to keep API calls secure
 */
export async function createSinglePaymentIntent(
  amount: number,
  currency: string,
  campaignId: string,
  campaignTitle: string,
  masjidId: string,
  stripeAccountId: string,
  email: string,
  firstName: string,
  lastName: string,
  isAnonymous: boolean,
  feeCovered: boolean,
  giftAidDeclared?: boolean,
  address?: string
): Promise<{ client_secret: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.functions.invoke(
    "stripe-donation-single",
    {
      method: "POST",
      body: {
        amount,
        currency,
        campaign_id: campaignId,
        campaign_title: campaignTitle,
        masjid_id: masjidId,
        stripe_account_id: stripeAccountId,
        email,
        first_name: firstName,
        last_name: lastName,
        address: address,
        is_anonymous: isAnonymous,
        fee_covered: feeCovered,
        gift_aid_declared: giftAidDeclared,
      },
    }
  );

  if (error) {
    throw new Error("Failed to create payment intent");
  }

  return data as { client_secret: string };
}

/**
 * Creates a recurring payment setup intent
 * Server-side implementation to keep API calls secure
 */
export async function createRecurringSetupIntent(
  email: string,
  stripeAccountId: string
): Promise<{ client_secret: string; customer_id: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.functions.invoke(
    "stripe-donation-recurring?action=setup",
    {
      method: "POST",
      body: {
        email,
        stripe_account_id: stripeAccountId,
      },
    }
  );

  if (error) {
    throw new Error("Failed to create setup intent");
  }

  return data as { client_secret: string; customer_id: string };
}

/**
 * Finalizes a recurring donation by creating a subscription with the saved payment method
 * This server action handles the second part of the recurring donation flow
 */
export async function finalizeRecurringDonation(
  paymentMethodId: string,
  donationData: {
    masjid_id: string;
    campaign_id: string;
    campaign_title: string;
    email: string;
    first_name: string;
    last_name: string;
    is_anonymous: boolean;
    amount_cents: number;
    currency: string;
    fee_covered: boolean;
    address?: string;
    gift_aid_declared?: boolean;
  },
  recurringData: {
    frequency: "daily" | "weekly" | "monthly";
    start_date?: string;
    end_date?: string;
    stripe_customer_id: string;
    stripe_account_id: string;
  }
): Promise<{
  success: boolean;
  subscription_id?: string;
  error?: string;
  details?: Record<string, any>;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.functions.invoke(
      "stripe-donation-recurring?action=start",
      {
        method: "POST",
        body: {
          masjid_id: donationData.masjid_id,
          campaign_title: donationData.campaign_title,
          campaign_id: donationData.campaign_id,
          stripe_account_id: recurringData.stripe_account_id,
          email: donationData.email,
          first_name: donationData.first_name,
          last_name: donationData.last_name,
          address: donationData.address,
          gift_aid_declared: donationData.gift_aid_declared,
          is_anonymous: donationData.is_anonymous,
          stripe_customer_id: recurringData.stripe_customer_id,
          stripe_payment_method_id: paymentMethodId,
          currency: donationData.currency,
          amount_cents: donationData.amount_cents,
          fee_covered: donationData.fee_covered,
          frequency: recurringData.frequency,
          start_date: recurringData.start_date,
          end_date: recurringData.end_date,
          charge_now: true,
        },
      }
    );

    if (error) {
      return {
        success: false,
        error: error.message || "Could not start recurring donation",
        details: {
          error: error,
        },
      };
    }

    const responseData = data as { error?: string; subscription_id?: string };

    return {
      success: true,
      subscription_id: responseData.subscription_id,
    };
  } catch (error) {
    console.error("Error finalizing recurring donation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
      details: {
        error: "exception",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
    };
  }
}
