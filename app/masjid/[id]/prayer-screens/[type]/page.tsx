import { getServerPrayerData } from "@/lib/server/domain/prayer/getServerPrayerData";
import Theme1 from "./theme1/theme1";
import Theme2 from "./theme2/theme2";
import Theme3 from "./theme3/theme3";
import Theme4 from "./theme4/theme4";
import Theme5 from "./theme5/theme5";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; type: string }>;
}) {
  const { id, type } = await params;

  const prayerData = await getServerPrayerData(id);

  if (type === "theme1") {
    return <Theme1 formattedData={prayerData} />;
  } else if (type === "theme2") {
    return <Theme2 formattedData={prayerData} />;
  } else if (type === "theme3") {
    return <Theme3 formattedData={prayerData} />;
  } else if (type === "theme4") {
    return <Theme4 formattedData={prayerData} />;
  } else if (type === "theme5") {
    return <Theme5 formattedData={prayerData} />;
  }

  return <div>Not found</div>;
}
