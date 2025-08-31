"use server";

import { getServerPrayerData } from "@/lib/server/services/prayer";
import { FormattedData } from "@/lib/server/services/prayer";

export async function getPrayerData(masjidId: string): Promise<FormattedData | null> {
  try {
    const prayerData = await getServerPrayerData(masjidId);
    return prayerData;
  } catch (error) {
    console.error("Error fetching prayer data in server action:", error);
    return null;
  }
}
