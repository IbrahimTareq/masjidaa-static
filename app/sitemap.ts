import { getMasjids } from "@/lib/server/services/masjid";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const masjids = await getMasjids();
  const sitemap = masjids?.map((masjid) => ({
    url: `${DOMAIN_NAME}/${masjid.slug}`,
    lastModified: new Date(),
  }));

  return sitemap ?? [];
}
