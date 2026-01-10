import { getDonationCampaign } from "@/lib/server/actions/donationCampaignActions";
import { getMasjidById } from "@/lib/server/services/masjid";
import { getDonationCount } from "@/lib/server/services/donationCount";
import { getDonationsByCampaignId } from "@/lib/server/services/donations";
import { getFundraiserSessionById } from "@/lib/server/services/fundraiserSession";
import { notFound } from "next/navigation";
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
    notFound();
  }

  // Fetch campaign using session's campaign_id
  const campaign = await getDonationCampaign(session.campaign_id);
  if (!campaign) {
    notFound();
  }

  const masjid = await getMasjidById(campaign.masjid_id);
  // Layout handles masjid not found, but we still need the check for TypeScript
  if (!masjid) {
    notFound();
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
