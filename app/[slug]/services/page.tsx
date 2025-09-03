import { getMasjidBySlug } from "@/lib/server/data/masjid";
import { getMasjidSiteSettingsByMasjidId } from "@/lib/server/data/masjidSiteSettings";
import ServicesClient from "./services";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
      <ServicesClient />
  );
}