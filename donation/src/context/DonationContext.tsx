"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { 
  DonationMeta, 
  DonationStep, 
  DonorInfo, 
  PaymentFrequency, 
  RecurringMeta,
  Campaign,
  Masjid,
  BankAccount
} from "../types";
import { 
  createRecurringSetupIntent, 
  createSinglePaymentIntent,
  storeDonationMeta, 
  storeRecurringMeta 
} from "../services";

interface DonationContextType {
  // State
  currentStep: DonationStep;
  selectedAmount: number | undefined;
  donorInfo: DonorInfo | undefined;
  clientSecret: string | undefined;
  recurringMeta: RecurringMeta | undefined;
  isLoading: boolean;
  isImagePreviewOpen: boolean;
  isShareModalOpen: boolean;
  progressPercentage: number;
  
  // Actions
  setCurrentStep: (step: DonationStep) => void;
  handleDonateClick: () => void;
  handleBack: () => void;
  handleAmountSelected: (amount: number, info: DonorInfo, frequency: PaymentFrequency) => Promise<void>;
  handleDonationSuccess: () => void;
  toggleImagePreview: (isOpen?: boolean) => void;
  toggleShareModal: (isOpen?: boolean) => void;
}

interface DonationProviderProps {
  children: ReactNode;
  campaign: Campaign;
  bankAccount: BankAccount;
  masjid: Masjid;
  monthlyDonorCount?: number;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ 
  children, 
  campaign, 
  bankAccount, 
  masjid,
  monthlyDonorCount = 10
}: DonationProviderProps) {
  // Step management
  const [currentStep, setCurrentStep] = useState<DonationStep>("initial");
  
  // Payment data
  const [selectedAmount, setSelectedAmount] = useState<number>();
  const [donorInfo, setDonorInfo] = useState<DonorInfo>();
  const [clientSecret, setClientSecret] = useState<string>();
  const [recurringMeta, setRecurringMeta] = useState<RecurringMeta>();
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.round(
      (Number(campaign.amount_raised) / Number(campaign.target_amount)) * 100
    ),
    100
  );
  
  // Action handlers
  const handleDonateClick = () => {
    setCurrentStep("amount");
  };
  
  const handleBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("amount");
    } else {
      setCurrentStep("initial");
      setSelectedAmount(undefined);
      setDonorInfo(undefined);
    }
  };
  
  const handleAmountSelected = async (
    amount: number,
    info: DonorInfo,
    frequency: PaymentFrequency
  ) => {
    setSelectedAmount(amount);
    setDonorInfo(info);
    setIsLoading(true);

    try {
      // Create common donation metadata
      const donationMeta: DonationMeta = {
        masjid_id: masjid.id,
        campaign_id: campaign.id,
        campaign_title: campaign.name,
        email: info.email,
        first_name: info.firstName,
        last_name: info.lastName,
        amount_cents: amount,
        currency: info.currency.toLowerCase(),
      };
      
      // Store donation metadata
      storeDonationMeta(donationMeta);

      if (frequency === "once") {
        // Handle one-time payment
        const data = await createSinglePaymentIntent(
          amount,
          info.currency.toLowerCase(),
          campaign.id,
          campaign.name,
          masjid.id,
          bankAccount.stripe_account_id,
          info.email,
          info.firstName,
          info.lastName
        );
        
        setClientSecret(data.client_secret);
        setCurrentStep("payment");
      } else {
        // Handle recurring payment
        const setupJson = await createRecurringSetupIntent(
          info.email,
          bankAccount.stripe_account_id
        );
        
        setClientSecret(setupJson.client_secret);

        // Create recurring metadata
        const newRecurringMeta: RecurringMeta = {
          frequency,
          start_date: new Date().toISOString(),
          end_date: undefined,
          stripe_customer_id: setupJson.customer_id,
          stripe_account_id: bankAccount.stripe_account_id,
        };

        setRecurringMeta(newRecurringMeta);
        storeRecurringMeta(newRecurringMeta);
        setCurrentStep("payment");
      }
    } catch (error) {
      console.error("Error creating intent:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDonationSuccess = () => {
    setCurrentStep("initial");
    setClientSecret(undefined);
    setSelectedAmount(undefined);
    setDonorInfo(undefined);
  };
  
  const toggleImagePreview = (isOpen?: boolean) => {
    setIsImagePreviewOpen(isOpen !== undefined ? isOpen : !isImagePreviewOpen);
  };
  
  const toggleShareModal = (isOpen?: boolean) => {
    setIsShareModalOpen(isOpen !== undefined ? isOpen : !isShareModalOpen);
  };
  
  const value = {
    // State
    currentStep,
    selectedAmount,
    donorInfo,
    clientSecret,
    recurringMeta,
    isLoading,
    isImagePreviewOpen,
    isShareModalOpen,
    progressPercentage,
    
    // Actions
    setCurrentStep,
    handleDonateClick,
    handleBack,
    handleAmountSelected,
    handleDonationSuccess,
    toggleImagePreview,
    toggleShareModal,
  };
  
  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error("useDonation must be used within a DonationProvider");
  }
  return context;
}
