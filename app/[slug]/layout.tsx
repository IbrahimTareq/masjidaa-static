import SiteWrapper from "@/components/client/ui/SiteWrapper";
import ThemeClientWrapper from "@/components/client/ui/ThemeClientWrapper";
import ThemeWrapper from "@/components/server/ThemeWrapper";
import { DateTimeProvider } from "@/context/dateTimeContext";
import { MasjidProvider } from "@/context/masjidContext";
import { MasjidSiteSettingsProvider } from "@/context/masjidSiteSettingsContext";
import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getPrayerSettingsByMasjidId } from "@/lib/server/services/masjidPrayerSettings";
import { getMasjidSiteSettingsByMasjidId } from "@/lib/server/services/masjidSiteSettings";
import { getMasjidThemeById } from "@/lib/server/services/masjidTheme";
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
  const prayerSettings = masjid
    ? await getPrayerSettingsByMasjidId(masjid.id)
    : null;
  const siteSettings = masjid
    ? await getMasjidSiteSettingsByMasjidId(masjid.id)
    : null;

  return (
    <MasjidProvider masjid={masjid}>
      <MasjidSiteSettingsProvider siteSettings={siteSettings}>
        <DateTimeProvider settings={prayerSettings}>
          <ThemeWrapper id={masjid?.id || ""}>
            <SiteWrapper siteSettings={siteSettings}>{children}</SiteWrapper>
          </ThemeWrapper>
        </DateTimeProvider>
      </MasjidSiteSettingsProvider>
    </MasjidProvider>
  );
}
