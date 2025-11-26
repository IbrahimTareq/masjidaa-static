import type { Database } from "@/database.types";

type CountryCode = Database["public"]["Enums"]["supported_country_code"];

const METERS_PER_KM = 1000;
const METERS_PER_MILE = 1609.34;

// Countries that use imperial system (miles) for road distances
const IMPERIAL_COUNTRIES: CountryCode[] = ["US", "GB"];

/**
 * Check if a country uses the imperial system for distances
 */
export function usesImperialSystem(countryCode: CountryCode): boolean {
  return IMPERIAL_COUNTRIES.includes(countryCode);
}

/**
 * Format distance in meters to the appropriate unit based on country
 * Returns an object with the formatted value and unit
 */
export function formatDistance(
  meters: number,
  countryCode: CountryCode
): { value: number; unit: "km" | "mi"; label: string } {
  const isImperial = usesImperialSystem(countryCode);

  if (isImperial) {
    const miles = Math.round((meters / METERS_PER_MILE) * 10) / 10;
    return { value: miles, unit: "mi", label: `${miles} mi` };
  }

  const km = Math.round((meters / METERS_PER_KM) * 10) / 10;
  return { value: km, unit: "km", label: `${km} km` };
}

/**
 * Get the display string for distance (e.g., "5.2 km away" or "3.1 mi away")
 */
export function getDistanceLabel(
  meters: number,
  countryCode: CountryCode
): string {
  const { label } = formatDistance(meters, countryCode);
  return `${label} away`;
}

