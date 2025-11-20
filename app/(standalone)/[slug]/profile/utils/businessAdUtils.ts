import { ApprovedBusinessAd } from "../types";

/**
 * Function to inject business ads into content arrays at regular intervals
 * @param content Array of content items (announcements, events, campaigns)
 * @param businessAds Array of approved business ads
 * @param interval Interval at which to inject ads (default: 3)
 * @returns Array with business ads injected at regular intervals
 */
export function injectBusinessAds<T>(
  content: T[],
  businessAds: ApprovedBusinessAd[],
  interval: number = 3
): (T | { type: "business_ad"; data: ApprovedBusinessAd })[] {
  if (businessAds.length === 0) return content;

  const result: (T | { type: "business_ad"; data: ApprovedBusinessAd })[] = [];
  let adIndex = 0;

  content.forEach((item, index) => {
    result.push(item);

    // Insert ad after every 'interval' items, but not after the last item
    if ((index + 1) % interval === 0 && index < content.length - 1 && adIndex < businessAds.length) {
      result.push({
        type: "business_ad",
        data: businessAds[adIndex % businessAds.length]
      });
      adIndex++;
    }
  });

  return result;
}