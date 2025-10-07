"use client";

import React from "react";
import { DonationProvider, useDonation } from "../context/DonationContext";
import DonationAmountStep from "./DonationAmountStep";
import DonationUserDetailsStep from "./DonationUserDetailsStep";
import RecurringDonationUpsellStep from "./RecurringDonationUpsellStep";
import DonationForm from "./DonationForm";
import { DonationStats } from "./DonationStats";
import { Campaign, ShortLink, Masjid, BankAccount } from "../types";

interface DonationStepManagerProps {
  campaign: Campaign;
  masjid: Masjid;
  bankAccount: BankAccount;
  shortLink: ShortLink | null;
  monthlyDonorCount: number;
  totalDonorCount: number;
}

// This is the main component that gets exported
export const DonationStepManager: React.FC<DonationStepManagerProps> = ({
  campaign,
  masjid,
  bankAccount,
  shortLink,
  monthlyDonorCount,
  totalDonorCount,
}) => {
  return (
    <DonationProvider
      campaign={campaign}
      bankAccount={bankAccount}
      masjid={masjid}
      monthlyDonorCount={monthlyDonorCount}
    >
      <DonationStepManagerContent
        campaign={campaign}
        masjid={masjid}
        bankAccount={bankAccount}
        shortLink={shortLink}
        monthlyDonorCount={monthlyDonorCount}
        totalDonorCount={totalDonorCount}
      />
    </DonationProvider>
  );
};

// This is an internal component that uses the context
const DonationStepManagerContent: React.FC<DonationStepManagerProps> = ({
  campaign,
  masjid,
  shortLink,
  monthlyDonorCount,
  totalDonorCount,
}) => {
  const {
    currentStep,
    selectedAmount,
    donorInfo,
    clientSecret,
    recurringMeta,
    isLoading,
    tempDonationData,
    handleAmountSelected,
    handleUserDetailsSubmit,
    handleRecurringUpsellSelected,
    handleKeepOneTime,
    handleBack,
    handleDonationSuccess,
  } = useDonation();

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
            />
          )}
        </div>

        {/* Payment Form Panel - Step 4 */}
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
            />
          )}
        </div>
      </div>
    </div>
  );
};
