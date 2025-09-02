import HomeClient from "@/app/[slug]/home";
import { getMasjidBySlug } from "@/lib/server/data/masjid";
import { getServerPrayerData } from "@/lib/server/services/prayer";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Get masjid data
  const masjid = await getMasjidBySlug(slug);
  
  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  const prayerData = await getServerPrayerData(masjid.id);

  // Pass data to client component
  return <HomeClient prayerData={prayerData} />;
}