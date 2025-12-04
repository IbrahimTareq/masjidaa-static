import { Metadata } from "next";
import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getActiveBookingTypesByMasjidSlug } from "@/lib/server/services/bookingTypes";
import { getMasjidSiteSettingsByMasjidId } from "@/lib/server/services/masjidSiteSettings";
import BookingsClient from "./bookings";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const masjid = await getMasjidBySlug(slug);

  if (!masjid) {
    return {
      title: "Bookings - Page Not Found",
      description: "The requested masjid could not be found.",
    };
  }

  const title = `Book Services - ${masjid.name}`;
  const description = `Schedule appointments and book services at ${masjid.name}. Choose from available services like imam consultations, hall rentals, and more.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      siteName: "Masjidaa",
      url: `https://masjidaa.com/${slug}/bookings`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BookingsPage({ params }: PageProps) {
  const { slug } = await params;

  // First fetch masjid data
  const masjid = await getMasjidBySlug(slug);

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

  // Parallel data fetching for dependent queries
  const [bookingTypes, siteSettings] = await Promise.all([
    getActiveBookingTypesByMasjidSlug(slug),
    getMasjidSiteSettingsByMasjidId(masjid.id),
  ]);

  return (
    <BookingsClient
      masjid={masjid}
      bookingTypes={bookingTypes || []}
      siteSettings={siteSettings}
      slug={slug}
    />
  );
}