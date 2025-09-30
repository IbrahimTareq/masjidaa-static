import { getMasjids } from "@/lib/server/services/masjid";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import type { MetadataRoute } from "next";

// These masjids are excluded from the sitemap
const excludedMasjids = ["test-masjid"];

// This is the main sitemap that combines both static pages and dynamic masjid pages
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const masjids = await getMasjids();

  const staticUrls = [
    {
      url: DOMAIN_NAME,
      lastModified: new Date(),
    },
    {
      url: `${DOMAIN_NAME}/features`,
      lastModified: new Date(),
    },
    {
      url: `${DOMAIN_NAME}/pricing`,
      lastModified: new Date(),
    },
    {
      url: `${DOMAIN_NAME}/contact`,
      lastModified: new Date(),
    },
  ];

  // Generate masjid URLs
  const masjidUrls =
    masjids
      ?.filter((masjid) => !excludedMasjids.includes(masjid.slug))
      .map((masjid) => ({
        url: `${DOMAIN_NAME}/${masjid.slug}`,
        lastModified: new Date(),
      })) ?? [];

  return [...staticUrls, ...masjidUrls];
}
