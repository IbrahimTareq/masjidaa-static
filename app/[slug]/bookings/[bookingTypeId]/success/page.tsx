import { Metadata } from "next";
import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getBookingTypeById } from "@/lib/server/services/bookingTypes";
import { getBookingDetailsAction } from "@/lib/server/actions/bookingActions";
import { getMasjidLocationByMasjidId } from "@/lib/server/services/masjidLocation";
import BookingSuccessClient from "./success";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string; bookingTypeId: string }>;
  searchParams: Promise<{ bookingId?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const masjid = await getMasjidBySlug(slug);

  if (!masjid) {
    return {
      title: "Booking Confirmation - Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  const title = `Booking Confirmed - ${masjid.name}`;
  const description = `Your booking has been successfully submitted at ${masjid.name}. Check your email for confirmation details.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      siteName: "Masjidaa",
    },
    robots: {
      index: false, // Don't index booking confirmation pages
    },
  };
}

export default async function BookingSuccessPage({
  params,
  searchParams
}: PageProps) {
  const { slug, bookingTypeId } = await params;
  const { bookingId } = await searchParams;

  // Get basic page data
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

  // Get booking details and location if bookingId is provided
  let booking = null;
  let location = null;

  if (bookingId) {
    const [bookingResult, locationData] = await Promise.all([
      getBookingDetailsAction(bookingId),
      getMasjidLocationByMasjidId(masjid.id),
    ]);

    if (bookingResult.success) {
      booking = bookingResult.booking || null;
    }
    location = locationData;
  } else {
    location = await getMasjidLocationByMasjidId(masjid.id);
  }

  return (
    <BookingSuccessClient
      masjid={masjid}
      bookingType={bookingType}
      booking={booking}
      location={location}
      slug={slug}
    />
  );
}