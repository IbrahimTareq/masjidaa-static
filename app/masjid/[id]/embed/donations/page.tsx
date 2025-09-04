import { getMasjidById } from "@/lib/server/data/masjid";
import { getMasjidDonationCampaignsByMasjidId } from "@/lib/server/data/masjidDonationCampaigns";
import DonationsClient from "./donations";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const masjid = await getMasjidById(id);

  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  const campaigns = await getMasjidDonationCampaignsByMasjidId(masjid.id);

  return <DonationsClient campaigns={campaigns ?? []} slug={masjid.slug} />;
}
