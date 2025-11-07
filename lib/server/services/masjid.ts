import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getMasjidById = cache(async (
  id: string
): Promise<Tables<"masjids"> | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjids")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching masjid", error);
    return null;
  }
  return data;
});

export const getMasjidBySlug = cache(async (
  slug: string
): Promise<Tables<"masjids"> | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjids")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching masjid", error);
    return null;
  }
  return data;
});

export const getMasjids = cache(async (): Promise<Tables<"masjids">[] | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjids")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching masjids", error);
    return null;
  }
  return data;
});
