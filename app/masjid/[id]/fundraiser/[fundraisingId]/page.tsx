import { getDonationCampaign } from "@/lib/server/actions/donationCampaignActions";
import { getMasjidById } from "@/lib/server/services/masjid";
import { getDonationCount } from "@/lib/server/services/donationCount";
import { getDonationsByCampaignId } from "@/lib/server/services/donations";
import { getFundraiserSessionById } from "@/lib/server/services/fundraiserSession";
import FundraiserDisplay from "./fundraiser";

export const revalidate = 60;

export default async function FundraiserPage({
  params,
}: {
  params: Promise<{ fundraisingId: string }>;
}) {
  const { fundraisingId } = await params;

  // First fetch the fundraiser session
  const session = await getFundraiserSessionById(fundraisingId);
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Fundraiser session not found
      </div>
    );
  }

  // Fetch campaign using session's campaign_id
  const campaign = await getDonationCampaign(session.campaign_id);
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
      session={session}
      campaign={campaign}
      masjid={masjid}
      donationCount={donationCount || 0}
      donations={donations || []}
    />
  );
}
