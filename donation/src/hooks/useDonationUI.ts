"use client";

import { useState } from "react";
import { Campaign } from "../types";

interface UseDonationUIProps {
  campaign: Campaign;
}

/**
 * Hook for managing UI-related state in the donation flow
 */
export function useDonationUI({ campaign }: UseDonationUIProps) {
  // UI state
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const hasTarget = campaign.target_amount != null && campaign.target_amount > 0;

  // Calculate progress percentage (0 if no target is set)
  const progressPercentage = hasTarget
    ? Math.min(
        Math.round(
          (Number(campaign.amount_raised) / Number(campaign.target_amount)) * 100
        ),
        100
      )
    : 0;
  
  // Toggle image preview modal
  const toggleImagePreview = (isOpen?: boolean) => {
    setIsImagePreviewOpen(isOpen !== undefined ? isOpen : !isImagePreviewOpen);
  };
  
  // Toggle share modal
  const toggleShareModal = (isOpen?: boolean) => {
    setIsShareModalOpen(isOpen !== undefined ? isOpen : !isShareModalOpen);
  };

  return {
    isImagePreviewOpen,
    isShareModalOpen,
    progressPercentage,
    toggleImagePreview,
    toggleShareModal
  };
}
