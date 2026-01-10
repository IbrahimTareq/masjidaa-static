import { Bell } from "lucide-react";
import { Tables } from "@/database.types";
import { ActivityFeedCard } from "../ActivityFeedCard";
import { BusinessAdCard } from "../BusinessAdCard";
import { FeedItem, ApprovedBusinessAd } from "../../types";
import { injectBusinessAds } from "../../utils/businessAdUtils";

interface AnnouncementsTabProps {
  announcements: Tables<"announcements">[];
  businessAds: ApprovedBusinessAd[];
  masjidSlug: string;
  masjidLogo: string | null;
  masjidName: string;
}

export function AnnouncementsTab({
  announcements,
  businessAds,
  masjidSlug,
  masjidLogo,
  masjidName,
}: AnnouncementsTabProps) {
  return (
    <div className="space-y-6">
      {announcements.length > 0 ? (
        injectBusinessAds(announcements, businessAds, 3).map((item, index) => {
          if (typeof item === 'object' && 'type' in item && item.type === 'business_ad') {
            return (
              <BusinessAdCard
                key={`ad-${item.data.id}-${index}`}
                ad={item.data}
              />
            );
          }

          const announcement = item as Tables<"announcements">;
          const announcementFeedItem: FeedItem = {
            id: `announcement-${announcement.id}`,
            type: "announcement",
            timestamp: new Date(announcement.created_at || ""),
            data: announcement,
          };
          return (
            <ActivityFeedCard
              key={announcementFeedItem.id}
              feedItem={announcementFeedItem}
              masjidSlug={masjidSlug}
              masjidLogo={masjidLogo}
              masjidName={masjidName}
            />
          );
        })
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No announcements yet
            </h3>
            <p className="text-gray-600">
              Check back later for community updates and announcements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}