import HomeClient from "@/app/[slug]/home";
import { getMasjidBySlug } from "@/lib/server/data/masjid";
import { getMasjidEventsByMasjidId } from "@/lib/server/data/masjidEvents";
import { getServerPrayerData } from "@/lib/server/services/prayer";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const masjid = await getMasjidBySlug(slug);
  
  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  const prayerData = await getServerPrayerData(masjid.id);
  const events = await getMasjidEventsByMasjidId(masjid.id);

  return <HomeClient prayerData={prayerData} events={events ?? []} />;
}