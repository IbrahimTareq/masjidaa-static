import { getEvent } from "@/lib/server/actions/eventActions";
import EventClient from "./event";
import { getMasjidEventShortCodeById } from "@/lib/server/data/masjidEventShortCode";
import { DOMAIN_NAME } from "@/utils/shared/constants";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const eventDate = (await searchParams).eventDate;
  const event = await getEvent(id);
  const shortCode = await getMasjidEventShortCodeById(id);
  const eventLink = `${DOMAIN_NAME}/r/${shortCode}`;
  
  if (!event) {
    return <div>Event not found</div>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: eventDate || event.date,
    endDate: eventDate || event.date,
    location: {
      "@type": "Place",
      name: event.location,
    },
    image: event.image,
    description: event.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <EventClient event={event} eventLink={eventLink} />
    </>
  );
}
