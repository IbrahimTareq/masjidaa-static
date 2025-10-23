"use client";

import { Heart } from "lucide-react";
import { PaymentFrequency } from "../types";
import { useDonationUpsell } from "../hooks/useDonationUpsell";
import { DonationStepLayout, DonationButton } from "./ui";
import { ExtendedDonationStep } from "../hooks/useDonationForm";

interface RecurringDonationUpsellStepProps {
  amount: string;
  currency: string;
  onSelectMonthlyAmount: (amount: string, frequency: PaymentFrequency) => void;
  onKeepOneTime: () => void;
  onBack: () => void;
  currentStep?: ExtendedDonationStep;
}

export default function RecurringDonationUpsellStep({
  amount,
  currency,
  onSelectMonthlyAmount,
  onKeepOneTime,
  onBack,
  currentStep = "recurring_upsell",
}: RecurringDonationUpsellStepProps) {
  const {
    formattedOriginalAmount,
    formattedHalfAmount,
    formattedThirdAmount,
    handleSelectHalfAmount,
    handleSelectThirdAmount,
    handleKeepOneTime,
  } = useDonationUpsell({
    amount,
    currency,
    onSelectMonthlyAmount,
    onKeepOneTime,
  });

  return (
    <DonationStepLayout
      title="Become a monthly supporter"
      onBack={onBack}
      currentStep={currentStep}
    >
      <p className="text-center text-gray-700">
        Would you consider turning your {formattedOriginalAmount} contribution
        into a monthly donation? Your continued support helps us do more,
        reach further, and create lasting impact — together.
      </p>

      {/* Monthly donation options */}
      <div className="space-y-3">
        {/* First option - Half amount */}
        <DonationButton
          onClick={handleSelectHalfAmount}
          fullWidth
        >
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-5 h-5" fill="currentColor" />
            Donate {formattedHalfAmount}/month
          </div>
        </DonationButton>

        {/* Second option - Third amount */}
        <DonationButton
          onClick={handleSelectThirdAmount}
          variant="secondary"
          fullWidth
        >
          Donate {formattedThirdAmount}/month
        </DonationButton>

        {/* Keep one-time option */}
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={handleKeepOneTime}
            className="text-gray-700 hover:text-gray-900 font-medium underline cursor-pointer"
          >
            No, keep my one-time {formattedOriginalAmount} donation
          </button>
        </div>
      </div>
    </DonationStepLayout>
  );
}