import { createClient } from "@/utils/supabase/server";

export async function getMasjidEventShortCodeById(
  eventId: string
): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(
      `
        short_links:short_link_id (
          short_code
        )
      `
    )
    .eq("id", eventId)
    .single();

  if (error) {
    console.error("Error fetching short code for event:", error);
    return null;
  }

  return data?.short_links?.[0]?.short_code ?? null;
}
