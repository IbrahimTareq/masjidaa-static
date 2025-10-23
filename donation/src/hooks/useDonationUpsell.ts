"use client";

import { PaymentFrequency } from "../types";
import { formatCurrency } from "@/utils/currency";

interface UseDonationUpsellProps {
  amount: string;
  currency: string;
  onSelectMonthlyAmount: (amount: string, frequency: PaymentFrequency) => void;
  onKeepOneTime: () => void;
}

/**
 * Hook for managing recurring donation upsell functionality
 * Handles calculations and actions for the upsell step
 */
export function useDonationUpsell({
  amount,
  currency,
  onSelectMonthlyAmount,
  onKeepOneTime,
}: UseDonationUpsellProps) {
  // Parse the amount and calculate options
  const parsedAmount = parseFloat(amount);

  // Calculate half and third amounts (round up to whole numbers)
  const halfAmount = Math.ceil(parsedAmount / 2);
  const thirdAmount = Math.ceil(parsedAmount / 3);

  // Format the amounts for display
  const formattedOriginalAmount = formatCurrency({
    amount: parsedAmount,
    currency,
  });

  const formattedHalfAmount = formatCurrency({
    amount: halfAmount,
    currency,
  });

  const formattedThirdAmount = formatCurrency({
    amount: thirdAmount,
    currency,
  });

  // Handle selection of monthly donation
  const handleSelectHalfAmount = () => {
    onSelectMonthlyAmount(halfAmount.toString(), "monthly");
  };

  // Handle selection of monthly donation (third amount)
  const handleSelectThirdAmount = () => {
    onSelectMonthlyAmount(thirdAmount.toString(), "monthly");
  };

  // Handle keeping one-time donation
  const handleKeepOneTime = () => {
    onKeepOneTime();
  };

  return {
    formattedOriginalAmount,
    formattedHalfAmount,
    formattedThirdAmount,
    handleSelectHalfAmount,
    handleSelectThirdAmount,
    handleKeepOneTime,
  };
}
