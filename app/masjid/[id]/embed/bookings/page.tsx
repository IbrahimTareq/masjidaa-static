import { getMasjidById } from "@/lib/server/services/masjid";
import { getActiveBookingTypesByMasjidId } from "@/lib/server/services/bookingTypes";
import BookingsClient from "./bookings";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const masjid = await getMasjidById(id);

  // Layout already handles null case with NotFound
  if (!masjid) {
    return null;
  }

  const bookingTypes = await getActiveBookingTypesByMasjidId(masjid.id);

  return (
    <BookingsClient
      bookingTypes={bookingTypes ?? []}
      currency={masjid.local_currency}
      slug={masjid.slug}
      masjidName={masjid.name}
    />
  );
}

