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

  return <EventClient event={event} />;
}
