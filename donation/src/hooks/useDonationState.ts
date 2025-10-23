"use client";

import { useState, useEffect } from "react";
import { DonorInfo, PaymentFrequency, RecurringMeta, DonationMeta } from "../types";
import { ExtendedDonationStep } from "../hooks/useDonationForm";

/**
 * Hook for managing core donation state with session storage persistence
 * Handles basic state management and session storage operations
 */
export function useDonationState(initFromStorage = false) {
  // Step management
  const [currentStep, setCurrentStep] = useState<ExtendedDonationStep>("initial");
  
  // Payment data
  const [selectedAmount, setSelectedAmount] = useState<number>();
  const [donorInfo, setDonorInfo] = useState<DonorInfo>();
  const [clientSecret, setClientSecret] = useState<string>();
  const [recurringMeta, setRecurringMeta] = useState<RecurringMeta>();
  
  // Temporary storage for donation data between steps
  const [tempDonationData, setTempDonationData] = useState<{
    amount: string;
    coverFee: boolean;
    frequency: PaymentFrequency;
    selectedCurrency: string;
    sawUpsellScreen?: boolean;
  }>();

  // Initialize from session storage if requested
  useEffect(() => {
    if (initFromStorage) {
      const storedMeta = getDonationMeta();
      const storedRecurringMeta = getRecurringMeta();
      
      if (storedRecurringMeta) {
        setRecurringMeta(storedRecurringMeta);
      }
    }
  }, [initFromStorage]);

  // Session storage functions
  const storeDonationMeta = (donationMeta: DonationMeta): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("donationMeta", JSON.stringify(donationMeta));
    }
  };

  const storeRecurringMeta = (recurringMeta: RecurringMeta): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("recurringMeta", JSON.stringify(recurringMeta));
    }
  };

  const getDonationMeta = (): DonationMeta | null => {
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem("donationMeta");
      return data ? JSON.parse(data) : null;
    }
    return null;
  };

  const getRecurringMeta = (): RecurringMeta | null => {
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem("recurringMeta");
      return data ? JSON.parse(data) : null;
    }
    return null;
  };

  const clearDonationData = (): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("donationMeta");
      sessionStorage.removeItem("recurringMeta");
    }
  };

  // Reset all core donation state
  const resetDonationState = () => {
    setCurrentStep("initial");
    setSelectedAmount(undefined);
    setDonorInfo(undefined);
    setClientSecret(undefined);
    setRecurringMeta(undefined);
    setTempDonationData(undefined);
    clearDonationData();
  };

  return {
    // State
    currentStep,
    selectedAmount,
    donorInfo,
    clientSecret,
    recurringMeta,
    tempDonationData,
    
    // Setters
    setCurrentStep,
    setSelectedAmount,
    setDonorInfo,
    setClientSecret,
    setRecurringMeta,
    setTempDonationData,
    
    // Session storage methods
    storeDonationMeta,
    storeRecurringMeta,
    getDonationMeta,
    getRecurringMeta,
    clearDonationData,
    
    // Reset function
    resetDonationState,
  };
}

// Export standalone functions for backward compatibility
export function storeDonationMeta(donationMeta: DonationMeta): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem("donationMeta", JSON.stringify(donationMeta));
  }
}

export function storeRecurringMeta(recurringMeta: RecurringMeta): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem("recurringMeta", JSON.stringify(recurringMeta));
  }
}

export function getDonationMeta(): DonationMeta | null {
  if (typeof window !== 'undefined') {
    const data = sessionStorage.getItem("donationMeta");
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function getRecurringMeta(): RecurringMeta | null {
  if (typeof window !== 'undefined') {
    const data = sessionStorage.getItem("recurringMeta");
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function clearDonationData(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem("donationMeta");
    sessionStorage.removeItem("recurringMeta");
  }
}