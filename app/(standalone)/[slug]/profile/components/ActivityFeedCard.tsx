"use client";

import { Tables } from "@/database.types";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  Calendar,
  Clock,
  Heart,
  MapPin,
  Megaphone,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getEventUrl } from "@/utils/recurrence";
import { FeedItem, ExpandedEvent } from "../types";

interface ActivityFeedCardProps {
  feedItem: FeedItem;
  masjidSlug: string;
  masjidLogo: string | null;
  masjidName: string;
}

export function ActivityFeedCard({
  feedItem,
  masjidSlug,
  masjidLogo,
  masjidName,
}: ActivityFeedCardProps) {
  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    switch (feedItem.type) {
      case "announcement":
        const announcement = feedItem.data as Tables<"announcements">;
        return `${baseUrl}/${masjidSlug}/announcement/${announcement.id}`;
      case "event":
        const event = feedItem.data as Tables<"events"> | ExpandedEvent;
        return getEventUrl(event, masjidSlug, true);
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
              <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 whitespace-pre-line">
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
        const event = feedItem.data as Tables<"events"> | ExpandedEvent;
        const expandedEvent = event as ExpandedEvent;
        const eventDate = event.date ? new Date(event.date) : null;
        const eventUrl = getEventUrl(event, masjidSlug);
        
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
                  {expandedEvent.isRecurring && (
                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 text-xs bg-theme/10 text-theme rounded-full font-medium">
                      <Calendar className="w-3 h-3" />
                      Recurring
                    </span>
                  )}
                </h3>
                {event.description && (
                  <p className="text-gray-700 leading-relaxed mb-3 whitespace-pre-line">
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
              href={eventUrl}
              className="inline-flex items-center gap-2 text-theme font-medium hover:underline"
            >
              View event details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        );

      case "campaign":
        const campaign = feedItem.data as Tables<"donation_campaigns">;
        const hasTarget = campaign.target_amount != null && campaign.target_amount > 0;
        const progress = hasTarget
          ? (campaign.amount_raised / campaign.target_amount!) * 100
          : 0;
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {campaign.name}
            </h3>
            {campaign.description && (
              <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
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
                {hasTarget && (
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-700">
                      ${campaign.target_amount!.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">goal</div>
                  </div>
                )}
              </div>
              {hasTarget && (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-theme h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="text-theme text-sm font-medium">
                    {Math.round(progress)}% complete
                  </div>
                </>
              )}
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

