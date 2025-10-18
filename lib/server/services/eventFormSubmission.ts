import { createClient } from "@/utils/supabase/server";

export async function submitEventRegistration(
  formId: string,
  eventId: string,
  masjidId: string,
  firstName: string,
  lastName: string,
  email: string,
  data: Record<string, any>
) {
  const supabase = await createClient();
  const { error } = await supabase.from("event_form_submissions").insert({
    form_id: formId,
    event_id: eventId,
    masjid_id: masjidId,
    first_name: firstName,
    last_name: lastName,
    email: email,
    data: data,
  });

  if (error) {
    console.error("Error submitting event form submission", error);
    return { success: false, error: "Failed to submit event form submission" };
  }
  return { success: true };
}

export async function createEventPaymentIntent({
  amount,
  currency,
  eventId,
  eventTitle,
  masjidId,
  stripeAccountId,
  email,
  firstName,
  lastName,
}: {
  amount: number;
  currency: string;
  eventId: string;
  eventTitle: string;
  masjidId: string;
  stripeAccountId: string;
  email: string;
  firstName: string;
  lastName: string;
}): Promise<{ client_secret: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.functions.invoke(
    "stripe-event-payment",
    {
      method: "POST",
      body: {
        amount,
        currency,
        event_id: eventId,
        event_title: eventTitle,
        masjid_id: masjidId,
        stripe_account_id: stripeAccountId,
        email,
        first_name: firstName,
        last_name: lastName,
      },
    }
  );

  if (error) throw error;
  return data as { client_secret: string };
}
