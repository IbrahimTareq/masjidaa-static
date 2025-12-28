"use server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

type VideoItem = {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
};

type FetchVideosResult = {
  videos: VideoItem[];
  nextPageToken: string | null;
  error?: string;
};

export async function fetchMoreYouTubeVideos(
  playlistId: string,
  pageToken: string,
  maxResults: number = 10
): Promise<FetchVideosResult> {
  if (!playlistId) {
    return {
      videos: [],
      nextPageToken: null,
      error: "Missing playlistId parameter",
    };
  }

  if (!YOUTUBE_API_KEY) {
    console.error("Missing YOUTUBE_API_KEY environment variable");
    return {
      videos: [],
      nextPageToken: null,
      error: "YouTube API key not configured",
    };
  }

  try {
    // Fetch playlist items
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}${
      pageToken ? `&pageToken=${pageToken}` : ""
    }`;

    const playlistRes = await fetch(playlistUrl, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!playlistRes.ok) {
      console.error("Failed to fetch playlist videos:", playlistRes.status);
      return {
        videos: [],
        nextPageToken: null,
        error: "Failed to fetch videos from YouTube",
      };
    }

    const playlistData: any = await playlistRes.json();

    const videos: VideoItem[] =
      playlistData.items?.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        published: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails?.medium?.url,
      })) || [];

    // Fetch video statistics
    if (videos.length > 0) {
      const videoIds = videos.map((v) => v.id).join(",");
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`,
        { next: { revalidate: 3600 } }
      );

      if (statsRes.ok) {
        const statsData: any = await statsRes.json();
        if (statsData.items) {
          statsData.items.forEach((item: any) => {
            const videoIndex = videos.findIndex((v) => v.id === item.id);
            if (videoIndex !== -1) {
              videos[videoIndex] = {
                ...videos[videoIndex],
                viewCount: item.statistics?.viewCount,
                likeCount: item.statistics?.likeCount,
                commentCount: item.statistics?.commentCount,
              };
            }
          });
        }
      }
    }

    return {
      videos,
      nextPageToken: playlistData.nextPageToken || null,
    };
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return {
      videos: [],
      nextPageToken: null,
      error: "Internal server error",
    };
  }
}

