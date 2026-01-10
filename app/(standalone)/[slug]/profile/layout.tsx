import NotFound from "@/components/client/ui/NotFound";
import ThemeWrapper from "@/components/server/ThemeWrapper";
import { DateTimeProvider } from "@/context/dateTimeContext";
import { MasjidProvider } from "@/context/masjidContext";
import { MasjidSiteSettingsProvider } from "@/context/masjidSiteSettingsContext";
import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getPrayerSettingsByMasjidId } from "@/lib/server/services/masjidPrayerSettings";
import { getMasjidSiteSettingsByMasjidId } from "@/lib/server/services/masjidSiteSettings";
import React from "react";

export default async function OverviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const masjid = await getMasjidBySlug(slug);

  if (!masjid) {
    return <NotFound />;
  }

  // Parallelize related data fetching
  const [prayerSettings, siteSettings] = await Promise.all([
    getPrayerSettingsByMasjidId(masjid.id),
    getMasjidSiteSettingsByMasjidId(masjid.id),
  ]);

  return (
    <MasjidProvider masjid={masjid}>
      <MasjidSiteSettingsProvider siteSettings={siteSettings}>
        <DateTimeProvider settings={prayerSettings}>
          <ThemeWrapper id={masjid.id}>
            {children}
          </ThemeWrapper>
        </DateTimeProvider>
      </MasjidSiteSettingsProvider>
    </MasjidProvider>
  );
}

