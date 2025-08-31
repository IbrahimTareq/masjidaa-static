import AdvancedSlideshow from "@/app/masjid/[id]/layout/advanced/AdvancedSlideshow";
import { getMasjidSlidesById } from "@/lib/server/data/masjidSlides";
import { getServerPrayerData } from "@/lib/server/services/prayer";

interface AdvancedLayoutPageProps {
  params: { id: string };
}

export default async function AdvancedLayoutPage({ params }: AdvancedLayoutPageProps) {
  const { id } = params;
  
  const prayerData = await getServerPrayerData(id);
  const slidesData = await getMasjidSlidesById(id, "advanced");
  
  if (!slidesData || slidesData.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600">No slides configured</h2>
          <p className="text-gray-500 mt-2">Please add slides in the admin dashboard.</p>
        </div>
      </div>
    );
  }

  // Process slides and fetch additional data as needed
  const processedSlides = await Promise.all(
    slidesData.map(async (slide) => {
      // Handle props based on its type - could be string, object, or null
      let slideProps = {};
      if (slide.props) {
        if (typeof slide.props === 'string') {
          try {
            slideProps = JSON.parse(slide.props);
          } catch (e) {
            console.error(`Error parsing slide props for slide ${slide.id}:`, e);
          }
        } else if (typeof slide.props === 'object') {
          slideProps = slide.props;
        }
      }
      
      // For event slides, we need to fetch the event data
      if (slide.slide_type === "event" && (slideProps as { eventId?: string }).eventId) {
        return {
          id: slide.id,
          slide_type: slide.slide_type,
          props: {
            eventId: (slideProps as { eventId: string }).eventId
          }
        };
      }
      
      // For announcement slides, we need to fetch the announcement data
      if (slide.slide_type === "announcement" && (slideProps as { announcementId?: string }).announcementId) {
        return {
          id: slide.id,
          slide_type: slide.slide_type,
          props: {
            announcementId: (slideProps as { announcementId: string }).announcementId
          }
        };
      }
      
      // For prayer screen slides, we need to pass the theme and type
      if (slide.slide_type === "prayer-screen") {
        return {
          id: slide.id,
          slide_type: slide.slide_type,
          props: {
            theme: (slideProps as { theme?: number }).theme || 1, // Default to theme 1 if not specified
            type: (slideProps as { type?: string }).type || "default"
          }
        };
      }
      
      // Return other slide types as is
      return {
        id: slide.id,
        slide_type: slide.slide_type,
        props: slideProps
      };
    })
  );

  return (
    <div className="h-screen bg-black">
      <AdvancedSlideshow formattedData={prayerData} slides={processedSlides} />
    </div>
  );
}