import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export interface NearbyMasjid extends Tables<"masjids"> {
  distance_meters: number;
  follower_count: number;
  has_prayer_times: boolean;
}

interface NearbyMasjidRpcResult {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  city: string;
  latitude: number;
  longitude: number;
  dist_meters: number;
}

const METERS_PER_KM = 1000;

/**
 * Find nearby masjids using PostGIS spatial queries.
 * Uses the nearby_masjids RPC function for efficient distance-based filtering.
 * Returns distance in meters - use formatDistance() utility for display.
 */
export async function getNearbyMasjids(
  masjidId: string,
  radiusKm: number = 50,
  limit: number = 10
): Promise<NearbyMasjid[]> {
  const supabase = await createClient();

  // Get current masjid's coordinates
  const { data: currentMasjid, error: masjidError } = await supabase
    .from("masjids")
    .select("latitude, longitude")
    .eq("id", masjidId)
    .maybeSingle();

  if (masjidError || !currentMasjid) {
    console.error("Error fetching current masjid:", masjidError);
    return [];
  }

  const { latitude, longitude } = currentMasjid;

  // Validate coordinates
  if (!latitude || !longitude || (latitude === 0 && longitude === 0)) {
    return [];
  }

  // Call the nearby_masjids RPC function
  const { data: nearbyResults, error: nearbyError } = await supabase.rpc(
    "nearby_masjids",
    {
      lat: latitude,
      long: longitude,
      max_distance_meters: radiusKm * METERS_PER_KM,
      result_limit: limit + 1,
    }
  );

  if (nearbyError) {
    console.error("Error fetching nearby masjids:", nearbyError);
    return [];
  }

  if (!nearbyResults?.length) {
    return [];
  }

  // Filter out current masjid and apply limit
  const filteredResults = (nearbyResults as NearbyMasjidRpcResult[])
    .filter((m) => m.id !== masjidId)
    .slice(0, limit);

  if (!filteredResults.length) {
    return [];
  }

  const masjidIds = filteredResults.map((m) => m.id);

  // Fetch full masjid data, follower counts, and prayer times in parallel
  const [fullMasjidResult, followerResult, iqamahResult] = await Promise.all([
    supabase.from("masjids").select("*").in("id", masjidIds),
    supabase.from("masjid_followers").select("masjid_id").in("masjid_id", masjidIds),
    supabase.from("masjid_iqamah_times").select("masjid_id").in("masjid_id", masjidIds),
  ]);

  if (fullMasjidResult.error || !fullMasjidResult.data) {
    console.error("Error fetching full masjid data:", fullMasjidResult.error);
    return [];
  }

  // Create lookup maps
  const distanceMap = new Map(filteredResults.map((m) => [m.id, m.dist_meters]));

  const followerCountMap = (followerResult.data || []).reduce(
    (acc, f) => {
      acc[f.masjid_id] = (acc[f.masjid_id] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const hasPrayerTimesSet = new Set(
    (iqamahResult.data || []).map((it) => it.masjid_id)
  );

  // Combine data and sort by distance
  return fullMasjidResult.data
    .map((masjid) => ({
      ...masjid,
      distance_meters: distanceMap.get(masjid.id) || 0,
      follower_count: followerCountMap[masjid.id] || 0,
      has_prayer_times: hasPrayerTimesSet.has(masjid.id),
    }))
    .sort((a, b) => a.distance_meters - b.distance_meters);
}
