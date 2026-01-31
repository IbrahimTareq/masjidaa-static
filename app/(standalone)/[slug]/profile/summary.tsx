"use client";

import { usePrayerScreen } from "@/hooks/usePrayerScreen";
import { getDistanceLabel } from "@/utils/distance";
import { expandEventsWithRecurrence, getEventUrl } from "@/utils/recurrence";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin as Compass,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { SummaryClientProps } from "./types";

// Tab Components
import { APPLE_APP_ID } from "@/utils/shared/constants";
import { AnnouncementsTab } from "./components/tabs/AnnouncementsTab";
import { DonationsTab } from "./components/tabs/DonationsTab";
import { EventsTab } from "./components/tabs/EventsTab";
import { PrayerTimesTab } from "./components/tabs/PrayerTimesTab";
import { VideosTab } from "./components/tabs/VideosTab";

const APP_STORE_URL =
  `https://apps.apple.com/us/app/pillars-prayer-times-qibla/id${APPLE_APP_ID}`;
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.pillars.pillars";
const APP_DEEP_LINK = "pillars://masjid/";

export default function SummaryClient({
  masjid,
  prayerData,
  announcements,
  campaigns,
  events,
  followerCount,
  businessAds,
  nearbyMasjids,
  location,
  youtubeChannelId,
  youtubeChannelInfo,
  youtubeVideos,
  youtubeNextPageToken,
  youtubeUploadsPlaylistId,
}: SummaryClientProps) {
  const [activeTab, setActiveTab] = useState("prayer");
  const [isCopied, setIsCopied] = useState(false);

  const handleFollowClick = useCallback(
    (e: React.MouseEvent) => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /android/i.test(userAgent);

      // Only attempt deep link on mobile devices
      if (!isIOS && !isAndroid) {
        // Desktop - just open App Store in new tab
        window.open(APP_STORE_URL, "_blank");
        e.preventDefault();
        return;
      }

      e.preventDefault();

      const storeUrl = isIOS ? APP_STORE_URL : PLAY_STORE_URL;
      const deepLink = `${APP_DEEP_LINK}${masjid.id}`;
      const startTime = Date.now();

      // Try to open the app
      window.location.href = deepLink;

      // Check if page is still visible after a delay
      // If app opened, page will be hidden/blurred
      const checkVisibility = () => {
        const elapsed = Date.now() - startTime;
        // If we're still here after 1.5s and page wasn't hidden, app isn't installed
        if (elapsed > 1500 && !document.hidden) {
          window.location.href = storeUrl;
        }
      };

      // Use both timeout and visibility change for reliability
      const timeoutId = setTimeout(checkVisibility, 1500);

      const handleVisibilityChange = () => {
        if (document.hidden) {
          // App opened successfully, clean up
          clearTimeout(timeoutId);
          document.removeEventListener("visibilitychange", handleVisibilityChange);
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Clean up listener after timeout
      setTimeout(() => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }, 2000);
    },
    [masjid.id]
  );

  const handleShareClick = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/${masjid.slug}/profile`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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

  // Expand events with recurring instances for the next 3 months
  const expandedEvents = expandEventsWithRecurrence(events, 3);

  // Use the proper prayer screen hook for next prayer logic
  const { nextEvent, countdown } = usePrayerScreen(prayerData.prayerInfo);

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
                <div className="w-32 h-32 rounded-lg bg-white p-2 shadow-lg">
                  {masjid.logo ? (
                    <Image
                      src={masjid.logo}
                      alt={`${masjid.name} logo`}
                      fill
                      className="rounded-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-theme/10 flex items-center justify-center" />
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
                        : "No"}{" "}
                      {followerCount === 1 ? "follower" : "followers"}
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
                    {location?.address_label && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {location.address_label}
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
                        {masjid.website}
                      </a>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 lg:flex-nowrap lg:ml-6">
                  <button
                    onClick={handleFollowClick}
                    className="flex-1 lg:flex-none px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer bg-theme text-white hover:bg-theme/90 text-center"
                  >
                    + Follow
                  </button>

                  {location?.address_label && (
                    <a
                      href={`https://maps.google.com/maps?q=${encodeURIComponent(
                        location.address_label
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 lg:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
                    >
                      Directions
                    </a>
                  )}

                  <Link
                    href={`/${masjid.slug}/contact`}
                    className="flex-1 lg:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
                  >
                    Contact
                  </Link>

                  <button
                    onClick={handleShareClick}
                    className={`px-4 py-3 rounded-lg transition-colors cursor-pointer ${isCopied
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    title={isCopied ? "Link copied!" : "Copy profile link"}
                  >
                    {isCopied ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Share2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-6 border-t border-gray-200">
              <div className="flex gap-8 pl-1 pt-4 overflow-x-auto overflow-y-hidden">
                {[
                  {
                    id: "prayer",
                    label: "Prayer Times",
                    count: undefined,
                  },
                  {
                    id: "announcements",
                    label: "Announcements",
                    count: announcements.length,
                  },
                  {
                    id: "events",
                    label: "Events",
                    count: expandedEvents.length,
                  },
                  {
                    id: "donations",
                    label: "Donations",
                    count: campaigns.length,
                  },
                  // Conditionally add Videos tab if YouTube channel exists
                  ...(youtubeChannelId &&
                    youtubeVideos &&
                    youtubeVideos.length > 0
                    ? [
                      {
                        id: "videos",
                        label: "Videos",
                        count: undefined,
                      },
                    ]
                    : []),
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
                    className={`flex items-center gap-2 pb-3 border-b-2 font-semibold whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                        ? "border-theme text-theme transform scale-105"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-200"
                      }`}
                  >
                    {tab.label}
                    {tab.count !== undefined && (
                      <span
                        className={`text-sm px-2 py-1 rounded-full transition-colors ${activeTab === tab.id
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
              <AnnouncementsTab
                announcements={announcements}
                businessAds={businessAds}
                masjidSlug={masjid.slug}
                masjidLogo={masjid.logo}
                masjidName={masjid.name}
              />
            )}

            {activeTab === "donations" && (
              <DonationsTab
                campaigns={campaigns}
                businessAds={businessAds}
                masjidSlug={masjid.slug}
                masjidLogo={masjid.logo}
                masjidName={masjid.name}
              />
            )}

            {activeTab === "prayer" && (
              <PrayerTimesTab
                dailyPrayers={[fajr, dhuhr, asr, maghrib, isha]}
                sunrise={sunrise || null}
                jummah={jummah}
                gregorianDate={gregorianDate}
                islamicDate={islamicDate}
                businessAds={businessAds}
              />
            )}

            {activeTab === "events" && (
              <EventsTab
                expandedEvents={expandedEvents}
                businessAds={businessAds}
                masjidSlug={masjid.slug}
                masjidLogo={masjid.logo}
                masjidName={masjid.name}
              />
            )}

            {activeTab === "videos" &&
              youtubeChannelId &&
              youtubeChannelInfo &&
              youtubeUploadsPlaylistId && (
                <VideosTab
                  channelId={youtubeChannelId}
                  channelInfo={youtubeChannelInfo}
                  initialVideos={youtubeVideos || []}
                  initialNextPageToken={youtubeNextPageToken || null}
                  uploadsPlaylistId={youtubeUploadsPlaylistId}
                />
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Prayer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-theme" />
                Next {nextEvent.label === "iqamah" ? "Iqamah" : "Prayer"}
              </h3>
              {nextEvent.time ? (
                <div className="text-center">
                  <div className="text-2xl font-bold text-theme mb-1">
                    {nextEvent.time}
                  </div>
                  <div className="text-gray-600 font-medium mb-2 uppercase">
                    {nextEvent.prayer}{" "}
                    {nextEvent.label === "iqamah" ? "Iqamah" : ""}
                  </div>
                  <div className="bg-theme/10 text-theme px-3 py-1 rounded-full text-sm font-semibold mb-2">
                    {countdown.hours}:{countdown.minutes}:{countdown.seconds}
                  </div>
                  <div className="text-sm text-gray-500">
                    Today • {gregorianDate}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Prayer times not available</p>
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            {expandedEvents.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-theme" />
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  {expandedEvents.slice(0, 3).map((event) => {
                    const eventDate = event.date ? new Date(event.date) : null;
                    const eventUrl = getEventUrl(event, masjid.slug);

                    return (
                      <Link
                        key={event.id}
                        href={eventUrl}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {event.title}
                          {event.isRecurring && (
                            <span className="ml-2 text-xs text-theme font-medium">
                              (Recurring)
                            </span>
                          )}
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
                {expandedEvents.length > 3 && (
                  <Link
                    href={`/${masjid.slug}/events`}
                    className="block mt-4 text-center text-theme text-sm font-medium hover:underline"
                  >
                    View All Events
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
                            {getDistanceLabel(
                              nearby.distance_meters,
                              location?.country_code ?? "GB"
                            )}
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
