"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { Tables } from "@/database.types";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { ApprovedBusinessAd } from "@/lib/server/services/businessAd";
import { NearbyMasjid } from "@/lib/server/services/nearbyMasjids";
import { DisplayDates } from "@/lib/server/services/masjidDates";
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Heart,
  Share2,
  Navigation,
  ArrowRight,
  Star,
  Sparkles,
  Bell,
  MapPin as Compass
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";

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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean & Minimal */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          {/* Mosque Name */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-900 leading-tight">
            {masjid.name}
          </h1>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${masjid.slug}/app-download`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-theme text-white rounded-lg font-medium hover:bg-theme-accent transition-colors"
            >
              <Heart className="w-4 h-4" />
              Follow Masjid
            </Link>

            <a
              href={`https://maps.google.com/maps?q=${encodeURIComponent(masjid.address_label)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </a>

            <Link
              href={`/${masjid.slug}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Contact
            </Link>
          </div>
        </div>
      </section>

      {/* Prayer Times Section - Clean & Consistent */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Prayer Times
            </h2>
            <p className="text-gray-600 text-lg">
              {gregorianDate} • {islamicDate}
            </p>
          </div>

          {/* Prayer Times Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Fajr */}
            {fajr && (
              <PrayerTimeCard
                name={fajr.name}
                arabicName={fajr.arabic}
                adhanTime={fajr.start}
                iqamahTime={fajr.iqamah}
              />
            )}

            {/* Sunrise */}
            {sunrise && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Shurq</h3>
                  <p className="text-gray-600 text-sm">شروق</p>
                </div>
                <div className="text-3xl font-bold text-theme mb-2">
                  {sunrise.sunrise}
                </div>
                <div className="text-gray-500 text-sm">Sunrise</div>
              </div>
            )}

            {/* Dhuhr */}
            {dhuhr && (
              <PrayerTimeCard
                name={dhuhr.name}
                arabicName={dhuhr.arabic}
                adhanTime={dhuhr.start}
                iqamahTime={dhuhr.iqamah}
              />
            )}

            {/* Asr */}
            {asr && (
              <PrayerTimeCard
                name={asr.name}
                arabicName={asr.arabic}
                adhanTime={asr.start}
                iqamahTime={asr.iqamah}
              />
            )}

            {/* Maghrib */}
            {maghrib && (
              <PrayerTimeCard
                name={maghrib.name}
                arabicName={maghrib.arabic}
                adhanTime={maghrib.start}
                iqamahTime={maghrib.iqamah}
              />
            )}

            {/* Isha */}
            {isha && (
              <PrayerTimeCard
                name={isha.name}
                arabicName={isha.arabic}
                adhanTime={isha.start}
                iqamahTime={isha.iqamah}
              />
            )}
          </div>

          {/* Jumu'ah Card */}
          {jummah && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Jumu'ah Prayer
                  </h3>
                  <p className="text-gray-600 text-lg mb-2">الجمعة</p>
                  <p className="text-gray-600">
                    Khutbah begins at {jummah.khutbah}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-theme mb-2">
                    {jummah.start}
                  </div>
                  <div className="text-gray-500 text-sm">Every Friday</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Community Updates */}
      {announcements.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Recent Announcements
              </h2>
              <p className="text-gray-600 text-lg">
                Stay connected with the latest community news
              </p>
            </div>

            {/* Announcement Cards */}
            <div className="space-y-6">
              {announcements.slice(0, 5).map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  slug={masjid.slug}
                />
              ))}
            </div>

            {/* View More Button */}
            {announcements.length > 5 && (
              <div className="mt-8 text-center">
                <Link
                  href={`/${masjid.slug}/announcements`}
                  className="inline-flex items-center gap-2 text-theme hover:underline font-medium"
                >
                  View All Announcements
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Donations Section */}
      {campaigns.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Donations
              </h2>
              <p className="text-gray-600 text-lg">
                Support our community and help those in need
              </p>
            </div>

            {/* Donation Campaigns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} slug={masjid.slug} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      {events.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Events
              </h2>
              <p className="text-gray-600 text-lg">
                Join us for meaningful community gatherings
              </p>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 9).map((event) => (
                <EventCard key={event.id} event={event} slug={masjid.slug} />
              ))}
            </div>

            {/* View More Button */}
            {events.length > 9 && (
              <div className="mt-8 text-center">
                <Link
                  href={`/${masjid.slug}/events`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-theme text-white rounded-lg font-medium hover:bg-theme-accent transition-colors"
                >
                  See All Events
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Local Businesses Section */}
      {businessAds.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Local Businesses
              </h2>
              <p className="text-gray-600 text-lg">
                Support our community businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {businessAds.map((ad) => (
                <BusinessAdCard key={ad.id} ad={ad} />
              ))}
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Advertise with Us
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Reach our engaged community with targeted local advertising
              </p>
              <Link
                href={`/${masjid.slug}/contact`}
                className="inline-block px-8 py-3 bg-theme text-white rounded-lg font-medium hover:bg-theme-accent transition-colors"
              >
                Submit Ad Request
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Nearby Masjids Section */}
      {nearbyMasjids.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Nearby Masjids
              </h2>
              <p className="text-gray-600 text-lg">
                Discover other mosques in your area
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyMasjids.map((nearby) => (
                <NearbyMasjidCard key={nearby.id} masjid={nearby} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Sub-components
function PrayerTimeCard({
  name,
  arabicName,
  adhanTime,
  iqamahTime,
}: {
  name: string;
  arabicName: string;
  adhanTime: string;
  iqamahTime: string | null;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-600 text-sm">{arabicName}</p>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-3xl font-bold text-theme">{adhanTime}</p>
        </div>
        {iqamahTime && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Iqamah الإقامة</p>
            <p className="text-xl font-semibold text-gray-700">{iqamahTime}</p>
          </div>
        )}
      </div>
    </div>
  );
}


function AnnouncementCard({
  announcement,
  slug,
}: {
  announcement: Tables<"announcements">;
  slug: string;
}) {
  const createdDate = announcement.created_at
    ? new Date(announcement.created_at)
    : new Date();
  const updatedDate = announcement.updated_at
    ? new Date(announcement.updated_at)
    : null;

  const hasBeenEdited =
    updatedDate && updatedDate.getTime() - createdDate.getTime() > 1000;

  return (
    <Link
      href={`/${slug}/announcement/${announcement.id}`}
      className="block bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span>{formatDistanceToNow(createdDate, { addSuffix: true })}</span>
          {hasBeenEdited && (
            <span className="text-gray-400">
              • Edited {formatDistanceToNow(updatedDate, { addSuffix: true })}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {announcement.title}
        </h3>
        {announcement.description && (
          <p className="text-gray-600 line-clamp-3 leading-relaxed">
            {announcement.description}
          </p>
        )}
      </div>
    </Link>
  );
}


function CampaignCard({
  campaign,
  slug,
}: {
  campaign: Tables<"donation_campaigns">;
  slug: string;
}) {
  const progress = (campaign.amount_raised / campaign.target_amount) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      {campaign.image && (
        <div className="relative h-48 w-full">
          <Image
            src={campaign.image}
            alt={campaign.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{campaign.name}</h3>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-gray-900">
              ${campaign.amount_raised.toLocaleString()}
            </span>
            <span className="text-gray-600">
              Goal: ${campaign.target_amount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-theme h-3 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {Math.round(progress)}% complete
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/${slug}/donation/${campaign.id}`}
            className="flex-1 px-4 py-3 bg-theme text-white rounded-lg font-medium text-center hover:bg-theme-accent transition-colors"
          >
            Donate
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              const url = `${window.location.origin}/${slug}/donation/${campaign.id}`;
              navigator.clipboard.writeText(url);
            }}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

