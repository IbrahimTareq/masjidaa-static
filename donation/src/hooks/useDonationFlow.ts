"use client";

import { PaymentFrequency } from "../types";
import { ExtendedDonationStep } from "../context/DonationContext";

interface UseDonationFlowProps {
  currentStep: ExtendedDonationStep;
  setCurrentStep: (step: ExtendedDonationStep) => void;
  tempDonationData?: {
    amount: string;
    coverFee: boolean;
    frequency: PaymentFrequency;
    selectedCurrency: string;
    sawUpsellScreen?: boolean;
  };
  setTempDonationData: (data: any) => void;
  showGiftAidStep: boolean;
  resetDonationState: () => void;
}

/**
 * Hook for managing donation flow and step navigation
 */
export function useDonationFlow({
  currentStep,
  setCurrentStep,
  tempDonationData,
  setTempDonationData,
  showGiftAidStep,
  resetDonationState,
}: UseDonationFlowProps) {
  // Start donation flow
  const handleDonateClick = () => {
    setCurrentStep("amount");
  };
  
  // Handle navigation back in the flow
  const handleBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("user_details");
    } else if (currentStep === "user_details") {
      // If we came from gift aid step, go back to that step
      if (showGiftAidStep) {
        setCurrentStep("gift_aid");
      }
      // If we came from recurring upsell, go back to that step
      else if (tempDonationData?.sawUpsellScreen) {
        setCurrentStep("recurring_upsell");
      } else {
        setCurrentStep("amount");
      }
    } else if (currentStep === "gift_aid") {
      // If we came from recurring upsell, go back to that step
      if (tempDonationData?.sawUpsellScreen) {
        setCurrentStep("recurring_upsell");
      } else {
        setCurrentStep("amount");
      }
    } else if (currentStep === "recurring_upsell") {
      setCurrentStep("amount");
    } else {
      resetDonationState();
    }
  };
  
  // Handle amount selection and determine next step
  const handleAmountSelected = (
    amount: string,
    coverFee: boolean,
    frequency: PaymentFrequency,
    selectedCurrency: string
  ) => {
    // Check if we should show the recurring upsell step
    // Only show upsell if:
    // 1. It's a one-time payment
    // 2. Amount is between $15 and $100
    const parsedAmount = parseFloat(amount);
    const shouldShowUpsell = frequency === "once" && parsedAmount > 15 && parsedAmount < 100;
    
    // Store the amount data temporarily
    setTempDonationData({
      amount,
      coverFee,
      frequency,
      selectedCurrency,
      sawUpsellScreen: shouldShowUpsell
    });
    
    if (shouldShowUpsell) {
      // Show the upsell step before user details
      setCurrentStep("recurring_upsell");
    } else if (showGiftAidStep) {
      // Show the Gift Aid step before user details
      setCurrentStep("gift_aid");
    } else {
      // Skip upsell and Gift Aid, move directly to user details
      setCurrentStep("user_details");
    }
  };
  
  // Handle when user selects a monthly amount from the upsell screen
  const handleRecurringUpsellSelected = (amount: string, frequency: PaymentFrequency) => {
    if (!tempDonationData) return;
    
    // Update the temporary donation data with the new amount and frequency
    // Keep the sawUpsellScreen flag as true
    setTempDonationData({
      ...tempDonationData,
      amount,
      frequency,
      sawUpsellScreen: true
    });
    
    // If Gift Aid is applicable, go to that step, otherwise to user details
    if (showGiftAidStep) {
      setCurrentStep("gift_aid");
    } else {
      setCurrentStep("user_details");
    }
  };
  
  // Handle when user chooses to keep the one-time donation
  const handleKeepOneTime = () => {
    if (!tempDonationData) return;
    
    // Make sure the sawUpsellScreen flag remains true
    setTempDonationData({
      ...tempDonationData,
      sawUpsellScreen: true
    });
    
    // If Gift Aid is applicable, go to that step, otherwise to user details
    if (showGiftAidStep) {
      setCurrentStep("gift_aid");
    } else {
      setCurrentStep("user_details");
    }
  };
  
  // Handle donation completion
  const handleDonationSuccess = () => {
    resetDonationState();
  };

  return {
    handleDonateClick,
    handleBack,
    handleAmountSelected,
    handleRecurringUpsellSelected,
    handleKeepOneTime,
    handleDonationSuccess,
  };
}
