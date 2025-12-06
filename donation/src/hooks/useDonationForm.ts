"use client";

import { useState, useEffect } from "react";
import {
  DonationMeta,
  DonorInfo,
  PaymentFrequency,
  RecurringMeta,
  Campaign,
  Masjid,
  BankAccount
} from "../types";
import { useDonationState } from "./useDonationState";
import { useTaxInfo } from "@/hooks/useTaxInfo";
import { createRecurringSetupIntent, createSinglePaymentIntent } from "../services";

export type ExtendedDonationStep =
  | "initial"       // Stats view
  | "amount"        // Amount selection
  | "recurring_upsell" // Recurring donation upsell (conditional)
  | "gift_aid"      // Gift Aid declaration (conditional)
  | "user_details"  // User information
  | "payment";      // Payment processing

interface UseDonationFormProps {
  campaign: Campaign;
  masjid: Masjid;
  bankAccount: BankAccount;
  monthlyDonorCount?: number;
}

export interface UseDonationFormReturn {
  currentStep: ExtendedDonationStep;
  setCurrentStep: (step: ExtendedDonationStep) => void;
  selectedAmount: number | undefined;
  setSelectedAmount: (amount: number | undefined) => void;
  donorInfo: DonorInfo | undefined;
  setDonorInfo: (info: DonorInfo | undefined) => void;
  clientSecret: string | undefined;
  setClientSecret: (secret: string | undefined) => void;
  recurringMeta: RecurringMeta | undefined;
  setRecurringMeta: (meta: RecurringMeta | undefined) => void;
  giftAidDeclared: boolean;
  setGiftAidDeclared: (declared: boolean) => void;
  showGiftAidStep: boolean;
  setShowGiftAidStep: (show: boolean) => void;
  tempDonationData: {
    amount: string;
    coverFee: boolean;
    frequency: PaymentFrequency;
    selectedCurrency: string;
    sawUpsellScreen?: boolean;
  } | undefined;
  setTempDonationData: (data: {
    amount: string;
    coverFee: boolean;
    frequency: PaymentFrequency;
    selectedCurrency: string;
    sawUpsellScreen?: boolean;
  } | undefined) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isImagePreviewOpen: boolean;
  isShareModalOpen: boolean;
  progressPercentage: number;
  campaign: Campaign;
  masjid: Masjid;
  bankAccount: BankAccount;
  monthlyDonorCount: number;
  storeDonationMeta: (donationMeta: DonationMeta) => void;
  storeRecurringMeta: (recurringMeta: RecurringMeta) => void;
  getDonationMeta: () => DonationMeta | null;
  getRecurringMeta: () => RecurringMeta | null;
  clearDonationData: () => void;
  resetDonationState: () => void;
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
  isRecurring: boolean; // Added to indicate if the current donation is recurring
}

/**
 * Central hook for managing the donation form flow
 * Coordinates all aspects of the donation process
 * Uses useDonationState for core state management
 */
export function useDonationForm({
  campaign,
  masjid,
  bankAccount,
  monthlyDonorCount = 0
}: UseDonationFormProps): UseDonationFormReturn {
  // Use the core state management hook
  const donationState = useDonationState(true); // Initialize from storage
  
  // Extract what we need from donationState
  const {
    currentStep, setCurrentStep,
    selectedAmount, setSelectedAmount,
    donorInfo, setDonorInfo,
    clientSecret, setClientSecret,
    recurringMeta, setRecurringMeta,
    tempDonationData, setTempDonationData,
    storeDonationMeta, storeRecurringMeta,
    getDonationMeta, getRecurringMeta,
    clearDonationData,
    resetDonationState: resetCoreState
  } = donationState;
  
  // Additional form-specific state
  const [giftAidDeclared, setGiftAidDeclared] = useState(false);
  const { showGiftAid, loading: taxInfoLoading } = useTaxInfo(masjid.id);
  const [showGiftAidStep, setShowGiftAidStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  
  // Update showGiftAidStep when tax info is loaded
  useEffect(() => {
    if (!taxInfoLoading) {
      setShowGiftAidStep(showGiftAid);
    }
  }, [showGiftAid, taxInfoLoading]);
  
  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.round(
      (Number(campaign.amount_raised) / Number(campaign.target_amount)) * 100
    ),
    100
  );
  
  // Enhanced reset that includes form-specific state
  const resetDonationState = () => {
    resetCoreState();
    setGiftAidDeclared(false);
    setShowGiftAidStep(false);
    setIsLoading(false);
    setIsImagePreviewOpen(false);
    setIsShareModalOpen(false);
    setIsRecurring(false);
  };
  
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
  
  // Process payment based on donor info and frequency
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
        fee_covered: tempDonationData.coverFee,
        gift_aid_declared: giftAidDeclared,
      };
      
      // Store donation metadata
      storeDonationMeta(donationMeta);

      if (frequency === "once") {
        // Handle one-time payment using server action
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
          tempDonationData.coverFee,
          giftAidDeclared,
          info.address
        );
        
        setClientSecret(data.client_secret);
        setIsRecurring(false);
        setCurrentStep("payment");
      } else {
        // Handle recurring payment using server action
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
        setIsRecurring(true);
        setCurrentStep("payment");
      }
    } catch (error) {
      console.error("Error creating intent:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle user details submission
  const handleUserDetailsSubmit = async (
    info: DonorInfo,
    frequency: PaymentFrequency
  ) => {
    if (!tempDonationData) return;
    
    // Set donor info in the context
    setDonorInfo(info);
    
    // Process the payment
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
  
  // Toggle image preview modal
  const toggleImagePreview = (isOpen?: boolean) => {
    setIsImagePreviewOpen(isOpen !== undefined ? isOpen : !isImagePreviewOpen);
  };
  
  // Toggle share modal
  const toggleShareModal = (isOpen?: boolean) => {
    setIsShareModalOpen(isOpen !== undefined ? isOpen : !isShareModalOpen);
  };
  
  // Handle donation completion
  const handleDonationSuccess = () => {
    resetDonationState();
  };

  return {
    // Core state from useDonationState
    currentStep,
    setCurrentStep,
    selectedAmount,
    setSelectedAmount,
    donorInfo,
    setDonorInfo,
    clientSecret,
    setClientSecret,
    recurringMeta,
    setRecurringMeta,
    tempDonationData,
    setTempDonationData,
    
    // Storage methods from useDonationState
    storeDonationMeta,
    storeRecurringMeta,
    getDonationMeta,
    getRecurringMeta,
    clearDonationData,
    
    // Form-specific state
    giftAidDeclared,
    setGiftAidDeclared,
    showGiftAidStep,
    setShowGiftAidStep,
    isLoading,
    setIsLoading,
    isImagePreviewOpen,
    isShareModalOpen,
    progressPercentage,
    isRecurring,
    
    // Campaign data
    campaign,
    masjid,
    bankAccount,
    monthlyDonorCount,
    
    // Form-specific actions
    resetDonationState,
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
}