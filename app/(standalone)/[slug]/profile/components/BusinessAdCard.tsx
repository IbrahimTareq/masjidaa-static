import { Globe, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { ApprovedBusinessAd } from "../types";

interface BusinessAdCardProps {
  ad: ApprovedBusinessAd;
}

/**
 * Business Ad Card Component
 * Displays business advertisements with professional styling
 */
export function BusinessAdCard({ ad }: BusinessAdCardProps) {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-200 p-4 md:p-6 relative overflow-hidden">
      {/* Sponsored Badge */}
      <div className="absolute top-3 right-3">
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded-full font-medium border border-amber-200">
          Sponsored
        </span>
      </div>

      <div className="flex items-start gap-4">
        {/* Business Image */}
        {ad.image && (
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-amber-200">
            <Image
              src={ad.image}
              alt={ad.name || ad.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Business Title */}
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 pr-16">
            {ad.title}
          </h3>

          {/* Business Name */}
          {ad.name && ad.name !== ad.title && (
            <p className="text-amber-700 font-medium text-sm mb-2">{ad.name}</p>
          )}

          {/* Business Message */}
          {ad.message && (
            <p className="text-gray-700 text-sm md:text-base leading-relaxed line-clamp-2 mb-3">
              {ad.message}
            </p>
          )}

          {/* Business Details */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            {ad.address && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span className="line-clamp-1">{ad.address}</span>
              </span>
            )}
            {ad.contact_number && (
              <a
                href={`tel:${ad.contact_number}`}
                className="flex items-center gap-1 text-amber-600 hover:text-amber-700"
              >
                <Phone className="w-4 h-4" />
                {ad.contact_number}
              </a>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {ad.website && (
              <a
                href={ad.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors text-sm"
              >
                <Globe className="w-4 h-4" />
                Visit Website
              </a>
            )}
            {ad.contact_email && (
              <a
                href={`mailto:${ad.contact_email}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-amber-700 border border-amber-300 rounded-lg font-medium hover:bg-amber-50 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                Contact
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
