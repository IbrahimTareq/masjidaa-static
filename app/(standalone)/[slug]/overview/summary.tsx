"use client";

import { Tables } from "@/database.types";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { ApprovedBusinessAd } from "@/lib/server/services/businessAd";
import { DisplayDates } from "@/lib/server/services/masjidDates";
import { NearbyMasjid } from "@/lib/server/services/nearbyMasjids";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  MapPin as Compass,
  ExternalLink,
  Heart,
  Mail,
  MapPin,
  Megaphone,
  Mic as Microphone,
  Phone,
  Share2,
  Speaker,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SummaryClientProps {
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
}

// Feed item types for unified activity feed
type FeedItem = {
  id: string;
  type: "announcement" | "event" | "campaign";
  timestamp: Date;
  data:
    | Tables<"announcements">
    | Tables<"events">
    | Tables<"donation_campaigns">;
};

// Create unified activity feed with chronological sorting
function createActivityFeed(
  announcements: Tables<"announcements">[],
  events: Tables<"events">[],
  campaigns: Tables<"donation_campaigns">[]
): FeedItem[] {
  const feedItems: FeedItem[] = [];

  // Add announcements
  announcements.forEach((announcement) => {
    feedItems.push({
      id: `announcement-${announcement.id}`,
      type: "announcement",
      timestamp: new Date(announcement.created_at || ""),
      data: announcement,
    });
  });

  // Add events (use event date as timestamp for sorting)
  events.forEach((event) => {
    feedItems.push({
      id: `event-${event.id}`,
      type: "event",
      timestamp: new Date(event.date || event.created_at || ""),
      data: event,
    });
  });

  // Add campaigns
  campaigns.forEach((campaign) => {
    feedItems.push({
      id: `campaign-${campaign.id}`,
      type: "campaign",
      timestamp: new Date(campaign.created_at || ""),
      data: campaign,
    });
  });

  // Sort by timestamp (newest first)
  return feedItems.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
}

