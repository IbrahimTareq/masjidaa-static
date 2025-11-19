import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export interface NearbyMasjid extends Tables<"masjids"> {
  distance_miles: number;
  follower_count: number;
  has_prayer_times: boolean;
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in miles
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getNearbyMasjids(
  masjidId: string,
  radiusMiles: number = 5,
  limit: number = 10
): Promise<NearbyMasjid[]> {
  const supabase = await createClient();

  // TODO: Once latitude/longitude fields are added to the masjids table,
  // replace this with actual distance-based calculation using the Haversine formula

  // For now, return dummy data: just fetch other active masjids in the same region/city
  const { data: currentMasjid, error: masjidError } = await supabase
    .from("masjids")
    .select("*")
    .eq("id", masjidId)
    .maybeSingle();

  if (masjidError || !currentMasjid) {
    console.error("Error fetching current masjid", masjidError);
    return [];
  }

  // Get other masjids in the same city/region as a proxy for "nearby"
  const { data: allMasjids, error: masjidsError } = await supabase
    .from("masjids")
    .select("*")
    .neq("id", masjidId)
    .eq("active", true)
    .or(`city.eq.${currentMasjid.city},region.eq.${currentMasjid.region}`)
    .limit(limit);

  if (masjidsError || !allMasjids) {
    console.error("Error fetching nearby masjids", masjidsError);
    return [];
  }

  const masjidIds = allMasjids.map((m) => m.id);

  if (masjidIds.length === 0) {
    return [];
  }

  // Get follower counts for these masjids
  const { data: followerCounts } = await supabase
    .from("masjid_followers")
    .select("masjid_id")
    .in("masjid_id", masjidIds);

  const followerCountMap = (followerCounts || []).reduce((acc, f) => {
    acc[f.masjid_id] = (acc[f.masjid_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Check if they have prayer times (iqamah times)
  const { data: iqamahTimes } = await supabase
    .from("masjid_iqamah_times")
    .select("masjid_id")
    .in("masjid_id", masjidIds);

  const hasPrayerTimesSet = new Set(
    (iqamahTimes || []).map((it) => it.masjid_id)
  );

  // Return masjids with dummy distance data (1-5 miles range)
  return allMasjids.map((masjid, index) => ({
    ...masjid,
    distance_miles: Math.round((1 + (index * 0.8)) * 10) / 10, // Generate dummy distances: 1.0, 1.8, 2.6, 3.4, etc.
    follower_count: followerCountMap[masjid.id] || 0,
    has_prayer_times: hasPrayerTimesSet.has(masjid.id),
  }));
}

