import { getMasjidDonationCampaignById } from "@/lib/server/data/masjidDonationCampaign";
import DonationClient from "./donation";

export default async function Page({
  params,
}: {
  params: Promise<{ donationId: string }>;
}) {
  const { donationId } = await params;

  const campaign = await getMasjidDonationCampaignById(donationId);

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return <DonationClient campaign={campaign} />;
}
