import { getEvent } from "@/lib/server/actions/eventActions";
import { getEventForm } from "@/lib/server/actions/eventRegistrationActions";
import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getMasjidBankAccountById } from "@/lib/server/services/masjidBankAccount";
import { getMasjidEventEnrollmentStatus } from "@/lib/server/services/masjidEvent";
import { getMasjidEventShortCodeById } from "@/lib/server/services/masjidEventShortCode";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import Script from "next/script";
import EventClient from "./event";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { eventId, slug } = await params;
  const eventDate = (await searchParams).eventDate;

  // Parallelize initial data fetching
  const [event, shortCode, masjid] = await Promise.all([
    getEvent(eventId),
    getMasjidEventShortCodeById(eventId),
    getMasjidBySlug(slug),
  ]);

  const eventLink = `${DOMAIN_NAME}/r/${shortCode}`;

  if (!event) {
    return <div>Event not found</div>;
  }

  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  // Parallelize conditional data fetching
  const [eventForm, bankAccount, enrollmentStatus] = await Promise.all([
    event.event_form_id ? getEventForm(event.event_form_id) : null,
    event.type === "paid" && event.bank_account_id
      ? getMasjidBankAccountById(event.bank_account_id)
      : null,
    event.enrolment_limit ? getMasjidEventEnrollmentStatus(event.id) : null,
  ]);

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
      <Script
        id={`jsonld-event-${event.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
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
