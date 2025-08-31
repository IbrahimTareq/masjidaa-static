import { getMasjidBySlug } from "@/lib/server/data/masjid";
import { getPrayerData } from "@/lib/prayer";
import { createClient } from "@/utils/supabase/server";
import HomeClient from "@/app/[slug]/home";

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

  // Get prayer data
  const supabase = await createClient();
  const initialPrayerData = await getPrayerData(supabase, masjid.id);

  // Pass data to client component
  return <HomeClient initialPrayerData={initialPrayerData} />;
}