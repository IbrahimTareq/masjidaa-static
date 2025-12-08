"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import PrayerLayout from "@/components/LayoutWithHeader";

const staticSlideComponents: Record<string, React.ComponentType> = {
  parking: lazy(() => import("@/components/client/ui/StaticSlides/Parking")),
  masjid_etiquette: lazy(() => import("@/components/client/ui/StaticSlides/MasjidEtiquette")),
  jummah_sunnah: lazy(() => import("@/components/client/ui/StaticSlides/JummahSunnah")),
  download_app: lazy(() => import("@/components/client/ui/StaticSlides/DownloadApp")),
  post_adhan_dua: lazy(() => import("@/components/client/ui/StaticSlides/PostAdhanDua")),
  post_prayer_duas: lazy(() => import("@/components/client/ui/StaticSlides/PostPrayerDuas")),
  hadith_of_the_day: lazy(() => import("@/components/client/ui/StaticSlides/HadithOfTheDay")),
  dua_of_the_day: lazy(() => import("@/components/client/ui/StaticSlides/DuaOfTheDay")),
  verse_of_the_day: lazy(() => import("@/components/client/ui/StaticSlides/VerseOfTheDay")),
  ramadan_countdown: lazy(() => import("@/components/client/ui/StaticSlides/RamadanCountdown")),
};

interface StaticScreenSlideProps {
  type: string;
}

export default function StaticScreenSlide({ type }: StaticScreenSlideProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <PrayerLayout headerTitle="Loading...">
        <div className="h-full w-full flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </PrayerLayout>
    );
  }

  const StaticComponent = staticSlideComponents[type];

  if (!StaticComponent) {
    return (
      <PrayerLayout headerTitle="Error">
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-red-500">Static component &quot;{type}&quot; not found</p>
        </div>
      </PrayerLayout>
    );
  }

  return (
    <Suspense fallback={
      <PrayerLayout headerTitle="Loading...">
        <div className="h-full w-full flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </PrayerLayout>
    }>
      <StaticComponent />
    </Suspense>
  );
}
