import { getEvent } from "@/lib/server/actions/eventActions";
import { getEventForm } from "@/lib/server/actions/eventRegistrationActions";
import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getMasjidBankAccountById } from "@/lib/server/services/masjidBankAccount";
import { getMasjidEventEnrollmentStatus } from "@/lib/server/services/masjidEvent";
import { getMasjidEventShortCodeById } from "@/lib/server/services/masjidEventShortCode";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import EventClient from "./event";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id, slug } = await params;
  const eventDate = (await searchParams).eventDate;
  const event = await getEvent(id);
  const shortCode = await getMasjidEventShortCodeById(id);
  const eventLink = `${DOMAIN_NAME}/r/${shortCode}`;

  const masjid = await getMasjidBySlug(slug);

  if (!event) {
    return <div>Event not found</div>;
  }

  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  // Fetch additional data for event registration if needed
  let eventForm = null;
  let bankAccount = null;
  let enrollmentStatus = null;

  // Fetch event form if available
  if (event.event_form_id) {
    eventForm = await getEventForm(event.event_form_id);
  }

  // Fetch bank account for paid events
  if (event.type === "paid" && event.bank_account_id) {
    bankAccount = await getMasjidBankAccountById(event.bank_account_id);
  }

  // Fetch enrollment status if event has an enrollment limit
  if (event.enrolment_limit) {
    enrollmentStatus = await getMasjidEventEnrollmentStatus(event.id);
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
      <EventClient
        event={event}
        eventLink={eventLink}
        eventForm={eventForm}
        bankAccount={bankAccount}
        masjid={masjid}
        enrollmentStatus={enrollmentStatus}
      />
    </>
  );
}
