import { createClient } from "@/utils/supabase/server";

export async function getMasjidFollowerCount(
  masjidId: string
): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("masjid_followers")
    .select("id", { count: "exact", head: true })
    .eq("masjid_id", masjidId);

  if (error) {
    console.error("Error fetching masjid follower count", error);
    return 0;
  }
  return count ?? 0;
}


