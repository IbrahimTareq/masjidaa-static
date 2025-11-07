"use client";

import { DonorInfo, PaymentFrequency } from "../types";
import React from "react";
import { Info } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { useDonationUserDetails } from "../hooks/useDonationUserDetails";
import { 
  DonationStepLayout, 
  DonationButton,
  DonationFormField,
  DonationTextInput,
  DonationTextarea,
  DonationCheckbox
} from "./ui";
import { ExtendedDonationStep } from "../hooks/useDonationForm";

interface DonationUserDetailsStepProps {
  onSubmit: (donorInfo: DonorInfo, frequency: PaymentFrequency) => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
  shortLink?: string;
  initialCurrency: string;
  frequency: PaymentFrequency;
  giftAidDeclared?: boolean; // Add this prop
  currentStep?: ExtendedDonationStep;
}

export default function DonationUserDetailsStep({
  onSubmit,
  onBack,
  isLoading = false,
  shortLink = "",
  initialCurrency,
  frequency,
  giftAidDeclared = false, // Default to false if not provided
  currentStep = "user_details",
}: DonationUserDetailsStepProps) {
  const {
    donorInfo,
    errors,
    handleInputChange,
    handleSubmit,
  } = useDonationUserDetails({
    initialCurrency,
    giftAidDeclared,
    onSubmit,
    frequency,
    shortLink,
  });

  return (
    <DonationStepLayout
      title="Your Information"
      onBack={onBack}
      currentStep={currentStep}
    >
      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <DonationFormField
              id="firstName"
              label="First Name"
              error={errors.firstName}
              required
            >
              <DonationTextInput
                id="firstName"
                value={donorInfo.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
                placeholder="John"
              />
            </DonationFormField>
            
            <DonationFormField
              id="lastName"
              label="Last Name"
              error={errors.lastName}
              required
            >
              <DonationTextInput
                id="lastName"
                value={donorInfo.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
                placeholder="Doe"
              />
            </DonationFormField>
          </div>

          <DonationFormField
            id="email"
            label="Email Address"
            error={errors.email}
            required
          >
            <DonationTextInput
              id="email"
              type="email"
              value={donorInfo.email}
              onChange={(e) => handleInputChange(e, "email")}
              placeholder="john@example.com"
            />
          </DonationFormField>
          
          {/* Address field - only shown when Gift Aid is declared */}
          {giftAidDeclared && (
            <DonationFormField
              id="address"
              label="Address"
              error={errors.address}
              helpText="Required for Gift Aid declarations."
              required
            >
              <DonationTextarea
                id="address"
                value={donorInfo.address || ""}
                onChange={(e) => handleInputChange(e as any, "address")}
                placeholder="Your full address"
                rows={3}
              />
            </DonationFormField>
          )}

          <DonationCheckbox
            id="isAnonymous"
            checked={donorInfo.isAnonymous}
            onChange={(e) => handleInputChange(e, "isAnonymous")}
            label={
              <span className="flex items-center justify-between">
                <span className="text-xs">
                  Don't display my name publicly on this donation campaign
                </span>
                <Info
                  className="w-4 h-4 ml-2 text-gray-500 cursor-help flex-shrink-0"
                  data-tooltip-id="anonymous-donation-tooltip"
                />
              </span>
            }
            className="pt-2"
          />
          <Tooltip
            id="anonymous-donation-tooltip"
            place="top"
            className="z-50 max-w-xs !bg-white !text-gray-800 !opacity-100 !shadow-lg !rounded-xl !p-5 !border !border-gray-100"
            style={{
              fontWeight: 500,
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div className="space-y-2 text-xs">
              <h2 className="text-sm font-semibold">Anonymous Donation</h2>
              <p>
                When checked, your name will <strong>not</strong> be displayed publicly in
                the list of donors for this campaign.
              </p>
            </div>
          </Tooltip>
        </div>

        <DonationButton
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          fullWidth
        >
          Continue to Payment
        </DonationButton>
      </form>
    </DonationStepLayout>
  );
}