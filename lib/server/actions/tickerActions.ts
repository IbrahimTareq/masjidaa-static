"use server";

import { getMasjidTickerByMasjidId } from "@/lib/server/services/masjidTicker";
import { Tables } from "@/database.types";

export async function getMasjidTicker(
  masjidId: string
): Promise<Tables<"masjid_tickers"> | null> {
  return getMasjidTickerByMasjidId(masjidId);
}
