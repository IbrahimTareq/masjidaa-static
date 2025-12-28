import YoutubeFeedComponent from "./youtube-feed";
import { getMasjidById } from "@/lib/server/services/masjid";
import { getMasjidSocialsByMasjidId } from "@/lib/server/services/masjidSocials";

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

async function getInitialYouTubeVideos(uploadsPlaylistId: string) {
  if (!YOUTUBE_API_KEY) {
    console.error("Missing YOUTUBE_API_KEY environment variable");
    return { videos: [], nextPageToken: null };
  }

  try {
    // Only fetch the first batch of videos (10 videos)
    const playlistRes: Response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } } // cache for 1 hour
    );

    if (!playlistRes.ok) {
      console.error("Failed to fetch playlist videos:", playlistRes.status);
      return { videos: [], nextPageToken: null };
    }

    const playlistData: any = await playlistRes.json();
    const videos =
      playlistData.items?.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        published: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails?.medium?.url,
      })) || [];

    // Fetch video statistics
    const videosWithStats = await getVideoStatistics(videos);
    
    return {
      videos: videosWithStats,
      nextPageToken: playlistData.nextPageToken || null,
    };
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return { videos: [], nextPageToken: null };
  }
}

async function getVideoStatistics(videos: any[]) {
  if (!videos.length || !YOUTUBE_API_KEY) return videos;

  try {
    const videoIds = videos.map((video) => video.id).join(",");

    const statsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } } // cache for 1 hour
    );

    if (!statsRes.ok) {
      console.error("Failed to fetch video statistics:", statsRes.status);
      return videos;
    }

    const statsData: any = await statsRes.json();
    const enhancedVideos = [...videos];

    if (statsData.items) {
      statsData.items.forEach((item: any) => {
        const videoIndex = enhancedVideos.findIndex((v) => v.id === item.id);
        if (videoIndex !== -1) {
          enhancedVideos[videoIndex] = {
            ...enhancedVideos[videoIndex],
            viewCount: item.statistics?.viewCount,
            likeCount: item.statistics?.likeCount,
            commentCount: item.statistics?.commentCount,
          };
        }
      });
    }

    return enhancedVideos;
  } catch (error) {
    console.error("Error fetching video statistics:", error);
    return videos;
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const showCoverImage = (await searchParams).showcoverimage;
  const masjid = await getMasjidById(id);

  const masjidSocials = await getMasjidSocialsByMasjidId(id);

  const channelId = masjidSocials?.youtube_channel_id;

  if (!channelId) {
    return <div>YouTube channel not found</div>;
  }

  const channelInfo = await getYouTubeChannelInfo(channelId);

  if (!channelInfo?.uploadsPlaylistId) {
    return <div>Unable to load YouTube videos</div>;
  }

  const { videos: initialVideos, nextPageToken: initialNextPageToken } =
    await getInitialYouTubeVideos(channelInfo.uploadsPlaylistId);

  console.log(`[YouTube Feed] Loaded ${initialVideos.length} initial videos, nextPageToken: ${initialNextPageToken ? 'exists' : 'null'}`);

  return (
    <main className="min-h-screen bg-gray-50">
      <YoutubeFeedComponent
        channelId={channelId}
        channelName={channelInfo.title || masjid?.name || "YouTube Channel"}
        logo={channelInfo.logo || masjid?.logo || ""}
        subscriberCount={channelInfo.subscriberCount || "—"}
        videoCount={channelInfo.videoCount || "—"}
        viewCount={channelInfo.viewCount || "—"}
        initialVideos={initialVideos}
        initialNextPageToken={initialNextPageToken}
        uploadsPlaylistId={channelInfo.uploadsPlaylistId}
        showCoverImage={!!showCoverImage}
        coverImage={channelInfo.bannerUrl || null}
      />
    </main>
  );
}
