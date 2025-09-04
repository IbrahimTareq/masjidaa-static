"use client";

import { WavyBackground } from "@/components/client/ui/WavyBackground";
import { Tables } from "@/database.types";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Calendar, X } from "lucide-react";
import { useState } from "react";

export default function AnnouncementClient({
  announcement,
}: {
  announcement: Tables<"announcements">;
}) {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const openImagePreview = () => {
    if (announcement?.image) {
      setIsImagePreviewOpen(true);
    }
  };

  const closeImagePreview = () => {
    setIsImagePreviewOpen(false);
  };

  const { colorVariations } = useThemeColors();

  return (
    <div className="bg-white/80 relative overflow-hidden my-10">
      {/* Wavy Background */}
      <WavyBackground
        colors={colorVariations}
        waveWidth={60}
        blur={0}
        speed="slow"
        waveOpacity={0.2}
        containerClassName="absolute bottom-[-10%] left-0 right-0"
      />

      <div className="relative z-10">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:flex lg:gap-12">
            {/* Left Column - Event Details */}
            <div className="flex-1 mb-8 lg:mb-0">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-8">
                {announcement.title}
              </h1>

              {/* Description */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  About this Announcement
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {announcement.description}
                </div>
              </div>
            </div>

            {/* Right Column - Event Image and Desktop Buttons */}
            <div className="lg:w-[480px] flex flex-col gap-6">
              <div
                className="aspect-[4/3] rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100 cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={openImagePreview}
              >
                {announcement.image ? (
                  <img
                    src={announcement.image}
                    alt={announcement.title}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar className="w-16 h-16 sm:w-32 sm:h-32 text-gray-300" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Image Preview Modal */}
      {isImagePreviewOpen && announcement.image && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={closeImagePreview}
        >
          <button
            onClick={closeImagePreview}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={announcement.image}
            alt={announcement.title}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
