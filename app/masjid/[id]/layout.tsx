import ThemeWrapper from "@/components/server/ThemeWrapper";
import { DateTimeProvider } from "@/context/dateTimeContext";
import { LocationProvider } from "@/context/locationContext";
import { MasjidProvider } from "@/context/masjidContext";
import { getMasjidById } from "@/lib/server/services/masjid";
import { getMasjidLocationByMasjidId } from "@/lib/server/services/masjidLocation";
import { getPrayerSettingsByMasjidId } from "@/lib/server/services/masjidPrayerSettings";
import React from "react";

export default async function MasjidLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const masjid = await getMasjidById(id);
  const [settings, location] = masjid
    ? await Promise.all([
        getPrayerSettingsByMasjidId(masjid.id),
        getMasjidLocationByMasjidId(masjid.id),
      ])
    : [null, null];

  return (
    <MasjidProvider masjid={masjid}>
      <LocationProvider location={location}>
        <DateTimeProvider settings={settings}>
          <ThemeWrapper id={id}>{children}</ThemeWrapper>
        </DateTimeProvider>
      </LocationProvider>
    </MasjidProvider>
  );
}
