import { Metadata } from "next";
import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getBookingTypeById } from "@/lib/server/services/bookingTypes";
import { getBookingAvailabilitiesByTypeId } from "@/lib/server/services/bookingAvailabilities";
import { getMasjidLocationByMasjidId } from "@/lib/server/services/masjidLocation";
import { getActiveBlackoutsByTypeId } from "@/lib/server/services/bookingBlackouts";
import BookingClient from "./booking";
import { Tables } from "@/database.types";

// Lightweight DTOs for client-side transfer
interface MasjidDTO {
  id: string;
  name: string;
}

interface BookingTypeDTO {
  id: string;
  name: string;
  price: number | null;
  duration_minutes: number | null;
  long_description: string | null;
  min_advance_booking_hours: number | null;
  max_advance_booking_days: number | null;
}

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string; bookingTypeId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, bookingTypeId } = await params;
  const [masjid, bookingType] = await Promise.all([
    getMasjidBySlug(slug),
    getBookingTypeById(bookingTypeId),
  ]);

  if (!masjid || !bookingType) {
    return {
      title: "Booking - Page Not Found",
      description: "The requested booking service could not be found.",
    };
  }

  const title = `Book ${bookingType.name} - ${masjid.name}`;
  const description = bookingType.short_description
    ? `${bookingType.short_description} Schedule your appointment at ${masjid.name}.`
    : `Schedule your ${bookingType.name} appointment at ${masjid.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      siteName: "Masjidaa",
      url: `https://masjidaa.com/${slug}/bookings/${bookingTypeId}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BookingTypePage({ params }: PageProps) {
  const { slug, bookingTypeId } = await params;

  // First get the masjid and booking type
  const [masjid, bookingType] = await Promise.all([
    getMasjidBySlug(slug),
    getBookingTypeById(bookingTypeId),
  ]);

  if (!masjid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Masjid Not Found
          </h1>
          <p className="text-gray-600">
            The requested masjid could not be found.
          </p>
        </div>
      </div>
    );
  }

  if (!bookingType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Service Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The requested booking service could not be found.
          </p>
          <a
            href={`/${slug}/bookings`}
            className="text-theme hover:text-theme-accent underline"
          >
            ← Back to all services
          </a>
        </div>
      </div>
    );
  }

  if (!bookingType.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Service Unavailable
          </h1>
          <p className="text-gray-600 mb-4">
            This booking service is currently unavailable.
          </p>
          <a
            href={`/${slug}/bookings`}
            className="text-theme hover:text-theme-accent underline"
          >
            ← Back to all services
          </a>
        </div>
      </div>
    );
  }

  // Verify booking type belongs to this masjid
  if (bookingType.masjid_id !== masjid.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Service Not Available
          </h1>
          <p className="text-gray-600 mb-4">
            This booking service is not available at this masjid.
          </p>
          <a
            href={`/${slug}/bookings`}
            className="text-theme hover:text-theme-accent underline"
          >
            ← Back to all services
          </a>
        </div>
      </div>
    );
  }

  // Parallel fetch related data
  const [availabilities, location, blackouts] = await Promise.all([
    getBookingAvailabilitiesByTypeId(bookingTypeId),
    getMasjidLocationByMasjidId(masjid.id),
    getActiveBlackoutsByTypeId(bookingTypeId),
  ]);

  // Create optimized DTOs for client transfer
  const masjidDTO: MasjidDTO = {
    id: masjid.id,
    name: masjid.name,
  };

  const bookingTypeDTO: BookingTypeDTO = {
    id: bookingType.id,
    name: bookingType.name,
    price: bookingType.price,
    duration_minutes: bookingType.duration_minutes,
    long_description: bookingType.long_description,
    min_advance_booking_hours: bookingType.min_advance_booking_hours,
    max_advance_booking_days: bookingType.max_advance_booking_days,
  };

  return (
    <BookingClient
      masjid={masjidDTO}
      bookingType={bookingTypeDTO}
      availabilities={availabilities || []}
      blackouts={blackouts || []}
      location={location}
      slug={slug}
    />
  );
}