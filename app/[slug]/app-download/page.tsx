import AppDownloadClient from "./app-download";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <AppDownloadClient />;
}
