import { Tables } from "@/database.types";
import { format } from "date-fns";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  event: Tables<"events">;
  slug: string;
  index: number;
}

export function EventCard({ event, slug, index }: EventCardProps) {
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

