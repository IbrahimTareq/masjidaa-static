"use client";

import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Youtube, Loader2 } from "lucide-react";
import { fetchMoreYouTubeVideos } from "@/lib/server/actions/youtubeActions";

type VideoItem = {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
};

export default function YoutubeFeedComponent({
  channelId,
  channelName,
  logo,
  subscriberCount,
  videoCount,
  viewCount,
  initialVideos,
  initialNextPageToken,
  uploadsPlaylistId,
  showCoverImage = false,
  coverImage,
}: {
  channelId: string;
  channelName?: string;
  logo?: string;
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
  initialVideos: VideoItem[];
  initialNextPageToken: string | null;
  uploadsPlaylistId: string;
  showCoverImage?: boolean;
  coverImage?: string | null;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos || []);
  const [nextPageToken, setNextPageToken] = useState<string | null>(initialNextPageToken);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreVideos = useCallback(async () => {
    if (isLoading || !nextPageToken) return;

    setIsLoading(true);
    try {
      const result = await fetchMoreYouTubeVideos(
        uploadsPlaylistId,
        nextPageToken,
        10
      );

      if (result.error) {
        throw new Error(result.error);
      }

      setVideos((prev) => [...prev, ...result.videos]);
      setNextPageToken(result.nextPageToken);

      // Auto-scroll to show new videos
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          left: scrollRef.current.scrollLeft + scrollRef.current.clientWidth * 0.8,
          behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      console.error("Error loading more videos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, nextPageToken, uploadsPlaylistId]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;

    // If scrolling right and near the end, load more videos
    if (direction === "right" && scrollLeft + clientWidth >= scrollWidth - scrollAmount) {
      loadMoreVideos();
      return;
    }

    // Normal scroll
    scrollRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  const formatCount = (value?: string | number) => {
    if (!value) return "";
    const n = Number(value);
    if (isNaN(n)) return String(value);
    if (n < 1000) return n.toString();
    if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    if (n < 1_000_000_000)
      return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-6xl mx-auto relative">
      {/* Hero Image */}
      {showCoverImage && coverImage && (
        <div className="w-full mb-4 overflow-hidden rounded-xl">
          <img
            src={coverImage}
            alt={`${channelName} banner`}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <img
            src={logo || "/logo.png"}
            alt={channelName}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">
              {channelName || "YouTube Channel"}
            </h2>
            <p className="text-sm text-gray-500">
              {formatCount(subscriberCount)} Subscribers •{" "}
              {formatCount(videoCount)} Videos • {formatCount(viewCount)} Views
            </p>
          </div>
        </div>

        <a
          href={`https://www.youtube.com/channel/${channelId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Youtube className="w-5 h-5" />
          <span>YouTube</span>
          {subscriberCount && (
            <span className="bg-white text-red-600 font-semibold px-2 py-0.5 rounded text-xs">
              {formatCount(subscriberCount)}
            </span>
          )}
        </a>
      </div>

      {/* Carousel container */}
      <div className="relative mt-4">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-100 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Videos Row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-8 pb-8"
        >
          {videos.length === 0 && !isLoading && (
            <div className="w-full text-center py-8 text-gray-500">
              No videos available
            </div>
          )}
          {videos.map((v) => (
            <a
              key={v.id}
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-72 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition bg-white"
            >
              <div className="relative">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full aspect-video object-cover border-b border-gray-200"
                />
              </div>
              <div className="p-2 pb-0">
                <h3 className="text-sm font-medium line-clamp-2">{v.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(v.published).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
                {(v.viewCount || v.likeCount || v.commentCount) && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    {v.viewCount && (
                      <span>{formatCount(v.viewCount)} Views</span>
                    )}
                    <span className="text-black">•</span>
                    {v.likeCount && (
                      <span>{formatCount(v.likeCount)} Likes</span>
                    )}
                    <span className="text-black">•</span>
                    {v.commentCount && (
                      <span>{formatCount(v.commentCount)} Comments</span>
                    )}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          disabled={isLoading}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 text-gray-700 animate-spin" />
          ) : (
            <ChevronRight className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>
    </div>
  );
}
