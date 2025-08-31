// app/[id]/layout.tsx
import ThemeWrapper from "@/components/server/ThemeWrapper";
import { DateTimeProvider } from "@/context/dateTimeContext";
import { MasjidProvider } from "@/context/masjidContext";
import { getMasjidById } from "@/lib/server/data/masjid";
import { getPrayerSettingsByMasjidId } from "@/lib/server/data/masjidPrayerSettings";
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
  const settings = masjid ? await getPrayerSettingsByMasjidId(masjid.id) : null;

  return (
    <MasjidProvider masjid={masjid}>
      <DateTimeProvider settings={settings}>
        <ThemeWrapper id={id}>{children}</ThemeWrapper>
      </DateTimeProvider>
    </MasjidProvider>
  );
}
