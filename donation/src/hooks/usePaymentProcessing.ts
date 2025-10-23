"use client";

import { 
  DonationMeta, 
  DonorInfo, 
  PaymentFrequency, 
  Campaign,
  Masjid,
  BankAccount,
  RecurringMeta
} from "../types";
import { createRecurringSetupIntent, createSinglePaymentIntent } from "../services";
import { useState } from "react";

interface UsePaymentProcessingProps {
  campaign: Campaign;
  bankAccount: BankAccount;
  masjid: Masjid;
  setSelectedAmount: (amount: number) => void;
  setClientSecret: (secret: string) => void;
  setRecurringMeta: (meta: RecurringMeta) => void;
  setDonorInfo: (info: DonorInfo) => void;
  setCurrentStep: (step: any) => void;
  tempDonationData?: {
    amount: string;
    coverFee: boolean;
    frequency: PaymentFrequency;
    selectedCurrency: string;
    sawUpsellScreen?: boolean;
  };
  giftAidDeclared: boolean;
  storeDonationMeta: (meta: DonationMeta) => void;
  storeRecurringMeta: (meta: RecurringMeta) => void;
}

/**
 * Hook for handling payment processing logic
 */
export function usePaymentProcessing({
  campaign,
  bankAccount,
  masjid,
  setSelectedAmount,
  setClientSecret,
  setRecurringMeta,
  setDonorInfo,
  setCurrentStep,
  tempDonationData,
  giftAidDeclared,
  storeDonationMeta,
  storeRecurringMeta
}: UsePaymentProcessingProps) {
  const [isLoading, setIsLoading] = useState(false);

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
        gift_aid_declared: giftAidDeclared,
      };
      
      // Store donation metadata using the function from useDonationState
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
        // Store recurring metadata using the function from useDonationState
        storeRecurringMeta(newRecurringMeta);
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

  return {
    isLoading,
    handleUserDetailsSubmit
  };
}