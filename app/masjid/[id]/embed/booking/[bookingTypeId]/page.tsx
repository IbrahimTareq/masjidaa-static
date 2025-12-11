import { getBookingTypeById } from "@/lib/server/services/bookingTypes";
import BookingClient from "./booking";

export default async function Page({
  params,
}: {
  params: Promise<{ bookingTypeId: string }>;
}) {
  const { bookingTypeId } = await params;

  const bookingType = await getBookingTypeById(bookingTypeId);

  if (!bookingType) {
    return <div>Booking type not found</div>;
  }

  return <BookingClient bookingType={bookingType} />;
}