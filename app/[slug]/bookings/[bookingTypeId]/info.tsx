"use client";

import BookingFAQ from "@/components/client/interactive/BookingFAQ";
import { formatCurrencyWithSymbol } from "@/utils/currency";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

interface MasjidDTO {
  id: string;
  name: string;
  local_currency: string;
}

interface BookingTypeDTO {
  id: string;
  name: string;
  price: number | null;
  duration_minutes: number | null;
  long_description: string | null;
  faqs: FAQItem[] | null;
}

interface BookingInfoProps {
  masjid: MasjidDTO;
  bookingType: BookingTypeDTO;
  slug: string;
}

const BookingInfo: React.FC<BookingInfoProps> = ({
  masjid,
  bookingType,
  slug,
}) => {
  const hasPrice =
    bookingType.price !== null &&
    bookingType.price !== undefined &&
    bookingType.price > 0;

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "Duration varies";
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <Link
          href={`/${slug}/bookings`}
          className="inline-flex items-center text-theme mb-6 hover:text-theme-gradient transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to all services
        </Link>

        {/* Service Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {bookingType.name}
              </h1>
            </div>
            {hasPrice && (
              <div className="text-right">
                <div className="text-3xl font-bold text-theme">
                  {formatCurrencyWithSymbol({
                    amount: bookingType.price!,
                    currency: masjid.local_currency,
                    decimals: 2,
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Service Metadata */}
          <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span>{formatDuration(bookingType.duration_minutes)}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{masjid.name}</span>
            </div>
            {!hasPrice && (
              <div className="flex items-center space-x-2 text-green-600 font-medium">
                <span>Free Service</span>
              </div>
            )}
          </div>

          {/* Description */}
          {bookingType.long_description && (
            <div className="mt-6">
              <div
                className="prose prose-gray max-w-none text-gray-600 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2"
                dangerouslySetInnerHTML={{
                  __html: bookingType.long_description,
                }}
              />
            </div>
          )}

          {/* CTA Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href={`/${slug}/bookings/${bookingType.id}/book`}
              className="block w-full bg-theme hover:bg-theme-gradient text-white font-semibold text-center px-8 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Book This Service →
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        {bookingType.faqs && bookingType.faqs.length > 0 && (
          <BookingFAQ faqs={bookingType.faqs} />
        )}
      </div>
    </div>
  );
};

export default BookingInfo;
