import { getMasjidBySlug } from "@/lib/server/services/masjid";
import { getMasjidSiteSettingsByMasjidId } from "@/lib/server/services/masjidSiteSettings";
import ServicesClient from "./services";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ServicesClient />;
}
