import { getDonationCampaign } from "@/lib/server/actions/donationCampaignActions";
import { getMasjidById } from "@/lib/server/data/masjid";
import { getMasjidBankAccountById } from "@/lib/server/data/masjidBankAccount";
import { getShortLinkById } from "@/lib/server/data/shortLink";
import { getMasjidThemeById } from "@/lib/server/data/masjidTheme";

import DonationDisplay from "@/app/[slug]/donation/[id]/donation";
import { getDonationCount } from "@/lib/server/data/donationCount";
import { getDonationCountMonthly } from "@/lib/server/data/donationCountMonthly";

interface PageParams {
  id: string;
}

export default async function DonationCampaignPage({
  params,
}: {
  params: PageParams;
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

  const [bankAccount, shortLink, theme, donationCount, donationCountMonthly] = await Promise.all([
    getMasjidBankAccountById(campaign.bank_account_id || ""),
    getShortLinkById(campaign.short_link_id || ""),
    getMasjidThemeById(masjid.theme_color_id || ""),
    getDonationCount(campaign.id),
    getDonationCountMonthly(campaign.id)
  ]);

  return (
    <DonationDisplay
      campaign={campaign}
      bankAccount={bankAccount}
      shortLink={shortLink}
      theme={theme}
      masjid={masjid}
      donationCount={donationCount || 0}
      donationCountMonthly={donationCountMonthly || 0}
    />
  );
}