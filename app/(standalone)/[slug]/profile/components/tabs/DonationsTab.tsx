import { Heart } from "lucide-react";
import { Tables } from "@/database.types";
import { ActivityFeedCard } from "../ActivityFeedCard";
import { BusinessAdCard } from "../BusinessAdCard";
import { FeedItem, ApprovedBusinessAd } from "../../types";
import { injectBusinessAds } from "../../utils/businessAdUtils";

interface DonationsTabProps {
  campaigns: Tables<"donation_campaigns">[];
  businessAds: ApprovedBusinessAd[];
  masjidSlug: string;
  masjidLogo: string | null;
  masjidName: string;
}

export function DonationsTab({
  campaigns,
  businessAds,
  masjidSlug,
  masjidLogo,
  masjidName,
}: DonationsTabProps) {
  return (
    <div className="space-y-6">
      {campaigns.length > 0 ? (
        injectBusinessAds(campaigns, businessAds, 3).map((item, index) => {
          if (typeof item === 'object' && 'type' in item && item.type === 'business_ad') {
            return (
              <BusinessAdCard
                key={`ad-${item.data.id}-${index}`}
                ad={item.data}
              />
            );
          }

          const campaign = item as Tables<"donation_campaigns">;
          const campaignFeedItem: FeedItem = {
            id: `campaign-${campaign.id}`,
            type: "campaign",
            timestamp: new Date(campaign.created_at || ""),
            data: campaign,
          };
          return (
            <ActivityFeedCard
              key={campaignFeedItem.id}
              feedItem={campaignFeedItem}
              masjidSlug={masjidSlug}
              masjidLogo={masjidLogo}
              masjidName={masjidName}
            />
          );
        })
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No donations yet
            </h3>
            <p className="text-gray-600">
              Check back later for donation campaigns.
            </p>
          </div>
          {/* Show business ads even when no campaigns */}
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