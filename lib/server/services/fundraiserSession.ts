import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getFundraiserSessionById = cache(async (
  id: string
): Promise<Tables<"fundraiser_sessions"> | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fundraiser_sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching fundraiser session", error);
    return null;
  }
  return data;
});

