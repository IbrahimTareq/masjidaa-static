import { getDonationCampaign } from "@/lib/server/actions/donationCampaignActions";
import { getMasjidById } from "@/lib/server/services/masjid";
import { getDonationCount } from "@/lib/server/services/donationCount";
import { getDonationsByCampaignId } from "@/lib/server/services/donations";
import FundraiserDisplay from "./fundraiser";

export const revalidate = 60;

export default async function FundraiserPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;

  const campaign = await getDonationCampaign(campaignId);
  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Campaign not found
      </div>
    );
  }

  const masjid = await getMasjidById(campaign.masjid_id);
  if (!masjid) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Masjid not found
      </div>
    );
  }

  const [donationCount, donations] = await Promise.all([
    getDonationCount(campaign.id),
    getDonationsByCampaignId(campaign.id),
  ]);

  return (
    <FundraiserDisplay
      campaign={campaign}
      masjid={masjid}
      donationCount={donationCount || 0}
      donations={donations || []}
    />
  );
}
