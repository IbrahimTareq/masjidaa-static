import HomeClient from "@/app/[slug]/home";
import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getMasjidDonationCampaignById } from "@/lib/server/services/masjidDonationCampaign";
import { getMasjidEventsByMasjidId } from "@/lib/server/services/masjidEvents";
import { getMasjidSiteSettingsByMasjidId } from "@/lib/server/services/masjidSiteSettings";
import { getServerPrayerData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { DOMAIN_NAME } from "@/utils/shared/constants";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    url: masjid.website,
    sameAs: `${DOMAIN_NAME}/${slug}`,
    logo: masjid.logo,
    name: masjid.name,
    description: masjid.description,
    email: masjid.email,
    telephone: masjid.contact_number,
    address: {
      "@type": "PostalAddress",
      streetAddress: masjid.street,
      addressLocality: masjid.city,
      addressCountry: masjid.country,
      addressRegion: masjid.region,
      postalCode: masjid.postcode,
    },
  };

  if (siteSettings?.featured_campaign_id) {
    const campaign = await getMasjidDonationCampaignById(
      siteSettings.featured_campaign_id
    );
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <HomeClient
          prayerData={prayerData}
          events={events ?? []}
          campaign={campaign ?? null}
        />
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomeClient prayerData={prayerData} events={events ?? []} />
    </>
  );
}
