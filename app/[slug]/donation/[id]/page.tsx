import { getDonationCampaign } from "@/lib/server/actions/donationCampaignActions";
import { getMasjidById } from "@/lib/server/services/masjid";
import { getMasjidBankAccountById } from "@/lib/server/services/masjidBankAccount";
import { getShortLinkById } from "@/lib/server/services/shortLink";
import { getMasjidThemeById } from "@/lib/server/services/masjidTheme";

import DonationDisplay from "@/app/[slug]/donation/[id]/donation";
import { getDonationCount } from "@/lib/server/services/donationCount";
import { getDonationCountMonthly } from "@/lib/server/services/donationCountMonthly";
import { getDonationsByCampaignId } from "@/lib/server/services/donations";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function DonationCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch campaign data
  const campaign = await getDonationCampaign(id);
  if (!campaign) {
    return <div className="p-8 text-center">Campaign not found</div>;
  }

  const masjid = await getMasjidById(campaign?.masjid_id || "");
  if (!masjid) {
    return <div className="p-8 text-center">Masjid not found</div>;
  }

  const [bankAccount, theme, donationCount, donationCountMonthly, donations] = await Promise.all([
    getMasjidBankAccountById(campaign.bank_account_id || ""),
    getMasjidThemeById(masjid.theme_color_id || ""),
    getDonationCount(campaign.id),
    getDonationCountMonthly(campaign.id),
    getDonationsByCampaignId(campaign.id)
  ]);

  return (
    <DonationDisplay
      campaign={campaign}
      bankAccount={bankAccount}
      theme={theme}
      masjid={masjid}
      donationCount={donationCount || 0}
      donationCountMonthly={donationCountMonthly || 0}
      donations={donations || []}
    />
  );
}