export default function SummaryClient({
  masjid,
  prayerData,
  announcements,
  campaigns,
  events,
  followerCount,
  businessAds,
  nearbyMasjids,
  dates,
}: SummaryClientProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFollowed, setIsFollowed] = useState(false);
  const [activeTab, setActiveTab] = useState("prayer");

  // Extract prayer times from the dailyPrayerTimes array
  const dailyPrayers = prayerData.dailyPrayerTimes || [];
  const fajr = dailyPrayers.find((p) => p.name === "Fajr");
  const dhuhr = dailyPrayers.find((p) => p.name === "Dhuhr");
  const asr = dailyPrayers.find((p) => p.name === "Asr");
  const maghrib = dailyPrayers.find((p) => p.name === "Maghrib");
  const isha = dailyPrayers.find((p) => p.name === "Isha");

  const sunrise = prayerData.shurq;
  const jummah = prayerData.jummahPrayerTimes?.[0];

  // Format dates
  const gregorianDate = prayerData.gregorianDate
    ? format(new Date(prayerData.gregorianDate), "MMMM d")
    : format(new Date(), "MMMM d");
  const islamicDate = prayerData.hijriDate ?? "";

  // Create unified activity feed
  const feedItems = createActivityFeed(announcements, events, campaigns);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get current prayer status
  const getCurrentPrayer = () => {
    const now = currentTime;
    const prayers = [fajr, dhuhr, asr, maghrib, isha].filter(Boolean);
    // This is a simplified version - you'd implement proper prayer time logic here
    return prayers[0]; // For demo purposes
  };

  const currentPrayer = getCurrentPrayer();

  return (
    <div className="min-h-screen bg-gray-100 font-montserrat">
      {/* Profile Header - Facebook/LinkedIn Style */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        {/* Cover Photo */}
        <div className="relative h-80 md:h-96 lg:h-[400px] bg-gradient-to-br from-theme to-theme-accent overflow-hidden">
          {masjid.bg_image ? (
            <Image
              src={masjid.bg_image}
              alt={`${masjid.name} cover photo`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-theme via-theme-accent to-theme opacity-90" />
          )}

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Profile Info Section */}
        <div className="relative">
          {/* Constrained Container matching activity section width */}
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-6 relative">
            {/* Profile Picture */}
            <div className="absolute -top-16 left-4 md:left-6 lg:left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
                  {masjid.logo ? (
                    <Image
                      src={masjid.logo}
                      alt={`${masjid.name} logo`}
                      fill
                      className="rounded-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-theme/10 flex items-center justify-center">
                      <span className="text-theme text-2xl font-bold">
                        {masjid.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Profile Info */}
            <div className="pt-20">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                {/* Name and Stats */}
                <div className="mb-6 lg:mb-0 flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    {masjid.name}
                    {masjid.verified && (
                      <CheckCircle className="w-6 h-6 text-theme" />
                    )}
                  </h1>

                  {/* Stats */}
                  <div className="flex items-center flex-wrap gap-4 text-gray-600 mb-4">
                    <span className="font-semibold">
                      {followerCount > 0
                        ? followerCount.toLocaleString()
                        : "2.4K"}{" "}
                      followers
                    </span>
                  </div>

                  {/* Bio/Description */}
                  {masjid.description && (
                    <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mb-4">
                      {masjid.description}
                    </p>
                  )}

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {masjid.address_label && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {masjid.address_label}
                      </span>
                    )}
                    {masjid.contact_number && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {masjid.contact_number}
                      </span>
                    )}
                    {masjid.email && (
                      <a
                        href={`mailto:${masjid.email}`}
                        className="flex items-center gap-1 text-theme hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        {masjid.email}
                      </a>
                    )}
                    {masjid.website && (
                      <a
                        href={masjid.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-theme hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 lg:flex-nowrap lg:ml-6">
                  <button
                    onClick={() => setIsFollowed(!isFollowed)}
                    className={`flex-1 lg:flex-none px-6 py-3 rounded-lg font-semibold transition-colors ${
                      isFollowed
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-theme text-white hover:bg-theme-accent"
                    }`}
                  >
                    {isFollowed ? "Following" : "+ Follow"}
                  </button>

                  <a
                    href={`https://maps.google.com/maps?q=${encodeURIComponent(
                      masjid.address_label
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 lg:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
                  >
                    Directions
                  </a>

                  <Link
                    href={`/${masjid.slug}/contact`}
                    className="flex-1 lg:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
                  >
                    Contact
                  </Link>

                  <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-6 border-t border-gray-200">
              <div className="flex gap-8 pt-4 overflow-x-auto">
                {[
                  {
                    id: "prayer",
                    label: "Prayer Times",
                    count: dailyPrayers.length,
                  },
                  {
                    id: "announcements",
                    label: "Announcements",
                    count: announcements.length,
                  },
                  { id: "events", label: "Events", count: events.length },
                  {
                    id: "donations",
                    label: "Donations",
                    count: campaigns.length,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      // Smooth scroll to content area
                      const contentArea =
                        document.querySelector(".main-content-area");
                      if (contentArea) {
                        contentArea.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className={`flex items-center gap-2 pb-3 border-b-2 font-semibold whitespace-nowrap transition-all duration-200 ${
                      activeTab === tab.id
                        ? "border-theme text-theme transform scale-105"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-200"
                    }`}
                  >
                    {tab.label}
                    {tab.count !== undefined && (
                      <span
                        className={`text-sm px-2 py-1 rounded-full transition-colors ${
                          activeTab === tab.id
                            ? "bg-theme/10 text-theme"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Facebook/LinkedIn Style Layout */}
      <div className="main-content-area max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Tab Content */}
            {activeTab === "announcements" && (
              <div className="space-y-6">
                {announcements.length > 0 ? (
                  announcements.map((announcement) => {
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
                        masjidSlug={masjid.slug}
                        masjidLogo={masjid.logo}
                        masjidName={masjid.name}
                      />
                    );
                  })
                ) : (
                  <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No announcements yet
                    </h3>
                    <p className="text-gray-600">
                      Check back soon for community updates and announcements!
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "donations" && (
              <div className="space-y-6">
                {campaigns.length > 0 ? (
                  campaigns.map((campaign) => {
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
                        masjidSlug={masjid.slug}
                        masjidLogo={masjid.logo}
                        masjidName={masjid.name}
                      />
                    );
                  })
                ) : (
                  <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No active donations
                    </h3>
                    <p className="text-gray-600">
                      No donation campaigns are currently running.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "prayer" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Prayer Times
                  </h3>
                  <p className="text-gray-600">
                    {gregorianDate} • {islamicDate}
                  </p>
                </div>

                {/* Prayer Times Grid - Theme4 Style */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {[fajr, dhuhr, asr, maghrib, isha]
                    .filter(
                      (prayer): prayer is NonNullable<typeof prayer> =>
                        prayer !== undefined
                    )
                    .map((prayer) => (
                      <PrayerTimeCard
                        key={prayer.name}
                        name={prayer.name}
                        arabicName={prayer.arabic}
                        adhanTime={prayer.start}
                        iqamahTime={prayer.iqamah}
                        isActive={prayer.isActive || false}
                      />
                    ))}

                  {sunrise && (
                    <div className="text-center p-6 rounded-lg bg-gray-100 text-gray-700 shadow-sm transition-all">
                      <div className="mb-2">
                        <h3 className="text-lg font-medium uppercase text-gray-700">
                          Shurq شروق
                        </h3>
                      </div>
                      <div className="mb-1">
                        <span className="text-3xl md:text-4xl font-bold text-theme">
                          {sunrise.sunrise}
                        </span>
                      </div>
                      <div className="text-sm uppercase text-gray-500">
                        Sunrise
                      </div>
                    </div>
                  )}
                </div>

                {/* Jumu'ah - Theme4 Style */}
                {jummah && (
                  <div className="bg-gray-100 text-gray-700 shadow-sm p-6 rounded-lg transition-all">
                    <div className="text-center">
                      <div className="mb-2">
                        <h3 className="text-lg font-medium text-gray-700 uppercase">
                          Jumuah الجمعة
                        </h3>
                      </div>
                      <div className="mb-1">
                        <span className="text-3xl md:text-4xl font-bold text-theme">
                          {jummah.start}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 uppercase">
                        Khutbah {jummah.khutbah}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "events" && (
              <div className="space-y-6">
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <EventCardNew
                      key={event.id}
                      event={event}
                      slug={masjid.slug}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No upcoming events
                    </h3>
                    <p className="text-gray-600">
                      Stay tuned for community events and gatherings!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Prayer Times */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-theme" />
                Next Prayer
              </h3>
              {currentPrayer && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-theme mb-1">
                    {currentPrayer.start}
                  </div>
                  <div className="text-gray-600">{currentPrayer.name}</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Today • {gregorianDate}
                  </div>
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            {events.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-theme" />
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  {events.slice(0, 3).map((event) => {
                    const eventDate = event.date ? new Date(event.date) : null;
                    return (
                      <Link
                        key={event.id}
                        href={`/${masjid.slug}/event/${event.id}`}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {event.title}
                        </div>
                        {eventDate && (
                          <div className="text-xs text-gray-500 mt-1">
                            {format(eventDate, "MMM d, h:mm a")}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
                {events.length > 3 && (
                  <Link
                    href={`/${masjid.slug}/events`}
                    className="block mt-4 text-center text-theme text-sm font-medium hover:underline"
                  >
                    View All Events
                  </Link>
                )}
              </div>
            )}

            {/* Active Campaigns */}
            {campaigns.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-theme" />
                  Active Campaigns
                </h3>
                <div className="space-y-4">
                  {campaigns.slice(0, 2).map((campaign) => {
                    const progress =
                      (campaign.amount_raised / campaign.target_amount) * 100;
                    return (
                      <Link
                        key={campaign.id}
                        href={`/${masjid.slug}/donation/${campaign.id}`}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-semibold text-gray-900 text-sm line-clamp-1 mb-2">
                          {campaign.name}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="bg-theme h-2 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>
                            ${campaign.amount_raised.toLocaleString()}
                          </span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {campaigns.length > 2 && (
                  <Link
                    href={`/${masjid.slug}/donations`}
                    className="block mt-4 text-center text-theme text-sm font-medium hover:underline"
                  >
                    View All Campaigns
                  </Link>
                )}
              </div>
            )}

            {/* Nearby Masjids */}
            {nearbyMasjids.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-theme" />
                  Nearby Masjids
                </h3>
                <div className="space-y-3">
                  {nearbyMasjids.slice(0, 3).map((nearby) => (
                    <Link
                      key={nearby.id}
                      href={`/${nearby.slug}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-sm line-clamp-1">
                            {nearby.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {nearby.distance_miles} mi away
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Activity Feed Card Component for unified feed
function ActivityFeedCard({
  feedItem,
  masjidSlug,
  masjidLogo,
  masjidName,
}: {
  feedItem: FeedItem;
  masjidSlug: string;
  masjidLogo: string | null;
  masjidName: string;
}) {
  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    switch (feedItem.type) {
      case "announcement":
        const announcement = feedItem.data as Tables<"announcements">;
        return `${baseUrl}/${masjidSlug}/announcement/${announcement.id}`;
      case "event":
        const event = feedItem.data as Tables<"events">;
        return `${baseUrl}/${masjidSlug}/event/${event.id}`;
      case "campaign":
        const campaign = feedItem.data as Tables<"donation_campaigns">;
        return `${baseUrl}/${masjidSlug}/donation/${campaign.id}`;
      default:
        return `${baseUrl}/${masjidSlug}`;
    }
  };

  const handleShareClick = async () => {
    const url = getShareUrl();
    let title = "";
    let text = "";

    switch (feedItem.type) {
      case "announcement":
        const announcement = feedItem.data as Tables<"announcements">;
        title = announcement.title;
        text = `Check out this announcement from ${masjidName}`;
        break;
      case "event":
        const event = feedItem.data as Tables<"events">;
        title = event.title;
        text = `Join us for this event at ${masjidName}`;
        break;
      case "campaign":
        const campaign = feedItem.data as Tables<"donation_campaigns">;
        title = campaign.name;
        text = `Support this cause at ${masjidName}`;
        break;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        // Fall back to clipboard
        navigator.clipboard.writeText(url);
      }
    } else {
      navigator.clipboard.writeText(url);
    }
  };
  const getPostTypeIcon = () => {
    switch (feedItem.type) {
      case "announcement":
        return <Megaphone className="w-5 h-5 text-theme" />;
      case "event":
        return <Calendar className="w-5 h-5 text-theme" />;
      case "campaign":
        return <Heart className="w-5 h-5 text-theme" />;
    }
  };

  const getPostTypeLabel = () => {
    switch (feedItem.type) {
      case "announcement":
        return "shared an announcement";
      case "event":
        return "created an event";
      case "campaign":
        return "started a campaign";
    }
  };

  const renderContent = () => {
    switch (feedItem.type) {
      case "announcement":
        const announcement = feedItem.data as Tables<"announcements">;
        return (
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 leading-tight">
              {announcement.title}
            </h3>
            {announcement.description && (
              <p className="text-gray-700 text-sm md:text-base leading-relaxed line-clamp-4 md:line-clamp-3 mb-4">
                {announcement.description}
              </p>
            )}
            <Link
              href={`/${masjidSlug}/announcement/${announcement.id}`}
              className="inline-flex items-center gap-2 text-theme font-medium hover:underline text-sm md:text-base"
            >
              Read more
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </Link>
          </div>
        );

      case "event":
        const event = feedItem.data as Tables<"events">;
        const eventDate = event.date ? new Date(event.date) : null;
        return (
          <div>
            <div className="flex items-start gap-4 mb-4">
              {eventDate && (
                <div className="bg-theme text-white rounded-lg p-3 text-center flex-shrink-0">
                  <div className="text-2xl font-bold">
                    {format(eventDate, "d")}
                  </div>
                  <div className="text-xs uppercase">
                    {format(eventDate, "MMM")}
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-gray-700 leading-relaxed line-clamp-2 mb-3">
                    {event.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {eventDate && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(eventDate, "MMM d, h:mm a")}
                    </span>
                  )}
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {event.image && (
              <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            <Link
              href={`/${masjidSlug}/event/${event.id}`}
              className="inline-flex items-center gap-2 text-theme font-medium hover:underline"
            >
              View event details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        );

      case "campaign":
        const campaign = feedItem.data as Tables<"donation_campaigns">;
        const progress =
          (campaign.amount_raised / campaign.target_amount) * 100;
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {campaign.name}
            </h3>
            {campaign.description && (
              <p className="text-gray-700 leading-relaxed line-clamp-2 mb-4">
                {campaign.description}
              </p>
            )}
            {campaign.image && (
              <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
                <Image
                  src={campaign.image}
                  alt={campaign.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${campaign.amount_raised.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">raised</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-700">
                    ${campaign.target_amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">goal</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-theme h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="text-theme text-sm font-medium">
                {Math.round(progress)}% complete
              </div>
            </div>
            <Link
              href={`/${masjidSlug}/donation/${campaign.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-theme text-white rounded-lg font-medium hover:bg-theme-accent transition-colors"
            >
              <Heart className="w-4 h-4" />
              Donate Now
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow">
      {/* Post Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-theme/10 flex items-center justify-center flex-shrink-0">
          {masjidLogo ? (
            <Image
              src={masjidLogo}
              alt={`${masjidName} logo`}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          ) : (
            <span className="text-theme font-bold text-sm md:text-lg">
              {masjidName.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 md:gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm md:text-base truncate">
              {masjidName}
            </span>
            <span className="text-gray-600 text-xs md:text-sm">
              {getPostTypeLabel()}
            </span>
            <div className="flex-shrink-0">{getPostTypeIcon()}</div>
          </div>
          <div className="text-xs md:text-sm text-gray-500 mt-1">
            {formatDistanceToNow(feedItem.timestamp, { addSuffix: true })}
          </div>
        </div>
        <button
          onClick={handleShareClick}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
          title="Share"
        >
          <Share2 className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">{renderContent()}</div>
    </div>
  );
}

// Sub-components
function PrayerTimeCard({
  name,
  arabicName,
  adhanTime,
  iqamahTime,
  isActive = false,
}: {
  name: string;
  arabicName: string;
  adhanTime: string;
  iqamahTime: string | null;
  isActive?: boolean;
}) {
  return (
    <div
      className={`text-center p-6 rounded-lg transition-all ${
        isActive
          ? "bg-theme text-white shadow-lg"
          : "bg-gray-100 text-gray-700 shadow-sm"
      }`}
    >
      <div className="mb-2">
        <h3
          className={`text-lg font-medium uppercase ${
            isActive ? "text-white" : "text-gray-700"
          }`}
        >
          {name} {arabicName}
        </h3>
      </div>
      <div className="mb-1">
        <span
          className={`text-3xl md:text-4xl font-bold ${
            isActive ? "text-white" : "text-theme"
          }`}
        >
          {adhanTime}
        </span>
      </div>
      {iqamahTime && (
        <div
          className={`text-sm uppercase ${
            isActive ? "text-theme-accent" : "text-gray-500"
          }`}
        >
          Iqamah {iqamahTime}
        </div>
      )}
    </div>
  );
}

function EventCardNew({
  event,
  slug,
  index,
}: {
  event: Tables<"events">;
  slug: string;
  index: number;
}) {
  const startDate = event.date ? new Date(event.date) : null;

  const gradients = [
    "from-purple-500 to-pink-600",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-cyan-500 to-blue-600",
    "from-pink-500 to-rose-600",
  ];

  const eventIcons = ["🎉", "📚", "🤝", "🎯", "💡", "🌟"];

  return (
    <Link href={`/${slug}/event/${event.id}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Event Image or Gradient Header */}
        {event.image ? (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {startDate && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-lg p-3 text-center shadow-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {format(startDate, "d")}
                </div>
                <div className="text-xs uppercase text-gray-600 font-medium">
                  {format(startDate, "MMM")}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`relative h-48 bg-gradient-to-br ${
              gradients[index % gradients.length]
            } flex items-center justify-center overflow-hidden`}
          >
            <div className="absolute inset-0 opacity-20" />
            <div className="relative text-6xl">
              {eventIcons[index % eventIcons.length]}
            </div>

            {startDate && (
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-lg p-3 text-center border border-white/30">
                <div className="text-2xl font-bold text-white">
                  {format(startDate, "d")}
                </div>
                <div className="text-xs uppercase text-white/80 font-medium">
                  {format(startDate, "MMM")}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-theme transition-colors">
            {event.title}
          </h3>

          {event.description && (
            <p className="text-gray-600 leading-relaxed line-clamp-2 mb-4">
              {event.description}
            </p>
          )}

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            {startDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-theme" />
                <span>{format(startDate, "MMMM d, yyyy 'at' h:mm a")}</span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-theme" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}

            {event.recurrence && (
              <div className="flex items-center gap-2 text-sm text-theme font-medium">
                <Calendar className="w-4 h-4" />
                <span>Recurring Event</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-theme group-hover:underline">
              View Details
            </span>
            <ArrowRight className="w-5 h-5 text-theme group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
