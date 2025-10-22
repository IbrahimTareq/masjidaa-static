"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useTaxInfo } from "@/hooks/useTaxInfo";
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

// Extended step type to include user details, recurring upsell, and gift aid steps
export type ExtendedDonationStep = DonationStep | "user_details" | "recurring_upsell" | "gift_aid";
import { 
  createRecurringSetupIntent, 
  createSinglePaymentIntent,
  storeDonationMeta, 
  storeRecurringMeta 
} from "../services";

interface DonationContextType {
  // State
  currentStep: ExtendedDonationStep;
  selectedAmount: number | undefined;
  donorInfo: DonorInfo | undefined;
  clientSecret: string | undefined;
  recurringMeta: RecurringMeta | undefined;
  isLoading: boolean;
  isImagePreviewOpen: boolean;
  isShareModalOpen: boolean;
  progressPercentage: number;
  giftAidDeclared: boolean;
  showGiftAidStep: boolean;
  tempDonationData: {
    amount: string;
    coverFee: boolean;
    frequency: PaymentFrequency;
    selectedCurrency: string;
    sawUpsellScreen?: boolean;
  } | undefined;
  
  // Actions
  setCurrentStep: (step: ExtendedDonationStep) => void;
  handleDonateClick: () => void;
  handleBack: () => void;
  handleAmountSelected: (amount: string, coverFee: boolean, frequency: PaymentFrequency, selectedCurrency: string) => void;
  handleUserDetailsSubmit: (info: DonorInfo, frequency: PaymentFrequency) => Promise<void>;
  handleRecurringUpsellSelected: (amount: string, frequency: PaymentFrequency) => void;
  handleKeepOneTime: () => void;
  handleGiftAidSubmit: (giftAidDeclared: boolean) => void;
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
}: DonationProviderProps) {
  // Step management
  const [currentStep, setCurrentStep] = useState<ExtendedDonationStep>("initial");
  
  // Payment data
  const [selectedAmount, setSelectedAmount] = useState<number>();
  const [donorInfo, setDonorInfo] = useState<DonorInfo>();
  const [clientSecret, setClientSecret] = useState<string>();
  const [recurringMeta, setRecurringMeta] = useState<RecurringMeta>();
  
  // Gift Aid data
  const [giftAidDeclared, setGiftAidDeclared] = useState(false);
  const { showGiftAid, addressRequired, loading: taxInfoLoading } = useTaxInfo(masjid.id);
  const [showGiftAidStep, setShowGiftAidStep] = useState(false);
  
  // Update showGiftAidStep when tax info is loaded
  useEffect(() => {
    if (!taxInfoLoading) {
      setShowGiftAidStep(showGiftAid);
    }
  }, [showGiftAid, taxInfoLoading]);
  
  // Temporary storage for donation data between steps
  const [tempDonationData, setTempDonationData] = useState<{
    amount: string;
    coverFee: boolean;
    frequency: PaymentFrequency;
    selectedCurrency: string;
    sawUpsellScreen?: boolean;
  }>();
  
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
      setCurrentStep("initial");
      setSelectedAmount(undefined);
      setDonorInfo(undefined);
      setTempDonationData(undefined);
      setGiftAidDeclared(false);
    }
  };
  
  // Step 1: Handle amount selection
  const handleAmountSelected = (
    amount: string,
    coverFee: boolean,
    frequency: PaymentFrequency,
    selectedCurrency: string
  ) => {
    // Check if we should show the recurring upsell step
    // Only show upsell if:
    // 1. It's a one-time payment
    // 2. Amount is less than $100
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
  
  // Step 3: Handle user details submission
  const handleUserDetailsSubmit = async (
    info: DonorInfo,
    frequency: PaymentFrequency
  ) => {
    if (!tempDonationData) return;
    
    setDonorInfo(info);
    
    // Proceed directly with payment processing
    await processPayment(info, frequency);
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
  
  // Handle Gift Aid declaration submission
  const handleGiftAidSubmit = (declared: boolean) => {
    setGiftAidDeclared(declared);
    setCurrentStep("user_details");
  };
  
  // Common payment processing function
  const processPayment = async (info: DonorInfo, frequency: PaymentFrequency) => {
    if (!tempDonationData) return;
    
    setIsLoading(true);
    
    try {
      // Convert to cents/pence for Stripe
      const amountInCents = Math.round(parseFloat(tempDonationData.amount) * 100);
      setSelectedAmount(amountInCents);
      
      // Create common donation metadata
      const donationMeta: DonationMeta = {
        masjid_id: masjid.id,
        campaign_id: campaign.id,
        campaign_title: campaign.name,
        email: info.email,
        first_name: info.firstName,
        last_name: info.lastName,
        address: info.address,
        is_anonymous: info.isAnonymous,
        amount_cents: amountInCents,
        currency: info.currency.toLowerCase(),
        gift_aid_declared: giftAidDeclared,
      };
      
      // Store donation metadata
      storeDonationMeta(donationMeta);

      if (frequency === "once") {
        // Handle one-time payment
        const data = await createSinglePaymentIntent(
          amountInCents,
          info.currency.toLowerCase(),
          campaign.id,
          campaign.name,
          masjid.id,
          bankAccount.stripe_account_id,
          info.email,
          info.firstName,
          info.lastName,
          info.isAnonymous,
          giftAidDeclared,
          info.address
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
    setGiftAidDeclared(false);
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
    tempDonationData,
    giftAidDeclared,
    showGiftAidStep,
    
    // Actions
    setCurrentStep,
    handleDonateClick,
    handleBack,
    handleAmountSelected,
    handleUserDetailsSubmit,
    handleRecurringUpsellSelected,
    handleKeepOneTime,
    handleGiftAidSubmit,
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
