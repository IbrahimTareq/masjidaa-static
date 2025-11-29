import HomeClient from "@/app/[slug]/home";
import { getServerPrayerData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getMasjidDonationCampaignById } from "@/lib/server/services/masjidDonationCampaign";
import { getMasjidEventsByMasjidId } from "@/lib/server/services/masjidEvents";
import { getMasjidLocationByMasjidId } from "@/lib/server/services/masjidLocation";
import { getMasjidSiteSettingsByMasjidId } from "@/lib/server/services/masjidSiteSettings";
import { expandEventsWithRecurrence } from "@/utils/recurrence";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import { Metadata } from "next";
import Script from "next/script";

export const revalidate = 60; // Revalidate every 60 seconds

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

  // Parallelize all data fetching with optimized campaign loading
  const [prayerData, events, siteSettingsResult, location] = await Promise.all([
    getServerPrayerData(masjid.id),
    getMasjidEventsByMasjidId(masjid.id),
    // Create a promise that includes the campaign fetch if needed
    getMasjidSiteSettingsByMasjidId(masjid.id).then(async (settings) => {
      const campaign = settings?.featured_campaign_id
        ? await getMasjidDonationCampaignById(settings.featured_campaign_id)
        : null;
      return { settings, campaign };
    }),
    getMasjidLocationByMasjidId(masjid.id),
  ]);

  const campaign = siteSettingsResult.campaign;

  // Expand recurring events to show future occurrences
  const expandedEvents = expandEventsWithRecurrence(events ?? [], 1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Mosque",
    name: masjid.name,
    url: `${DOMAIN_NAME}/${masjid.slug}`,
    sameAs: masjid.website,
    logo: masjid.logo,
    description: `Masjid profile for ${masjid.name} on Masjidaa – prayer times, events, announcements & donations.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: location?.street,
      addressLocality: location?.city,
      addressRegion: location?.region,
      postalCode: location?.postcode,
      addressCountry: location?.country,
    },
    telephone: masjid.contact_number,
    hasMap: location?.address_label
      ? `https://maps.google.com/maps?q=${encodeURI(location.address_label)}`
      : undefined,
  };

  return (
    <>
      <Script
        id={`jsonld-${masjid.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <HomeClient
        prayerData={prayerData}
        events={expandedEvents}
        campaign={campaign}
      />
    </>
  );
}
