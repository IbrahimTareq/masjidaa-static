import { getMasjidSlidesById } from "@/lib/server/services/masjidSlides";
import { getServerPrayerData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { processSlides } from "@/lib/server/domain/slides/processSlides";
import SimpleLayout from "./simple-layout";

export default async function SimpleLayoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch slides for this masjid with layout type "simple"
  const slidesData = await getMasjidSlidesById(id, "simple");

  // Get prayer data for iqamah dimming functionality
  const prayerData = await getServerPrayerData(id);

  if (!slidesData || slidesData.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600">
            No slides configured
          </h2>
          <p className="text-gray-500 mt-2">
            Please add slides in the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Process slides using the shared utility function (includes iqamah time changes)
  const processedSlides = await processSlides(slidesData, "simple", id);

  return (
    <SimpleLayout
      slides={processedSlides}
      formattedData={prayerData}
    />
  );
}
