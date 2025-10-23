"use client";

import { useEffect, useState } from "react";
import { Convert } from "easy-currencies";
import { PaymentFrequency } from "../types";
import { 
  PRESET_AMOUNTS, 
  STRIPE_DONATION_FEE_FIXED, 
  STRIPE_DONATION_FEE_PERCENTAGE_DOMESTIC, 
  STRIPE_DONATION_FEE_PERCENTAGE_INTERNATIONAL 
} from "@/utils/shared/constants";

interface UseDonationAmountProps {
  masjidCurrency: string;
  onAmountSelected: (
    amount: string,
    coverFee: boolean,
    frequency: PaymentFrequency,
    selectedCurrency: string
  ) => void;
}

/**
 * Hook for managing donation amount selection
 * Handles currency conversion, fee calculation, and amount validation
 */
export function useDonationAmount({
  masjidCurrency,
  onAmountSelected,
}: UseDonationAmountProps) {
  // Form state
  const [customAmount, setCustomAmount] = useState("");
  const [coverFee, setCoverFee] = useState(true);
  const [frequency, setFrequency] = useState<PaymentFrequency>("once");
  const [selectedCurrency, setSelectedCurrency] = useState(masjidCurrency || "aud");
  const [selectedPresetAmount, setSelectedPresetAmount] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ amount?: string }>({});
  
  // Currency conversion state
  const [convertedAmounts, setConvertedAmounts] = useState<Record<number, number>>(
    PRESET_AMOUNTS.reduce((acc, amount) => ({ ...acc, [amount]: amount }), {})
  );
  const [conversionLoading, setConversionLoading] = useState(false);

  // --- Utility: Get correct fee percentage ---------------------------------
  const getFeePercentage = () =>
    selectedCurrency === masjidCurrency
      ? STRIPE_DONATION_FEE_PERCENTAGE_DOMESTIC
      : STRIPE_DONATION_FEE_PERCENTAGE_INTERNATIONAL;

  // --- Utility: Displayed processing fee (for tooltip text) ----------------
  const calculateProcessingFee = (amount: number) => {
    const feePercentage = getFeePercentage();
    return Math.round((amount * feePercentage + STRIPE_DONATION_FEE_FIXED) * 100) / 100;
  };

  // --- Utility: Calculate total with fee ----------------------------------
  const calculateTotalWithFee = (baseAmount: number, feePercentage: number, includeFee: boolean) => {
    if (!includeFee) return baseAmount;
    return (baseAmount + STRIPE_DONATION_FEE_FIXED) / (1 - feePercentage);
  };

  // --- Utility: Calculate base amount -------------------------------------
  const calculateBaseAmount = (totalAmount: number, feePercentage: number, includeFee: boolean) => {
    if (!includeFee) return totalAmount;
    const base = (totalAmount - STRIPE_DONATION_FEE_FIXED) / (1 + feePercentage);
    return Math.max(0, base);
  };

  // --- Handle preset click -------------------------------------------------
  const handlePresetClick = (amount: number) => {
    setSelectedPresetAmount(amount);
    const feePercentage = getFeePercentage();
    const convertedAmount = convertedAmounts[amount];
    const total = calculateTotalWithFee(convertedAmount, feePercentage, coverFee);
    setCustomAmount(total.toFixed(2));
    setErrors({});
  };

  // --- Handle cover fee toggle --------------------------------------------
  const handleFeeToggle = (checked: boolean) => {
    setCoverFee(checked);

    if (selectedPresetAmount !== null) {
      const feePercentage = getFeePercentage();
      const convertedAmount = convertedAmounts[selectedPresetAmount];
      const total = calculateTotalWithFee(convertedAmount, feePercentage, checked);
      setCustomAmount(total.toFixed(2));
      return;
    }

    const currentAmount = parseFloat(customAmount);
    if (!customAmount || isNaN(currentAmount)) return;

    const feePercentage = getFeePercentage();
    const baseAmount = calculateBaseAmount(currentAmount, feePercentage, coverFee);
    const total = calculateTotalWithFee(baseAmount, feePercentage, checked);
    setCustomAmount(total.toFixed(2));
  };

  // --- Handle custom input -------------------------------------------------
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedPresetAmount(null);
    setErrors({});
  };

  // --- Currency conversion -------------------------------------------------
  useEffect(() => {
    const convertAmounts = async () => {
      const feePercentage = getFeePercentage();

      try {
        setConversionLoading(true);

        const newAmounts: Record<number, number> = {};

        for (const amount of PRESET_AMOUNTS) {
          if (selectedCurrency === masjidCurrency) {
            newAmounts[amount] = amount;
          } else {
            const converted = await Convert(amount)
              .from(masjidCurrency)
              .to(selectedCurrency);
            newAmounts[amount] = Math.ceil(converted);
          }
        }

        setConvertedAmounts(newAmounts);

        if (selectedPresetAmount !== null) {
          const convertedAmount = newAmounts[selectedPresetAmount];
          const total = calculateTotalWithFee(convertedAmount, feePercentage, coverFee);
          setCustomAmount(total.toFixed(2));
        }
      } catch (error) {
        console.error("Currency conversion error:", error);
      } finally {
        setConversionLoading(false);
      }
    };

    convertAmounts();
  }, [selectedCurrency, masjidCurrency, selectedPresetAmount, coverFee]);

  // --- Base amount for calculations ---------------------------------------
  const getBaseAmount = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount)) return 0;
    const feePercentage = getFeePercentage();
    return calculateBaseAmount(amount, feePercentage, coverFee);
  };

  // --- Validation ----------------------------------------------------------
  const validateForm = () => {
    const amount = parseFloat(customAmount);
    const newErrors: typeof errors = {};
    if (!customAmount || isNaN(amount)) newErrors.amount = "Please enter a valid amount";
    else if (amount < 1) newErrors.amount = "Minimum donation amount is 1";
    else if (amount > 999999) newErrors.amount = "Maximum donation amount is 999,999";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Submit --------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onAmountSelected(customAmount, coverFee, frequency, selectedCurrency);
  };

  return {
    // State
    customAmount,
    coverFee,
    frequency,
    selectedCurrency,
    selectedPresetAmount,
    errors,
    convertedAmounts,
    conversionLoading,
    
    // Calculations
    getBaseAmount,
    calculateProcessingFee,
    
    // Actions
    setFrequency,
    setSelectedCurrency,
    handlePresetClick,
    handleFeeToggle,
    handleInputChange,
    handleSubmit,
  };
}
