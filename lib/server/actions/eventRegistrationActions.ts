"use server";

import { submitEventFormSubmission } from "@/lib/server/services/eventFormSubmission";
import { getEventFormById } from "@/lib/server/services/eventForm";

export async function submitEventRegistration({
  formId,
  eventId,
  masjidId,
  firstName,
  lastName,
  email,
  data,
}: {
  formId: string;
  eventId: string;
  masjidId: string;
  firstName: string;
  lastName: string;
  email: string;
  data: Record<string, any>;
}) {
  return submitEventFormSubmission(formId, eventId, masjidId, firstName, lastName, email, data);
}

export async function getEventForm(formId: string) {
  return getEventFormById(formId);
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_API}/stripe-event-payment`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        currency,
        event_id: eventId,
        event_title: eventTitle,
        masjid_id: masjidId,
        stripe_account_id: stripeAccountId,
        email,
        first_name: firstName,
        last_name: lastName,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create payment intent");
  }

  return response.json();
}
