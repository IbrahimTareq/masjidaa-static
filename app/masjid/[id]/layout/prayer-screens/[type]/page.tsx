import Theme1 from "@/app/masjid/[id]/prayer-screens/[type]/theme1/theme1";
import Theme2 from "@/app/masjid/[id]/prayer-screens/[type]/theme2/theme2";
import Theme3 from "@/app/masjid/[id]/prayer-screens/[type]/theme3/theme3";
import Theme4 from "@/app/masjid/[id]/prayer-screens/[type]/theme4/theme4";
import Theme5 from "@/app/masjid/[id]/prayer-screens/[type]/theme5/theme5";
import { getServerPrayerData } from "@/lib/server/domain/prayer/getServerPrayerData";
import PrayerScreens from "./prayer-screens";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; type: string }>;
}) {
  const { id, type } = await params;

  const prayerData = await getServerPrayerData(id);

  let prayerScreen = null;
  if (type === "theme1") {
    prayerScreen = <Theme1 formattedData={prayerData} />;
  } else if (type === "theme2") {
    prayerScreen = <Theme2 formattedData={prayerData} />;
  } else if (type === "theme3") {
    prayerScreen = <Theme3 formattedData={prayerData} />;
  } else if (type === "theme4") {
    prayerScreen = <Theme4 formattedData={prayerData} />;
  } else if (type === "theme5") {
    prayerScreen = <Theme5 formattedData={prayerData} />;
  }

  if (prayerScreen) {
    return (
      <PrayerScreens formattedData={prayerData}>{prayerScreen}</PrayerScreens>
    );
  }

  return <div>Not found</div>;
}
