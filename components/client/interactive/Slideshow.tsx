"use client";

import AnnouncementSlide from "@/components/client/interactive/AnnouncementSlide";
import CustomSlide from "@/components/client/interactive/CustomSlide";
import DonationSlide from "@/components/client/interactive/DonationSlide";
import EventSlide from "@/components/client/interactive/EventSlide";
import PrayerScreenSlide from "@/components/client/interactive/PrayerScreenSlide";
import StaticScreenSlide from "@/components/client/interactive/StaticScreenSlide";
import { useMasjidContext } from "@/context/masjidContext";
import { useSlidesRealtime } from "@/hooks/useSlidesRealtime";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import IqamahTimesChangeSlide from "./IqamahTimesChangeSlide";
import BusinessSlide from "./BusinessSlide";

// Define slide types
interface SlideBase {
  id: string;
  slide_type: string;
  props: Record<string, any>;
}

interface EventSlide extends SlideBase {
  slide_type: "event";
  props: {
    eventId: string;
  };
}

interface AnnouncementSlide extends SlideBase {
  slide_type: "announcement";
  props: {
    announcementId: string;
  };
}

interface DonationSlide extends SlideBase {
  slide_type: "donation";
  props: {
    donationCampaignId: string;
  };
}

interface CustomSlide extends SlideBase {
  slide_type: "custom";
  props: {
    customSlideId: string;
  };
}

interface PrayerScreenSlide extends SlideBase {
  slide_type: "prayer-screen";
  props: {
    theme: number;
    type?: string;
  };
}

interface IqamahTimesChangeSlide extends SlideBase {
  slide_type: "iqamah-times-change";
  props: {
    iqamahTimeChange: any;
  };
}

interface BusinessSlide extends SlideBase {
  slide_type: "business-ad";
  props: {
    adId: string;
  };
}

interface StaticSlide extends SlideBase {
  slide_type: "static";
  props: {
    type: string;
  };
}

export type Slide =
  | EventSlide
  | AnnouncementSlide
  | PrayerScreenSlide
  | DonationSlide
  | CustomSlide
  | IqamahTimesChangeSlide
  | StaticSlide
  | BusinessSlide
  | SlideBase;

// Component mapping
const slideComponents: Record<string, React.ComponentType<any>> = {
  event: EventSlide,
  announcement: AnnouncementSlide,
  donation: DonationSlide,
  custom: CustomSlide,
  "iqamah-times-change": (props: { iqamahTimeChange: any }) => (
    <IqamahTimesChangeSlide iqamahTimeChange={props.iqamahTimeChange} />
  ),
  "prayer-screen": (props: { theme: number; type?: string }) => (
    <PrayerScreenSlide theme={props.theme} type={props.type} />
  ),
  "business-ad": (props: { adId: string }) => (
    <BusinessSlide adId={props.adId} />
  ),
  static: (props: { type: string }) => <StaticScreenSlide type={props.type} />,
};

export interface SlideshowProps {
  slides: Slide[];
}

export default function Slideshow({ slides }: SlideshowProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration] = useState(8); // 8 seconds matches the autoplay delay

  const onAutoplayTimeLeft = (swiper: any, time: number, progress: number) => {
    const secondsLeft = Math.ceil(time / 1000);
    setTimeLeft(secondsLeft);
  };

  if (!slides || slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <p>No slides to display</p>
      </div>
    );
  }

  const masjid = useMasjidContext();

  // Set up real-time updates with auto-refresh
  const { hasUpdates } = useSlidesRealtime(masjid?.id || "");
  // Auto-refresh when updates are detected
  useEffect(() => {
    if (hasUpdates) {
      const timer = setTimeout(() => {
        console.log("Auto-refreshing due to slides data updates");
        window.location.reload();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasUpdates]);

  // Check if there are any valid slide components
  const hasValidSlides = slides.some(
    (slide) => slideComponents[slide.slide_type]
  );

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 98000,
          disableOnInteraction: false,
        }}
        loop={slides.length > 1}
        className="w-full h-full"
        style={{ display: "flex", flexDirection: "column" }}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
      >
        {slides.map((slide) => {
          const SlideComponent = slideComponents[slide.slide_type];

          if (!SlideComponent) {
            return (
              <SwiperSlide key={slide.id} className="h-full flex">
                <div className="w-full h-full flex items-center justify-center bg-black text-white">
                  <p>Unknown slide type: {slide.slide_type}</p>
                </div>
              </SwiperSlide>
            );
          }

          return (
            <SwiperSlide key={slide.id} className="h-full flex">
              <div className="w-full h-full overflow-hidden">
                <SlideComponent {...slide.props} />
              </div>
            </SwiperSlide>
          );
        })}

        {hasValidSlides && (
          <div className="absolute top-10 right-5 w-8 h-8 z-10">
            <CircularProgressbar
              value={timeLeft}
              strokeWidth={50}
              maxValue={totalDuration}
              styles={buildStyles({
                pathColor: "var(--theme-color-accent, #e4ede7)",
                trailColor: "rgba(255, 255, 255, 0.3)",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                strokeLinecap: "butt",
              })}
            />
          </div>
        )}
      </Swiper>
    </div>
  );
}
