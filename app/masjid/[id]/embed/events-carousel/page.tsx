import { getMasjidById } from "@/lib/server/services/masjid";
import EventsCarouselClient from "./events-carousel";
import { getMasjidEventsByMasjidId } from "@/lib/server/services/masjidEvents";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const masjid = await getMasjidById(id);

  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  const events = await getMasjidEventsByMasjidId(masjid.id);

  return <EventsCarouselClient events={events ?? []} slug={masjid.slug} />;
}
