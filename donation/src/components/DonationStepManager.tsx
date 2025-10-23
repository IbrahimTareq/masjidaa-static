"use client";

import React from "react";
import { Campaign, ShortLink, Masjid, BankAccount } from "../types";
import { useDonationForm } from "../hooks/useDonationForm";
import DonationAmountStep from "./DonationAmountStep";
import DonationUserDetailsStep from "./DonationUserDetailsStep";
import RecurringDonationUpsellStep from "./RecurringDonationUpsellStep";
import GiftAidStep from "./GiftAidStep";
import DonationForm from "./DonationForm";
import { DonationStats } from "./DonationStats";

interface DonationStepManagerProps {
  campaign: Campaign;
  masjid: Masjid;
  bankAccount: BankAccount;
  shortLink: ShortLink | null;
  monthlyDonorCount: number;
  totalDonorCount: number;
}

/**
 * Main donation flow manager component
 * Acts as the single entry point for the donation process
 */
export const DonationStepManager: React.FC<DonationStepManagerProps> = ({
  campaign,
  masjid,
  bankAccount,
  shortLink,
  monthlyDonorCount,
  totalDonorCount,
}) => {
  const {
    // State
    currentStep,
    selectedAmount,
    donorInfo,
    clientSecret,
    recurringMeta,
    isLoading,
    tempDonationData,
    progressPercentage,
    giftAidDeclared,
    showGiftAidStep,
    isRecurring,
    
    // Actions
    handleDonateClick,
    handleBack,
    handleAmountSelected,
    handleUserDetailsSubmit,
    handleRecurringUpsellSelected,
    handleKeepOneTime,
    handleGiftAidSubmit,
    handleDonationSuccess,
  } = useDonationForm({
    campaign,
    masjid,
    bankAccount,
    monthlyDonorCount
  });

  return (
    <div className="w-full lg:w-[480px] flex flex-col gap-6 mt-4 lg:mt-0">
      <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 overflow-hidden">
        {/* Stats Panel */}
        <div
          className={`transition-all duration-300 ${
            currentStep !== "initial"
              ? "opacity-0 invisible h-0"
              : "opacity-100 visible"
          }`}
        >
          <DonationStats
            campaign={campaign as any}
            masjid={masjid as any}
            monthlyDonorCount={monthlyDonorCount}
            totalDonorCount={totalDonorCount}
            loadingCount={false}
            progressPercentage={progressPercentage}
            onDonateClick={handleDonateClick}
          />
        </div>

        {/* Amount Selection Panel - Step 1 */}
        <div
          className={`transition-all duration-300 ${
            currentStep === "amount"
              ? "opacity-100 visible"
              : "opacity-0 invisible h-0"
          }`}
        >
          <DonationAmountStep
            onNext={handleAmountSelected}
            onBack={handleBack}
            isLoading={isLoading}
            currentStep={currentStep}
          />
        </div>

        {/* User Details Panel - Step 2 */}
        <div
          className={`transition-all duration-300 ${
            currentStep === "user_details"
              ? "opacity-100 visible"
              : "opacity-0 invisible h-0"
          }`}
        >
          {tempDonationData && (
            <DonationUserDetailsStep
              onSubmit={handleUserDetailsSubmit}
              onBack={handleBack}
              isLoading={isLoading}
              shortLink={shortLink?.short_code || ""}
              initialCurrency={tempDonationData.selectedCurrency}
              frequency={tempDonationData.frequency}
              giftAidDeclared={giftAidDeclared}
              currentStep={currentStep}
            />
          )}
        </div>

        {/* Recurring Donation Upsell Panel - Step 3 (conditional) */}
        <div
          className={`transition-all duration-300 ${
            currentStep === "recurring_upsell"
              ? "opacity-100 visible"
              : "opacity-0 invisible h-0"
          }`}
        >
          {tempDonationData && (
            <RecurringDonationUpsellStep
              amount={tempDonationData.amount}
              currency={tempDonationData.selectedCurrency}
              onSelectMonthlyAmount={handleRecurringUpsellSelected}
              onKeepOneTime={handleKeepOneTime}
              onBack={handleBack}
              currentStep={currentStep}
            />
          )}
        </div>
        
        {/* Gift Aid Declaration Panel - Step 3/4 (conditional for UK) */}
        <div
          className={`transition-all duration-300 ${
            currentStep === "gift_aid"
              ? "opacity-100 visible"
              : "opacity-0 invisible h-0"
          }`}
        >
          <GiftAidStep
            onSubmit={handleGiftAidSubmit}
            onBack={handleBack}
            isLoading={isLoading}
            currentStep={currentStep}
          />
        </div>

        {/* Payment Form Panel - Step 4/5 */}
        <div
          className={`transition-all duration-300 ${
            currentStep === "payment"
              ? "opacity-100 visible"
              : "opacity-0 invisible h-0"
          }`}
        >
          {clientSecret && selectedAmount && donorInfo && (
            <DonationForm
              masjid={masjid.slug}
              name={donorInfo.firstName}
              currency={masjid.local_currency}
              amount={selectedAmount / 100}
              clientSecret={clientSecret}
              mode={recurringMeta ? "recurring" : "one_off"}
              stripeAccountId={recurringMeta?.stripe_account_id}
              recurringMeta={recurringMeta}
              onSuccess={handleDonationSuccess}
              onCancel={handleBack}
              isRecurring={isRecurring}
            />
          )}
        </div>
      </div>
    </div>
  );
};