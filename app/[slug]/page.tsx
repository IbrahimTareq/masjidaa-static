import HomeClient from "@/app/[slug]/home";
import { getMasjidBySlug } from "@/lib/server/data/masjid";
import { getMasjidDonationCampaignById } from "@/lib/server/data/masjidDonationCampaign";
import { getMasjidEventsByMasjidId } from "@/lib/server/data/masjidEvents";
import { getMasjidSiteSettingsByMasjidId } from "@/lib/server/data/masjidSiteSettings";
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

  const siteSettings = await getMasjidSiteSettingsByMasjidId(masjid.id);

  if (siteSettings?.featured_campaign_id) {
    const campaign = await getMasjidDonationCampaignById(siteSettings.featured_campaign_id);
    return <HomeClient prayerData={prayerData} events={events ?? []} campaign={campaign ?? null} />;
  }

  return <HomeClient prayerData={prayerData} events={events ?? []} />;
}