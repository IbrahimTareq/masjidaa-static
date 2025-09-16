import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getShortLinkById(
  shortLinkId: string
): Promise<Tables<"short_links"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("short_links")
    .select("*")
    .eq("id", shortLinkId)
    .single();

  if (error) {
    console.error("Error fetching short link", error);
    return null;
  }
  return data;
}