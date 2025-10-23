"use client";

import { useState, useEffect } from "react";
import { useTaxInfo } from "@/hooks/useTaxInfo";
import { ExtendedDonationStep } from "../context/DonationContext";

interface UseGiftAidProps {
  masjidId: string;
  setCurrentStep: (step: ExtendedDonationStep) => void;
}

/**
 * Hook for managing Gift Aid related functionality
 */
export function useGiftAid({ masjidId, setCurrentStep }: UseGiftAidProps) {
  // Gift Aid data
  const [giftAidDeclared, setGiftAidDeclared] = useState(false);
  const { showGiftAid, addressRequired, loading: taxInfoLoading } = useTaxInfo(masjidId);
  const [showGiftAidStep, setShowGiftAidStep] = useState(false);
  
  // Update showGiftAidStep when tax info is loaded
  useEffect(() => {
    if (!taxInfoLoading) {
      setShowGiftAidStep(showGiftAid);
    }
  }, [showGiftAid, taxInfoLoading]);
  
  // Handle Gift Aid declaration submission
  const handleGiftAidSubmit = (declared: boolean) => {
    setGiftAidDeclared(declared);
    setCurrentStep("user_details");
  };

  return {
    giftAidDeclared,
    setGiftAidDeclared,
    showGiftAidStep,
    addressRequired,
    handleGiftAidSubmit
  };
}
