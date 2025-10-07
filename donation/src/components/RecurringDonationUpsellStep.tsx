"use client";

import React from "react";
import { formatCurrency } from "@/utils/currency";
import { PaymentFrequency } from "../types";
import { Heart } from "lucide-react";

interface RecurringDonationUpsellStepProps {
  amount: string;
  currency: string;
  onSelectMonthlyAmount: (amount: string, frequency: PaymentFrequency) => void;
  onKeepOneTime: () => void;
  onBack: () => void;
}

export default function RecurringDonationUpsellStep({
  amount,
  currency,
  onSelectMonthlyAmount,
  onKeepOneTime,
  onBack,
}: RecurringDonationUpsellStepProps) {
  // Parse the amount and calculate half options
  const parsedAmount = parseFloat(amount);

  // Calculate half and quarter amounts (round up to whole numbers)
  const halfAmount = Math.ceil(parsedAmount / 2);
  const quarterAmount = Math.ceil(parsedAmount / 4);

  // Format the amounts for display
  const formattedOriginalAmount = formatCurrency({
    amount: parsedAmount,
    currency,
  });

  const formattedHalfAmount = formatCurrency({
    amount: halfAmount,
    currency,
  });

  const formattedQuarterAmount = formatCurrency({
    amount: quarterAmount,
    currency,
  });

  return (
    <div className="p-5 pb-4">
      <div className="flex justify-between items-center mb-8">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          ← Back
        </button>
        <div className="text-lg font-medium">Become a monthly supporter</div>
      </div>

      <div className="space-y-6">
        <p className="text-center text-gray-700">
          Would you consider turning your {formattedOriginalAmount} contribution
          into a monthly donation? Your continued support helps us do more,
          reach further, and create lasting impact — together.
        </p>

        {/* Monthly donation options */}
        <div className="space-y-3">
          {/* First option - Half amount */}
          <button
            onClick={() =>
              onSelectMonthlyAmount(halfAmount.toString(), "monthly")
            }
            className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-theme text-white font-medium rounded-lg hover:bg-theme-gradient transition-colors cursor-pointer"
          >
            <Heart className="w-5 h-5" fill="currentColor" />
            Donate {formattedHalfAmount}/month
          </button>

          {/* Second option - Quarter amount */}
          <button
            onClick={() =>
              onSelectMonthlyAmount(quarterAmount.toString(), "monthly")
            }
            className="w-full py-3 px-4 border border-theme text-theme font-medium rounded-lg hover:bg-theme-accent transition-colors cursor-pointer"
          >
            Donate {formattedQuarterAmount}/month
          </button>

          {/* Keep one-time option */}
          <div className="pt-4 text-center">
            <button
              onClick={onKeepOneTime}
              className="text-gray-700 hover:text-gray-900 font-medium underline cursor-pointer"
            >
              No, keep my one-time {formattedOriginalAmount} donation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
