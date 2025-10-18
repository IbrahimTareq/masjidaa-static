"use server";

import { getEventFormById } from "@/lib/server/services/eventForm";
import {
  createEventPaymentIntent,
  submitEventRegistration,
} from "@/lib/server/services/eventFormSubmission";

export async function submitEventRegistrationAction({
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
  return submitEventRegistration(
    formId,
    eventId,
    masjidId,
    firstName,
    lastName,
    email,
    data
  );
}

export async function getEventForm(formId: string) {
  return getEventFormById(formId);
}

export async function createEventPaymentIntentAction({
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
  return createEventPaymentIntent({
    amount,
    currency,
    eventId,
    eventTitle,
    masjidId,
    stripeAccountId,
    email,
    firstName,
    lastName,
  });
}
