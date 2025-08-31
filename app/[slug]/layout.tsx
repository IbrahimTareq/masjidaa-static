import SiteWrapper from "@/components/SiteWrapper";
import ThemeClientWrapper from "@/components/ThemeClientWrapper";
import { DateTimeProvider } from "@/context/dateTimeContext";
import { MasjidProvider } from "@/context/masjidContext";
import { getMasjidBySlug } from "@/lib/server/data/masjid";
import { getPrayerSettingsByMasjidSlug } from "@/lib/server/data/masjidPrayerSettings";
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
  const settings = masjid
    ? await getPrayerSettingsByMasjidSlug(masjid.slug)
    : null;

  return (
    <MasjidProvider masjid={masjid}>
      <DateTimeProvider settings={settings}>
        <ThemeClientWrapper id={masjid?.id || ""}>
          <SiteWrapper>{children}</SiteWrapper>
        </ThemeClientWrapper>
      </DateTimeProvider>
    </MasjidProvider>
  );
}
