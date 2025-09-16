"use server";

import { getServerPrayerData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";

export async function getPrayerData(
  masjidId: string
): Promise<FormattedData | null> {
  const prayerData = await getServerPrayerData(masjidId);
  return prayerData;
}
