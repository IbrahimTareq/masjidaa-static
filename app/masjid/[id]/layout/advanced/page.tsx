import AdvancedSlideshow from "@/app/masjid/[id]/layout/advanced/AdvancedSlideshow";
import { getServerPrayerData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { getMasjidSlidesById } from "@/lib/server/services/masjidSlides";
import { processSlides } from "@/lib/server/domain/slides/processSlides";

export default async function AdvancedLayoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const prayerData = await getServerPrayerData(id);
  const slidesData = await getMasjidSlidesById(id, "advanced");

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
  const processedSlides = await processSlides(slidesData, "advanced", id);

  return (
    <div className="h-screen bg-black font-montserrat">
      <AdvancedSlideshow formattedData={prayerData} slides={processedSlides} />
    </div>
  );
}
