import { Youtube } from "lucide-react";
import YoutubeFeedComponent from "@/app/masjid/[id]/embed/youtube-feed/youtube-feed";

type VideoItem = {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
};

type YouTubeChannelInfo = {
  title: string;
  logo: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  bannerUrl: string | null;
};

interface VideosTabProps {
  channelId: string;
  channelInfo: YouTubeChannelInfo | null;
  videos: VideoItem[];
}

export function VideosTab({
  channelId,
  channelInfo,
  videos,
}: VideosTabProps) {
  if (!channelId || !channelInfo) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No YouTube channel configured
          </h3>
          <p className="text-gray-600">
            This masjid hasn't set up their YouTube channel yet.
          </p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No videos available
          </h3>
          <p className="text-gray-600">
            Check back soon for new video content!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <YoutubeFeedComponent
        channelId={channelId}
        channelName={channelInfo.title}
        logo={channelInfo.logo}
        subscriberCount={channelInfo.subscriberCount}
        videoCount={channelInfo.videoCount}
        viewCount={channelInfo.viewCount}
        videos={videos}
        showCoverImage={false}
        coverImage={channelInfo.bannerUrl}
      />
    </div>
  );
}



