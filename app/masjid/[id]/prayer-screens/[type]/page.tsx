import { getServerPrayerData } from "@/lib/server/domain/prayer/getServerPrayerData";
import Theme1 from "./theme1/theme1";
import Theme2 from "./theme2/theme2";
import Theme3 from "./theme3/theme3";
import Theme4 from "./theme4/theme4";
import Theme5 from "./theme5/theme5";

type Params = { id: string; type: string };
type SearchParams = { enableTheme?: string };

const THEMES: Record<string, React.FC<{ formattedData: any }>> = {
  theme1: Theme1,
  theme2: Theme2,
  theme3: Theme3,
  theme4: Theme4,
  theme5: Theme5,
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { id, type } = await params;
  const { enableTheme } = await searchParams;

  const prayerData = await getServerPrayerData(id);

  const ThemeComponent = THEMES[type];
  if (!ThemeComponent) return <div>Not found</div>;

  const content = <ThemeComponent formattedData={prayerData} />;

  if (enableTheme) {
    return (
      <div className="h-screen p-2 sm:p-4 lg:p-5 bg-gradient-to-br from-theme to-theme flex flex-col">
        <div className="flex-1 w-full rounded-t-2xl sm:rounded-t-3xl overflow-hidden">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
