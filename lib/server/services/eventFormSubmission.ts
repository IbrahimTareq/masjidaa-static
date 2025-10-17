import { createClient } from "@/utils/supabase/server";

export async function submitEventFormSubmission(
  formId: string,
  eventId: string,
  masjidId: string,
  firstName: string,
  lastName: string,
  email: string,
  data: Record<string, any>
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("event_form_submissions")
    .insert({
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