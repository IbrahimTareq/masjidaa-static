import HomeClient from "@/app/[slug]/home";
import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getMasjidDonationCampaignById } from "@/lib/server/services/masjidDonationCampaign";
import { getMasjidEventsByMasjidId } from "@/lib/server/services/masjidEvents";
import { getMasjidSiteSettingsByMasjidId } from "@/lib/server/services/masjidSiteSettings";
import { getServerPrayerData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const masjid = await getMasjidBySlug(slug);

  const name = masjid?.name ?? "Masjid";

  return {
    metadataBase: new URL(DOMAIN_NAME),
    title: name,
    description: `Stay connected with ${name}. Download the Masjidaa app for prayer times, events, announcements & donation updates.`,
    openGraph: {
      images: masjid?.logo ?? "/masjidaa.svg",
    },
  };
}

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
    "@type": "Mosque",
    name: masjid?.name,
    url: `${DOMAIN_NAME}/${masjid?.slug}`,
    sameAs: masjid?.website,
    logo: masjid?.logo,
    description: `Masjid profile for ${masjid?.name} on Masjidaa – prayer times, events, announcements & donations.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: masjid?.street,
      addressLocality: masjid?.city,
      addressRegion: masjid?.region,
      postalCode: masjid?.postcode,
      addressCountry: masjid?.country,
    },
    telephone: masjid?.contact_number,
    hasMap: `https://maps.google.com/maps?q=${encodeURI(masjid.address_label)}`,
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
