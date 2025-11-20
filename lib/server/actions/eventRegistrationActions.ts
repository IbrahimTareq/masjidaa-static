"use server";

import { getEventFormById } from "@/lib/server/services/eventForm";
import {
  createEventPaymentIntent,
  submitEventRegistration,
  updateEventFormSubmissionStatus,
} from "@/lib/server/services/eventFormSubmission";
import { getMasjidEventEnrollmentStatus } from "@/lib/server/services/masjidEvent";

export async function submitEventRegistrationAction({
  formId,
  eventId,
  masjidId,
  firstName,
  lastName,
  email,
  quantity,
  data,
  status = "registered",
}: {
  formId: string;
  eventId: string;
  masjidId: string;
  firstName: string;
  lastName: string;
  email: string;
  data: Record<string, any>;
  quantity: number;
  status?: "registered" | "payment_pending";
}) {
  return submitEventRegistration(
    formId,
    eventId,
    masjidId,
    firstName,
    lastName,
    email,
    quantity,
    data,
    status
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
  quantity,
  formSubmissionId,
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
  quantity: number;
  formSubmissionId: string;
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
    quantity,
    formSubmissionId,
  });
}

export async function updateEventFormSubmissionStatusAction(
  submissionId: string,
  status: "confirmed" | "cancelled" | "registered" | "payment_pending"
) {
  return updateEventFormSubmissionStatus(submissionId, status);
}

export async function getEventEnrollmentStatusAction(eventId: string) {
  return getMasjidEventEnrollmentStatus(eventId);
}
