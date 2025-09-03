"use client";

import ShareSection from "@/components/client/ui/ShareSection";
import { X } from "lucide-react";
import React, { useState } from "react";

interface ShareModalProps {
  campaignName: string;
  shareUrl: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  campaignName,
  shareUrl,
  isOpen = false,
  onToggle,
}) => {
  const toggleShareModal = (isOpen?: boolean) => {
    if (onToggle) {
      onToggle(isOpen !== undefined ? isOpen : !isOpen);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => toggleShareModal(false)}
    >
      <div
        className={`bg-white rounded-2xl shadow-lg max-w-lg w-full overflow-hidden transition-all duration-300 transform ${
          isOpen
            ? "scale-100 translate-y-0"
            : "scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 bg-gray-100">
          <h2 className="text-xl font-bold">Reach more donors by sharing</h2>
          <button
            onClick={() => toggleShareModal(false)}
            className="text-gray-500 hover:text-gray-700 hover:rotate-90 transition-all duration-200 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <ShareSection
          entityName={campaignName}
          shareUrl={shareUrl}
          showQuote={false}
          containerClassName="p-6"
          iconSize="large"
          gridCols={3}
        />
      </div>
    </div>
  );
};
