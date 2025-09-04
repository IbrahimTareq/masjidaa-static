"use client";

import { Tables } from "@/database.types";
import { getCustomSlide } from "@/lib/server/actions/customSlideActions";
import { useEffect, useState } from "react";

interface CustomSlideProps {
  customSlideId: string;
}

export default function CustomSlide({ customSlideId }: CustomSlideProps) {
  const [customSlide, setCustomSlide] =
    useState<Tables<"masjid_custom_slides"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (customSlide?.title.length === 0) {
    return null;
  }

  useEffect(() => {
    async function fetchMasjidCustomSlide() {
      try {
        setLoading(true);
        const data = await getCustomSlide(customSlideId);
        if (!data) {
          throw new Error("Failed to fetch masjid custom slide");
        }
        setCustomSlide(data);
      } catch (err) {
        console.error("Error fetching masjid custom slide:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchMasjidCustomSlide();
  }, [customSlideId]);

  console.log("customSlide:", customSlide);

  return (
    <div
      className="h-full w-full flex items-center justify-center bg-white overflow-hidden"
    >
      <img
        src={customSlide?.image}
        alt={customSlide?.title}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
