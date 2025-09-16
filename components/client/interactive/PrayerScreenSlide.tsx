"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { getPrayerData } from "@/lib/server/actions/prayerActions";

// Dynamically import prayer screen components
const Theme1 = dynamic(() => import("@/app/masjid/[id]/prayer-screens/[type]/theme1/theme1"));
const Theme2 = dynamic(() => import("@/app/masjid/[id]/prayer-screens/[type]/theme2/theme2"));
const Theme3 = dynamic(() => import("@/app/masjid/[id]/prayer-screens/[type]/theme3/theme3"));
const Theme4 = dynamic(() => import("@/app/masjid/[id]/prayer-screens/[type]/theme4/theme4"));
const Theme5 = dynamic(() => import("@/app/masjid/[id]/prayer-screens/[type]/theme5/theme5"));

interface PrayerScreenSlideProps {
  theme: number;
  type?: string;
}

export default function PrayerScreenSlide({ theme, type = "default" }: PrayerScreenSlideProps) {
  const [prayerData, setPrayerData] = useState<FormattedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrayerData() {
      try {
        setLoading(true);
        // Get the masjid ID from the URL
        const pathParts = window.location.pathname.split('/');
        const masjidId = pathParts[2]; // Assuming URL format: /masjid/[id]/...
        
        // Use server action instead of API call
        const data = await getPrayerData(masjidId);
        if (!data) {
          throw new Error("Failed to fetch prayer data");
        }
        setPrayerData(data);
      } catch (err) {
        console.error("Error fetching prayer data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchPrayerData();
  }, []);

  if (loading) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-theme border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prayer times...</p>
        </div>
      </div>
    );
  }

  if (error || !prayerData) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 text-red-400 mx-auto mb-4">⚠️</div>
          <p className="text-red-600">Error: {error || "Failed to load prayer data"}</p>
        </div>
      </div>
    );
  }

  // Render the appropriate theme component based on theme prop
  switch (theme) {
    case 1:
      return <Theme1 formattedData={prayerData} />;
    case 2:
      return <Theme2 formattedData={prayerData} />;
    case 3:
      return <Theme3 formattedData={prayerData} />;
    case 4:
      return <Theme4 formattedData={prayerData} />;
    case 5:
      return <Theme5 formattedData={prayerData} />;
    default:
      return <Theme1 formattedData={prayerData} />; // Default to Theme1 if invalid theme
  }
}
