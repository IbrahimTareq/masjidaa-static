import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/database.types";

export const getBookingTypesByMasjidId = cache(async (
  masjidId: string
): Promise<Tables<"booking_types">[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking_types")
    .select("*")
    .eq("masjid_id", masjidId)
    .order("name");

  if (error) {
    console.error("Error fetching booking types:", error);
    return [];
  }
  return data || [];
});

export const getActiveBookingTypesByMasjidId = cache(async (
  masjidId: string
): Promise<Tables<"booking_types">[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking_types")
    .select("*")
    .eq("masjid_id", masjidId)
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching active booking types:", error);
    return [];
  }
  return data || [];
});

export const getBookingTypeById = cache(async (
  id: string
): Promise<Tables<"booking_types"> | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking_types")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching booking type:", error);
    return null;
  }
  return data;
});

export const getActiveBookingTypesByMasjidSlug = cache(async (
  slug: string
): Promise<Tables<"booking_types">[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking_types")
    .select(`
      *,
      masjids!inner(slug)
    `)
    .eq("masjids.slug", slug)
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching active booking types by slug:", error);
    return [];
  }
  return data || [];
});