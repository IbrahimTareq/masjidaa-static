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

    return videos;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
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

  const videos = channelInfo?.uploadsPlaylistId
    ? await getYouTubeVideosFromPlaylist(channelInfo.uploadsPlaylistId)
    : [];

  // Get banner image from channel info (if available)
  const coverImage = channelInfo?.bannerUrl || null;
  console.log(coverImage);

  return (
    <main className="min-h-screen bg-gray-50">
      <YoutubeFeedComponent
        channelId={channelId}
        channelName={channelInfo?.title || masjid?.name || "YouTube Channel"}
        logo={channelInfo?.logo || masjid?.logo || ""}
        subscriberCount={channelInfo?.subscriberCount || "—"}
        videoCount={channelInfo?.videoCount || "—"}
        viewCount={channelInfo?.viewCount || "—"}
        videos={videos}
        showCoverImage={!!showCoverImage}
        coverImage={coverImage}
      />
    </main>
  );
}
