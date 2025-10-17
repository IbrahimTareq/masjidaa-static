import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getEventFormById(
  id: string
): Promise<Tables<"event_forms"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_forms")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching event form", error);
    return null;
  }
  return data;
}
