import { Calendar } from "lucide-react";
import { ActivityFeedCard } from "../ActivityFeedCard";
import { BusinessAdCard } from "../BusinessAdCard";
import { FeedItem, ApprovedBusinessAd, ExpandedEvent } from "../../types";
import { injectBusinessAds } from "../../utils/businessAdUtils";

interface EventsTabProps {
  expandedEvents: ExpandedEvent[];
  businessAds: ApprovedBusinessAd[];
  masjidSlug: string;
  masjidLogo: string | null;
  masjidName: string;
}

export function EventsTab({
  expandedEvents,
  businessAds,
  masjidSlug,
  masjidLogo,
  masjidName,
}: EventsTabProps) {
  return (
    <div className="space-y-6">
      {expandedEvents.length > 0 ? (
        injectBusinessAds(expandedEvents, businessAds, 3).map((item, index) => {
          if (typeof item === 'object' && 'type' in item && item.type === 'business_ad') {
            return (
              <BusinessAdCard
                key={`ad-${item.data.id}-${index}`}
                ad={item.data}
              />
            );
          }

          const event = item as ExpandedEvent;
          const eventFeedItem: FeedItem = {
            id: `event-${event.id}`,
            type: 'event',
            timestamp: new Date(event.date || event.created_at || ''),
            data: event
          };
          return (
            <ActivityFeedCard
              key={eventFeedItem.id}
              feedItem={eventFeedItem}
              masjidSlug={masjidSlug}
              masjidLogo={masjidLogo}
              masjidName={masjidName}
            />
          );
        })
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events yet
            </h3>
            <p className="text-gray-600">
              Check back later for community events and gatherings.
            </p>
          </div>
          {/* Show business ads even when no events */}
          {businessAds.length > 0 && (
            <>
              {businessAds.slice(0, 2).map((ad) => (
                <BusinessAdCard
                  key={ad.id}
                  ad={ad}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}