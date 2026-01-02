import type { Tables } from "@/database.types";
import { getUpcomingIqamahTimeChanges } from "@/lib/server/services/masjidIqamahTimes";

export interface ProcessedSlide {
  id: string;
  slide_type: string;
  props: Record<string, any>;
}

/**
 * Process slides data for a specific layout type and inject iqamah time changes if needed
 * Extracts and standardizes the slide processing logic that was duplicated
 * between Advanced and Simple layout pages
 */
export async function processSlides(
  slidesData: Tables<"masjid_slides">[],
  layoutType: "advanced" | "simple",
  masjidId: string
): Promise<ProcessedSlide[]> {
  // Define supported slide types per layout
  const layoutSupport = {
    advanced: ["event", "announcement", "donation", "custom", "static", "business-ad"], // supports ALL slide types except prayer-screen
    simple: ["event", "announcement", "donation", "custom", "prayer-screen", "static", "business-ad"] // supports all slide types
  };

  const supportedTypes = layoutSupport[layoutType];

  // Process slides and fetch additional data as needed
  const results = await Promise.all(
    slidesData.map(async (slide) => {
      // Skip unsupported slide types for this layout
      if (!supportedTypes.includes(slide.slide_type)) {
        return null;
      }

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

      // For donation slides, we need to fetch the donation data (Simple layout only)
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

      // For custom slides, we need to fetch the custom slide data (Simple layout only)
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
      // Standardized to use "parking" (lowercase) for both layouts
      if (slide.slide_type === "static") {
        return {
          id: slide.id,
          slide_type: slide.slide_type,
          props: {
            type: (slideProps as { type?: string }).type || "parking", // Standardized default
          },
        };
      }

      // For business ad slides, we need to pass the component name
      if (slide.slide_type === "business-ad") {
        return {
          id: slide.id,
          slide_type: slide.slide_type,
          props: {
            adId: (slideProps as { adId: string }).adId,
          },
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

  // Filter out null results (unsupported slide types)
  let processedSlides = results.filter(slide => slide !== null) as ProcessedSlide[];

  // Always inject download_app slide
  const downloadAppSlide: ProcessedSlide = {
    id: "download-app",
    slide_type: "static",
    props: {
      type: "download_app",
    },
  };
  processedSlides.push(downloadAppSlide);

  // Check for upcoming iqamah time changes and inject special slide if needed
  const upcomingIqamahTimeChanges = await getUpcomingIqamahTimeChanges(masjidId);

  if (upcomingIqamahTimeChanges) {
    const iqamahTimeChangeSlide: ProcessedSlide = {
      id: "iqamah-times-change",
      slide_type: "iqamah-times-change",
      props: {
        iqamahTimeChange: upcomingIqamahTimeChanges,
      },
    };

    // Add the iqamah time change slide to the beginning for visibility
    processedSlides = [iqamahTimeChangeSlide, ...processedSlides];
  }

  return processedSlides;
}