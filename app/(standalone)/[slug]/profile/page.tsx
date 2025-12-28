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
import { getMasjidSocialsByMasjidId } from "@/lib/server/services/masjidSocials";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import { Metadata } from "next";
import Script from "next/script";

export const revalidate = 60; // Revalidate every 60 seconds

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function getYouTubeChannelInfo(channelId: string) {
  if (!YOUTUBE_API_KEY) {
    console.error("Missing YOUTUBE_API_KEY environment variable");
    return null;
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails,brandingSettings&id=${channelId}&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } } // cache for 1 hour
    );

    if (!res.ok) {
      console.error("Failed to fetch YouTube channel info:", res.status);
      return null;
    }

    const data: any = await res.json();
    const item = data.items?.[0];
    if (!item) return null;

    return {
      title: item.snippet.title,
      logo: item.snippet.thumbnails?.default?.url,
      subscriberCount: item.statistics?.subscriberCount,
      videoCount: item.statistics?.videoCount,
      viewCount: item.statistics?.viewCount,
      uploadsPlaylistId: item.contentDetails?.relatedPlaylists?.uploads,
      bannerUrl: item.brandingSettings?.image?.bannerExternalUrl || null,
    };
  } catch (error) {
    console.error("Error fetching YouTube channel info:", error);
    return null;
  }
}

async function getYouTubeVideosFromPlaylist(uploadsPlaylistId: string) {
  if (!YOUTUBE_API_KEY) {
    console.error("Missing YOUTUBE_API_KEY environment variable");
    return [];
  }

  try {
    let videos: any[] = [];
    let nextPageToken: string | undefined = undefined;

    do {
      const playlistRes: Response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_API_KEY}${
          nextPageToken ? `&pageToken=${nextPageToken}` : ""
        }`,
        { next: { revalidate: 86400 } } // cache for 24 hours
      );

      if (!playlistRes.ok) {
        console.error("Failed to fetch playlist videos:", playlistRes.status);
        break;
      }

      const playlistData: any = await playlistRes.json();
      const pageVideos =
        playlistData.items?.map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          published: item.snippet.publishedAt,
          thumbnail: item.snippet.thumbnails?.medium?.url,
        })) || [];

      videos = [...videos, ...pageVideos];
      nextPageToken = playlistData.nextPageToken;
    } while (nextPageToken);

    // Fetch video statistics in batches
    const videosWithStats = await getVideoStatistics(videos);
    
    return videosWithStats;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
}

async function getVideoStatistics(videos: any[]) {
  if (!videos.length || !YOUTUBE_API_KEY) return videos;

  try {
    // Process videos in batches of 50 (YouTube API limit)
    const batchSize = 50;
    const enhancedVideos = [...videos];
    
    for (let i = 0; i < videos.length; i += batchSize) {
      const batch = videos.slice(i, i + batchSize);
      const videoIds = batch.map(video => video.id).join(',');
      
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`,
        { next: { revalidate: 3600 } } // cache for 1 hour
      );
      
      if (!statsRes.ok) {
        console.error("Failed to fetch video statistics:", statsRes.status);
        continue;
      }
      
      const statsData: any = await statsRes.json();
      
      if (statsData.items) {
        statsData.items.forEach((item: any) => {
          const videoIndex = enhancedVideos.findIndex(v => v.id === item.id);
          if (videoIndex !== -1) {
            enhancedVideos[videoIndex] = {
              ...enhancedVideos[videoIndex],
              viewCount: item.statistics?.viewCount,
              likeCount: item.statistics?.likeCount,
              commentCount: item.statistics?.commentCount
            };
          }
        });
      }
    }
    
    return enhancedVideos;
  } catch (error) {
    console.error("Error fetching video statistics:", error);
    return videos;
  }
}

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
    masjidSocials,
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
    getMasjidSocialsByMasjidId(masjid.id),
  ]);

  // Fetch YouTube data if channel is configured
  const youtubeChannelId = masjidSocials?.youtube_channel_id;
  let youtubeChannelInfo = null;
  let youtubeVideos: any[] = [];

  if (youtubeChannelId) {
    youtubeChannelInfo = await getYouTubeChannelInfo(youtubeChannelId);
    if (youtubeChannelInfo?.uploadsPlaylistId) {
      youtubeVideos = await getYouTubeVideosFromPlaylist(youtubeChannelInfo.uploadsPlaylistId);
    }
  }

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
        youtubeChannelId={youtubeChannelId}
        youtubeChannelInfo={youtubeChannelInfo}
        youtubeVideos={youtubeVideos}
      />
    </>
  );
}

