"use client";

import { X } from "lucide-react";
import React from "react";

interface ImagePreviewModalProps {
  campaignImage: string | null;
  campaignName: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  campaignImage,
  campaignName,
  isOpen = false,
  onToggle,
}) => {
  const toggleImagePreview = (isOpen?: boolean) => {
    if (onToggle) {
      onToggle(isOpen !== undefined ? isOpen : !isOpen);
    }
  };
  
  if (!isOpen || !campaignImage) return null;
  
  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={() => toggleImagePreview(false)}
    >
      <button
        onClick={() => toggleImagePreview(false)}
        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>
      <img
        src={campaignImage}
        alt={campaignName}
        className="max-w-full max-h-[90vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
