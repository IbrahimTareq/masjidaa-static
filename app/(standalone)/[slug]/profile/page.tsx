import SummaryClient from "./summary";
import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getServerPrayerData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { getMasjidAnnouncementsByMasjidId } from "@/lib/server/services/masjidAnnouncements";
import { getMasjidDonationCampaignsByMasjidId } from "@/lib/server/services/masjidDonationCampaigns";
import { getMasjidEventsByMasjidId } from "@/lib/server/services/masjidEvents";
import { getMasjidSiteSettingsByMasjidId } from "@/lib/server/services/masjidSiteSettings";
import { getMasjidFollowerCount } from "@/lib/server/services/masjidFollowers";
import { getApprovedBusinessAdsByMasjidId } from "@/lib/server/services/businessAd";
import { getNearbyMasjids } from "@/lib/server/services/nearbyMasjids";
import { getMasjidDates } from "@/lib/server/services/masjidDates";
import { getMasjidLocationByMasjidId } from "@/lib/server/services/masjidLocation";
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
    title: `${name} - Profile`,
    description: `Comprehensive profile for ${name}. Prayer times, announcements, events, donations, and more. Stay connected with your community.`,
    openGraph: {
      images: masjid?.logo ?? "/masjidaa.svg",
      title: `${name} - Profile`,
      description: `Prayer times, events, announcements & donations for ${name}`,
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

  // Parallelize all data fetching
  const [
    prayerData,
    announcements,
    campaigns,
    events,
    siteSettings,
    followerCount,
    businessAds,
    nearbyMasjids,
    dates,
    location,
  ] = await Promise.all([
    getServerPrayerData(masjid.id),
    getMasjidAnnouncementsByMasjidId(masjid.id),
    getMasjidDonationCampaignsByMasjidId(masjid.id),
    getMasjidEventsByMasjidId(masjid.id),
    getMasjidSiteSettingsByMasjidId(masjid.id),
    getMasjidFollowerCount(masjid.id),
    getApprovedBusinessAdsByMasjidId(masjid.id),
    getNearbyMasjids(masjid.id, 50, 3),
    getMasjidDates(masjid.id),
    getMasjidLocationByMasjidId(masjid.id),
  ]);

  // Filter announcements to most recent 5
  const recentAnnouncements = (announcements ?? []).slice(0, 5);

  // Filter events to upcoming only
  const now = new Date();
  const upcomingEvents = (events ?? [])
    .filter((event) => {
      // Don't filter out recurring events - they may have future occurrences
      // even if their original start date is in the past
      if (event.recurrence && event.recurrence !== 'none') {
        return true;
      }
      // For non-recurring events, only include future ones
      if (event.date) {
        return new Date(event.date) >= now;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date ?? a.created_at ?? 0);
      const dateB = new Date(b.date ?? b.created_at ?? 0);
      return dateA.getTime() - dateB.getTime();
    });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Mosque",
    name: masjid.name,
    url: `${DOMAIN_NAME}/${masjid.slug}/profile`,
    sameAs: masjid.website,
    logo: masjid.logo,
    description: `Complete profile for ${masjid.name} on Masjidaa – prayer times, events, announcements, donations & community information.`,
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
      <SummaryClient
        masjid={masjid}
        prayerData={prayerData}
        announcements={recentAnnouncements}
        campaigns={campaigns}
        events={upcomingEvents}
        siteSettings={siteSettings}
        followerCount={followerCount}
        businessAds={businessAds}
        nearbyMasjids={nearbyMasjids}
        dates={dates}
        location={location}
      />
    </>
  );
}

