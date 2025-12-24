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
  // Only count registered submissions and payment_pending submissions that haven't expired
  const now = new Date().toISOString();
  const { data: submissions, error: submissionsError } = await supabase
    .from("event_form_submissions")
    .select("quantity, status, session_expires_at")
    .eq("event_id", eventId);

  if (submissionsError) {
    console.error("Error fetching event form submissions", submissionsError);
    return { available: false, error: "Failed to verify enrollment availability" };
  }

  // Filter out expired payment_pending submissions
  const activeSubmissions = submissions?.filter(sub => {
    if (sub.status === "payment_pending" && sub.session_expires_at) {
      return new Date(sub.session_expires_at) > new Date(now);
    }
    // Include registered and confirmed submissions
    return sub.status === "registered" || sub.status === "confirmed";
  }) || [];

  // Sum all quantities to get total number of people enrolled
  const currentEnrollments = activeSubmissions.reduce((sum, sub) => sum + (sub.quantity || 0), 0);
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
  data: Record<string, any>,
  status: "registered" | "payment_pending" = "registered"
) {
  // Validate enrollment availability
  const validation = await validateEnrollmentAvailability(eventId, quantity);
  if (!validation.available) {
    return { success: false, error: validation.error };
  }

  // Set session expiration time (30 minutes from now) for payment_pending submissions
  const sessionExpiresAt = status === "payment_pending"
    ? new Date(Date.now() + 30 * 60 * 1000).toISOString()
    : null;

  // Submit the registration
  const supabase = await createClient();
  const { data: submission, error } = await supabase
    .from("event_form_submissions")
    .insert({
      form_id: formId,
      event_id: eventId,
      masjid_id: masjidId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      quantity: quantity,
      data: data,
      status: status,
      session_expires_at: sessionExpiresAt,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error submitting event form submission", error);
    return { success: false, error: "Failed to submit event form submission" };
  }
  return { success: true, submissionId: submission.id };
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
        form_submission_id: formSubmissionId,
      },
    }
  );

  if (error) throw error;
  return data as { client_secret: string };
}

export async function updateEventFormSubmissionStatus(
  submissionId: string,
  status: "confirmed" | "cancelled" | "registered" | "payment_pending"
) {
  const supabase = await createClient();
  
  // Clear session_expires_at when status changes to registered (payment successful)
  const updateData: { status: typeof status; session_expires_at?: null } = { status };
  if (status === "registered") {
    updateData.session_expires_at = null;
  }
  
  const { error } = await supabase
    .from("event_form_submissions")
    .update(updateData)
    .eq("id", submissionId);

  if (error) {
    console.error("Error updating event form submission status", error);
    return { success: false, error: "Failed to update submission status" };
  }
  return { success: true };
}
