import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getBookingFormById(
  id: string
): Promise<Tables<"booking_forms"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking_forms")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching booking form", error);
    return null;
  }
  return data;
}

