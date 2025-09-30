"use server";

/**
 * Creates a one-time payment intent
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
  isAnonymous: boolean
): Promise<{ client_secret: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_API}/stripe-donation-combined`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "single",
        amount,
        currency,
        campaign_id: campaignId,
        campaign_title: campaignTitle,
        masjid_id: masjidId,
        stripe_account_id: stripeAccountId,
        email,
        first_name: firstName,
        last_name: lastName,
        is_anonymous: isAnonymous,
      }),
    }
  );
  
  if (!response.ok) {
    throw new Error("Failed to create payment intent");
  }
  
  return response.json();
}

/**
 * Creates a recurring payment setup intent
 */
export async function createRecurringSetupIntent(
  email: string,
  stripeAccountId: string
): Promise<{ client_secret: string; customer_id: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_API}/stripe-donation-combined`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "recurring.setup",
        email,
        stripe_account_id: stripeAccountId,
      }),
    }
  );
  
  if (!response.ok) {
    throw new Error("Failed to create setup intent");
  }
  
  return response.json();
}
