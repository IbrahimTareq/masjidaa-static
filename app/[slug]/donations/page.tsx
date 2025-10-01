import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getMasjidDonationCampaignsByMasjidId } from "@/lib/server/services/masjidDonationCampaigns";
import DonationsClient from "./donations";

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

  const campaigns = await getMasjidDonationCampaignsByMasjidId(masjid.id);

  return <DonationsClient masjid={masjid} campaigns={campaigns ?? []} slug={slug} />;
}
