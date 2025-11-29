import SiteWrapper from "@/components/client/ui/SiteWrapper";
import ThemeWrapper from "@/components/server/ThemeWrapper";
import { DateTimeProvider } from "@/context/dateTimeContext";
import { LocationProvider } from "@/context/locationContext";
import { MasjidProvider } from "@/context/masjidContext";
import { MasjidSiteSettingsProvider } from "@/context/masjidSiteSettingsContext";
import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getMasjidLocationByMasjidId } from "@/lib/server/services/masjidLocation";
import { getPrayerSettingsByMasjidId } from "@/lib/server/services/masjidPrayerSettings";
import { getMasjidSiteSettingsByMasjidId } from "@/lib/server/services/masjidSiteSettings";
import { getMasjidSocialsByMasjidId } from "@/lib/server/services/masjidSocials";
import React from "react";

export default async function MasjidLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const masjid = await getMasjidBySlug(slug);

  // Parallelize related data fetching
  const [prayerSettings, siteSettings, socials, location] = masjid
    ? await Promise.all([
        getPrayerSettingsByMasjidId(masjid.id),
        getMasjidSiteSettingsByMasjidId(masjid.id),
        getMasjidSocialsByMasjidId(masjid.id),
        getMasjidLocationByMasjidId(masjid.id),
      ])
    : [null, null, null, null];

  return (
    <MasjidProvider masjid={masjid}>
      <LocationProvider location={location}>
        <MasjidSiteSettingsProvider siteSettings={siteSettings}>
          <DateTimeProvider settings={prayerSettings}>
            <ThemeWrapper id={masjid?.id || ""}>
              <SiteWrapper socials={socials}>{children}</SiteWrapper>
            </ThemeWrapper>
          </DateTimeProvider>
        </MasjidSiteSettingsProvider>
      </LocationProvider>
    </MasjidProvider>
  );
}