function CampaignCardFeatured({
  campaign,
  slug,
}: {
  campaign: Tables<"donation_campaigns">;
  slug: string;
}) {
  const progress = (campaign.amount_raised / campaign.target_amount) * 100;

  return (
    <div className="relative bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-8 shadow-2xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/pattern8.jpg')] bg-repeat" style={{ backgroundSize: "50px" }} />
      </div>

      {/* Featured Badge */}
      <div className="absolute -top-3 right-8">
        <div className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
          <Star className="w-4 h-4" />
          FEATURED CAMPAIGN
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Campaign Image */}
        {campaign.image && (
          <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden">
            <Image
              src={campaign.image}
              alt={campaign.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        )}

        {/* Campaign Details */}
        <div className={campaign.image ? "" : "lg:col-span-2"}>
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {campaign.name}
          </h3>

          {campaign.description && (
            <p className="text-emerald-100 text-lg mb-6 leading-relaxed">
              {campaign.description}
            </p>
          )}

          {/* Progress Stats */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <div className="text-white">
                <div className="text-3xl font-bold">
                  ${campaign.amount_raised.toLocaleString()}
                </div>
                <div className="text-emerald-200">raised</div>
              </div>
              <div className="text-right text-white">
                <div className="text-xl font-semibold">
                  ${campaign.target_amount.toLocaleString()}
                </div>
                <div className="text-emerald-200">goal</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-emerald-800/50 rounded-full h-4 mb-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="text-emerald-200 text-sm">
              {Math.round(progress)}% complete
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              href={`/${slug}/donation/${campaign.id}`}
              className="group flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-white text-emerald-700 rounded-2xl font-bold hover:bg-emerald-50 transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              <Heart className="w-5 h-5 group-hover:animate-pulse" />
              Donate Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => {
                const url = `${window.location.origin}/${slug}/donation/${campaign.id}`;
                navigator.share?.({
                  title: campaign.name,
                  text: `Support ${campaign.name}`,
                  url,
                }) || navigator.clipboard.writeText(url);
              }}
              className="px-6 py-4 bg-emerald-700/50 border border-emerald-400/30 text-white rounded-2xl font-semibold hover:bg-emerald-700/70 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignCardNew({
  campaign,
  slug,
}: {
  campaign: Tables<"donation_campaigns">;
  slug: string;
}) {
  const progress = (campaign.amount_raised / campaign.target_amount) * 100;

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl border border-white/60 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
      {campaign.image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={campaign.image}
            alt={campaign.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
          {campaign.name}
        </h3>

        {/* Progress */}
        <div className="mb-6">
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
              className="bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-emerald-600 text-sm font-medium">
            {Math.round(progress)}% complete
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/${slug}/donation/${campaign.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all transform hover:scale-105"
          >
            <Heart className="w-4 h-4" />
            Donate
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              const url = `${window.location.origin}/${slug}/donation/${campaign.id}`;
              navigator.clipboard.writeText(url);
            }}
            className="px-4 py-3 border border-emerald-300 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, slug }: { event: Tables<"events">; slug: string }) {
  const startDate = event.date ? new Date(event.date) : null;

  return (
    <Link
      href={`/${slug}/event/${event.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
    >
      {event.image && (
        <div className="relative h-48 w-full">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
        {startDate && (
          <div className="mb-4">
            <div className="inline-block bg-theme text-white px-4 py-2 rounded-lg">
              <p className="text-2xl font-bold">{format(startDate, "d")}</p>
              <p className="text-sm uppercase">{format(startDate, "MMM")}</p>
            </div>
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
        {event.location && (
          <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" />
            {event.location}
          </p>
        )}
        {event.recurrence && (
          <p className="text-sm text-theme font-medium">Recurring Event</p>
        )}
      </div>
    </Link>
  );
}

function EventCardNew({
  event,
  slug,
  index
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
    <Link
      href={`/${slug}/event/${event.id}`}
      className="group block"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl border border-white/60 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
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
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 text-center shadow-lg">
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
          <div className={`relative h-48 bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center overflow-hidden`}>
            <div className="absolute inset-0 opacity-20 bg-[url('/pattern8.jpg')] bg-repeat" style={{ backgroundSize: "30px" }} />
            <div className="relative text-6xl">{eventIcons[index % eventIcons.length]}</div>

            {startDate && (
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-2xl p-3 text-center border border-white/30">
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
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
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
                <Clock className="w-4 h-4 text-purple-500" />
                <span>{format(startDate, "MMMM d, yyyy 'at' h:mm a")}</span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-purple-500" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}

            {event.recurrence && (
              <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                <Calendar className="w-4 h-4" />
                <span>Recurring Event</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-purple-600 group-hover:text-purple-700">
              View Details
            </span>
            <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function BusinessAdCard({ ad }: { ad: ApprovedBusinessAd }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      {ad.image && (
        <div className="relative h-48 w-full">
          <Image
            src={ad.image}
            alt={ad.name ?? ad.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {ad.name ?? ad.title}
        </h3>
        {ad.message && <p className="text-gray-600 mb-4 leading-relaxed">{ad.message}</p>}
        {ad.website && (
          <a
            href={ad.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-theme hover:underline font-medium"
          >
            Visit Website
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

function NearbyMasjidCard({ masjid }: { masjid: NearbyMasjid }) {
  return (
    <Link
      href={`/${masjid.slug}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex-1">{masjid.name}</h3>
        <span className="text-sm font-semibold text-theme bg-theme/10 px-3 py-1 rounded-full">
          {masjid.distance_miles} mi
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <Users className="w-4 h-4" />
        <span>{masjid.follower_count} Followers</span>
      </div>

      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{masjid.address_label}</p>

      {masjid.has_prayer_times ? (
        <p className="text-sm text-green-600 font-medium">✓ Prayer times available</p>
      ) : (
        <p className="text-sm text-gray-500">
          Prayer times not available
        </p>
      )}
    </Link>
  );
}

