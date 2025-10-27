import { getUpcomingIqamahTimeChanges } from "@/lib/server/services/masjidIqamahTimes";
import { getMasjidSlidesById } from "@/lib/server/services/masjidSlides";
import { getServerPrayerData } from "@/lib/server/domain/prayer/getServerPrayerData";
import SimpleLayout from "./simple-layout";

export default async function SimpleLayoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch slides for this masjid with layout type "simple"
  const slidesData = await getMasjidSlidesById(id, "simple");

  // Check for upcoming iqamah time changes
  const upcomingIqamahTimeChanges = await getUpcomingIqamahTimeChanges(id);
  
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

  // Process slides and fetch additional data as needed
  let processedSlides = await Promise.all(
    slidesData.map(async (slide) => {
      // Handle props based on its type - could be string, object, or null
      let slideProps = {};
      if (slide.props) {
        if (typeof slide.props === "string") {
          try {
            slideProps = JSON.parse(slide.props);
          } catch (e) {
            console.error(
              `Error parsing slide props for slide ${slide.id}:`,
              e
            );
          }
        } else if (typeof slide.props === "object") {
          slideProps = slide.props;
        }
      }

      // For event slides, we need to fetch the event data
      if (
        slide.slide_type === "event" &&
        (slideProps as { eventId?: string }).eventId
      ) {
        return {
          id: slide.id,
          slide_type: slide.slide_type,
          props: {
            eventId: (slideProps as { eventId: string }).eventId,
          },
        };
      }

      // For announcement slides, we need to fetch the announcement data
      if (
        slide.slide_type === "announcement" &&
        (slideProps as { announcementId?: string }).announcementId
      ) {
        return {
          id: slide.id,
          slide_type: slide.slide_type,
          props: {
            announcementId: (slideProps as { announcementId: string })
              .announcementId,
          },
        };
      }

      // For donation slides, we need to fetch the donation data
      if (
        slide.slide_type === "donation" &&
        (slideProps as { donationCampaignId?: string }).donationCampaignId
      ) {
        return {
          id: slide.id,
          slide_type: slide.slide_type,
          props: {
            donationCampaignId: (slideProps as { donationCampaignId: string })
              .donationCampaignId,
          },
        };
      }

      // For custom slides, we need to fetch the custom slide data
      if (
        slide.slide_type === "custom" &&
        (slideProps as { customSlideId?: string }).customSlideId
      ) {
        return {
          id: slide.id,
          slide_type: slide.slide_type,
          props: {
            customSlideId: (slideProps as { customSlideId: string })
              .customSlideId,
          },
        };
      }

      // For prayer screen slides, we need to pass the theme and type
      if (slide.slide_type === "prayer-screen") {
        return {
          id: slide.id,
          slide_type: slide.slide_type,
          props: {
            theme: (slideProps as { theme?: number }).theme || 1, // Default to theme 1 if not specified
            type: (slideProps as { type?: string }).type || "default",
          },
        };
      }

      // For static slides, we need to pass the component name
      if (slide.slide_type === "static") {
        return {
          id: slide.id,
          slide_type: slide.slide_type,
          props: {
            type: (slideProps as { type?: string }).type || "parking", // Default to Parking if not specified
          },
        };
      }

      // For business ad slides, we need to pass the component name
      if (slide.slide_type === "business-ad") {
        return {
          id: slide.id,
          slide_type: slide.slide_type,
          props: { adId: (slideProps as { adId: string }).adId },
        };
      }

      // Return other slide types as is
      return {
        id: slide.id,
        slide_type: slide.slide_type,
        props: slideProps,
      };
    })
  );

  // If there are upcoming iqamah time changes, add a special slide for it
  if (upcomingIqamahTimeChanges) {
    const iqamahTimeChangeSlide = {
      id: "iqamah-times-change",
      slide_type: "iqamah-times-change",
      props: {
        iqamahTimeChange: upcomingIqamahTimeChanges,
      },
    };

    // Add the iqamah time change slide to the beginning for visibility
    processedSlides = [iqamahTimeChangeSlide, ...processedSlides];
  }

  return (
    <SimpleLayout 
      slides={processedSlides} 
      formattedData={prayerData}
    />
  );
}
