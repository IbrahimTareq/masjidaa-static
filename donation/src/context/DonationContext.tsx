"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Campaign, Masjid, BankAccount } from "../types";
import { useDonationForm } from "../hooks/useDonationForm";

// Define the context type using the return type from useDonationForm
type DonationContextType = ReturnType<typeof useDonationForm>;

interface DonationProviderProps {
  children: ReactNode;
  campaign: Campaign;
  bankAccount: BankAccount;
  masjid: Masjid;
  monthlyDonorCount?: number;
}

// Create the context with undefined as default value
const DonationContext = createContext<DonationContextType | undefined>(undefined);

/**
 * Provider component for donation functionality
 * Uses useDonationForm hook to manage all state and logic
 */
export function DonationProvider({ 
  children, 
  campaign, 
  bankAccount, 
  masjid,
  monthlyDonorCount = 0,
}: DonationProviderProps) {
  // Use the donation form hook to get all state and actions
  const donationForm = useDonationForm({
    campaign,
    masjid,
    bankAccount,
    monthlyDonorCount
  });
  
  return (
    <DonationContext.Provider value={donationForm}>
      {children}
    </DonationContext.Provider>
  );
}

/**
 * Hook to access the donation context
 * Must be used within a DonationProvider
 */
export function useDonation() {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error("useDonation must be used within a DonationProvider");
  }
  return context;
}

// Re-export the step type for backward compatibility
export type { ExtendedDonationStep } from "../hooks/useDonationForm";