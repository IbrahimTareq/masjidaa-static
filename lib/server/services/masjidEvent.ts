import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidEventById(
  id: string
): Promise<Tables<"events"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching masjid event", error);
    return null;
  }
  return data;
}

export async function getMasjidEventEnrollmentStatus(
  eventId: string
): Promise<{ isFull: boolean; currentEnrollments: number; limit: number | null }> {
  const supabase = await createClient();
  
  // First, get the event to check if it has an enrollment limit
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("enrolment_limit")
    .eq("id", eventId)
    .maybeSingle();
    
  if (eventError) {
    console.error("Error fetching event enrollment limit", eventError);
    return { isFull: false, currentEnrollments: 0, limit: null };
  }
  
  // If there's no enrollment limit, the event can't be full
  if (!event?.enrolment_limit) {
    return { isFull: false, currentEnrollments: 0, limit: null };
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
    return { isFull: false, currentEnrollments: 0, limit: event.enrolment_limit };
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
  const isFull = currentEnrollments >= event.enrolment_limit;
  
  return { 
    isFull, 
    currentEnrollments, 
    limit: event.enrolment_limit 
  };
}