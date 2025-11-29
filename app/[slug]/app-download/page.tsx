import AppDownloadClient from "./app-download";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page() {
  return <AppDownloadClient />;
}
