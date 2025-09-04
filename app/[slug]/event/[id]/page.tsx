import { getEvent } from "@/lib/server/actions/eventActions";
import EventClient from "./event";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return <div>Event not found</div>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    endDate: event.date,
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
      <EventClient event={event} />
    </>
  );
}
