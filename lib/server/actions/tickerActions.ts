'use server';

import { getMasjidTickerByMasjidId } from "@/lib/server/data/masjidTicker";
import { Tables } from "@/database.types";

export async function getMasjidTicker(masjidId: string): Promise<Tables<"masjid_tickers"> | null> {
  try {
    return await getMasjidTickerByMasjidId(masjidId);
  } catch (error) {
    console.error("Error fetching masjid ticker:", error);
    return null;
  }
}
