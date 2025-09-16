import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { Metadata } from "next";
import AppDownloadClient from "./app-download";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const masjid = await getMasjidBySlug(slug);

  const name = masjid?.name ?? "Masjid";

  return {
    title: name,
    description: `Stay connected with ${name}. Download the Masjidaa app for prayer times, events, announcements & donation updates.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <AppDownloadClient />;
}
