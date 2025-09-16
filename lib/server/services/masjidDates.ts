import { createClient } from "@/utils/supabase/server";

export type DisplayDates = {
  gregorian: {
    iso: string;
    formatted: string;
  };
  hijri: {
    iso: string;
    formatted: string;
  };
};

export async function getMasjidDates(masjidId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.functions.invoke(
    `masjid-dates/${masjidId}`,
    {
      method: "GET",
    }
  );

  if (error) throw error;
  return data as DisplayDates;
}
