import { createClient } from "@/utils/supabase/server";

// Helper function to validate enrollment availability
async function validateEnrollmentAvailability(
  eventId: string,
  quantity: number
): Promise<{ available: boolean; error?: string }> {
  const supabase = await createClient();

  // Check if the event has an enrollment limit
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("enrolment_limit")
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) {
    console.error("Error fetching event", eventError);
    return { available: false, error: "Failed to fetch event details" };
  }

  // If no enrollment limit, always available
  if (!event?.enrolment_limit) {
    return { available: true };
  }

  // Sum the quantity field to get total enrollments (not just submission count)
  const { data: submissions, error: submissionsError } = await supabase
    .from("event_form_submissions")
    .select("quantity")
    .eq("event_id", eventId);

  if (submissionsError) {
    console.error("Error fetching event form submissions", submissionsError);
    return { available: false, error: "Failed to verify enrollment availability" };
  }

  // Sum all quantities to get total number of people enrolled
  const currentEnrollments = submissions?.reduce((sum, sub) => sum + (sub.quantity || 0), 0) || 0;
  const availableSlots = event.enrolment_limit - currentEnrollments;

  // Check if there's enough space for the requested quantity
  if (availableSlots < quantity) {
    const error =
      availableSlots > 0
        ? `Only ${availableSlots} spot${availableSlots !== 1 ? "s" : ""} remaining. Please adjust your quantity.`
        : "This event is now full. Enrollments are closed.";
    return { available: false, error };
  }

  return { available: true };
}

export async function submitEventRegistration(
  formId: string,
  eventId: string,
  masjidId: string,
  firstName: string,
  lastName: string,
  email: string,
  quantity: number,
  data: Record<string, any>
) {
  // Validate enrollment availability
  const validation = await validateEnrollmentAvailability(eventId, quantity);
  if (!validation.available) {
    return { success: false, error: validation.error };
  }

  // Submit the registration
  const supabase = await createClient();
  const { error } = await supabase.from("event_form_submissions").insert({
    form_id: formId,
    event_id: eventId,
    masjid_id: masjidId,
    first_name: firstName,
    last_name: lastName,
    email: email,
    quantity: quantity,
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
  quantity,
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
}): Promise<{ client_secret: string }> {
  // Validate enrollment availability
  const validation = await validateEnrollmentAvailability(eventId, quantity);
  if (!validation.available) {
    throw new Error(validation.error);
  }

  // Create payment intent
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
        quantity: quantity,
      },
    }
  );

  if (error) throw error;
  return data as { client_secret: string };
}
