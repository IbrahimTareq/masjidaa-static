import { getMasjidBySlug } from "@/lib/server/data/masjid";
import { getMasjidDonationCampaignsByMasjidId } from "@/lib/server/data/masjidDonationCampaigns";
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

  return (
    <div className="min-h-screen bg-white">
      <DonationsClient campaigns={campaigns ?? []} slug={slug} />
    </div>
  );
}
