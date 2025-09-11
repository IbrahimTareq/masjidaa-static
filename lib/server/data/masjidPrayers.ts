import { createClient } from "@/utils/supabase/server";

export async function getMasjidPrayers(masjidId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.functions.invoke(
    `masjid-prayers/${masjidId}`,
    {
      method: "GET",
    }
  );

  if (error) {
    console.error("Error fetching masjid prayers", error);
    return null;
  }
  return data;
}
