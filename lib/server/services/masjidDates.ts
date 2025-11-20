import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

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

export const getMasjidDates = cache(async (masjidId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.functions.invoke(
    `masjid-dates/${masjidId}`,
    {
      method: "GET",
    }
  );

  if (error) throw error;
  return data as DisplayDates;
});
