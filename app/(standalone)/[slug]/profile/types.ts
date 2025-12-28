import { Tables } from "@/database.types";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { ApprovedBusinessAd } from "@/lib/server/services/businessAd";
import { DisplayDates } from "@/lib/server/services/masjidDates";
import { NearbyMasjid } from "@/lib/server/services/nearbyMasjids";

// YouTube related types
export type VideoItem = {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
};

export type YouTubeChannelInfo = {
  title: string;
  logo: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  bannerUrl: string | null;
};

export interface SummaryClientProps {
  masjid: Tables<"masjids">;
  prayerData: FormattedData;
  announcements: Tables<"announcements">[];
  campaigns: Tables<"donation_campaigns">[];
  events: Tables<"events">[];
  siteSettings: Tables<"masjid_site_settings"> | null;
  followerCount: number;
  businessAds: ApprovedBusinessAd[];
  nearbyMasjids: NearbyMasjid[];
  dates: DisplayDates | null;
  location: Tables<"masjid_locations"> | null;
  youtubeChannelId?: string | null;
  youtubeChannelInfo?: YouTubeChannelInfo | null;
  youtubeVideos?: VideoItem[];
}

export type { ApprovedBusinessAd };

// Feed item types for unified activity feed
export type FeedItem = {
  id: string;
  type: "announcement" | "event" | "campaign";
  timestamp: Date;
  data:
    | Tables<"announcements">
    | Tables<"events">
    | Tables<"donation_campaigns">;
};

// Extended event type to include generated recurring events
export type ExpandedEvent = Tables<"events"> & {
  isRecurring?: boolean;
  originalId?: string;
  instanceDate?: Date;
};

