"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { formatCurrency } from "@/utils/currency";
import {
  STRIPE_DONATION_FEE_FIXED,
  STRIPE_DONATION_FEE_PERCENTAGE_DOMESTIC,
  STRIPE_DONATION_FEE_PERCENTAGE_INTERNATIONAL,
  PRESET_AMOUNTS,
} from "@/utils/shared/constants";
import { Convert } from "easy-currencies";
import { Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { PaymentFrequency } from "../types";

interface DonationAmountStepProps {
  onNext: (
    amount: string,
    coverFee: boolean,
    frequency: PaymentFrequency,
    selectedCurrency: string
  ) => void;
  onBack: () => void;
  isLoading?: boolean;
}

// --- Helper functions ---------------------------------------------------

function calculateTotalWithFee(baseAmount: number, feePercentage: number, coverFee: boolean) {
  if (!coverFee) return baseAmount;
  return (baseAmount + STRIPE_DONATION_FEE_FIXED) / (1 - feePercentage);
}

function calculateBaseAmount(totalAmount: number, feePercentage: number, coverFee: boolean) {
  if (!coverFee) return totalAmount;
  const base = (totalAmount - STRIPE_DONATION_FEE_FIXED) / (1 + feePercentage);
  return Math.max(0, base);
}

// ------------------------------------------------------------------------

export default function DonationAmountStep({
  onNext,
  onBack,
  isLoading = false,
}: DonationAmountStepProps) {
  const masjid = useMasjidContext();
  const [customAmount, setCustomAmount] = useState("");
  const [coverFee, setCoverFee] = useState(true);
  const [frequency, setFrequency] = useState<PaymentFrequency>("once");
  const [selectedCurrency, setSelectedCurrency] = useState(
    masjid?.local_currency || "aud"
  );
  const [convertedAmounts, setConvertedAmounts] = useState<Record<number, number>>(
    PRESET_AMOUNTS.reduce((acc, amount) => ({ ...acc, [amount]: amount }), {})
  );
  const [conversionLoading, setConversionLoading] = useState(false);
  const [selectedPresetAmount, setSelectedPresetAmount] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ amount?: string }>({});

  // --- Utility: Get correct fee percentage ---------------------------------
  const getFeePercentage = () =>
    selectedCurrency === masjid?.local_currency
      ? STRIPE_DONATION_FEE_PERCENTAGE_DOMESTIC
      : STRIPE_DONATION_FEE_PERCENTAGE_INTERNATIONAL;

  // --- Utility: Displayed processing fee (for tooltip text) ----------------
  const calculateProcessingFee = (amount: number) => {
    const feePercentage = getFeePercentage();
    return Math.round((amount * feePercentage + STRIPE_DONATION_FEE_FIXED) * 100) / 100;
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
      if (!masjid) return;

      const feePercentage = getFeePercentage();

      try {
        setConversionLoading(true);

        const newAmounts: Record<number, number> = {};

        for (const amount of PRESET_AMOUNTS) {
          if (selectedCurrency === masjid.local_currency) {
            newAmounts[amount] = amount;
          } else {
            const converted = await Convert(amount)
              .from(masjid.local_currency)
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
  }, [selectedCurrency, masjid, selectedPresetAmount, coverFee]);

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
    onNext(customAmount, coverFee, frequency, selectedCurrency);
  };

  if (!masjid) return null;

  // --- UI ------------------------------------------------------------------
  return (
    <div className="p-5 pb-4">
      {/* Back + Title */}
      <div className="flex justify-between items-center mb-8">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          ← Back
        </button>
        <div className="text-lg font-medium">Donation Amount</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Frequency Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Select Frequency</label>
          <div className="grid grid-cols-3 gap-0 rounded-lg overflow-hidden border-2 border-gray-200">
            {["once", "weekly", "monthly"].map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => setFrequency(freq as PaymentFrequency)}
                className={`py-3 px-4 transition-colors cursor-pointer ${
                  frequency === freq
                    ? "bg-theme text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {freq === "once" ? "One-time" : freq.charAt(0).toUpperCase() + freq.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Select Amount</label>
          <div className="grid grid-cols-3 gap-3">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handlePresetClick(amount)}
                disabled={conversionLoading}
                className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                  selectedPresetAmount === amount
                    ? "border-[var(--theme-color)] bg-[var(--theme-color-10)] text-[var(--theme-color)]"
                    : "border-gray-200 hover:border-gray-300 text-gray-700 cursor-pointer"
                } ${conversionLoading ? "opacity-50 cursor-wait" : ""}`}
              >
                {conversionLoading
                  ? "..."
                  : formatCurrency({ amount: convertedAmounts[amount], currency: selectedCurrency })}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div>
            <div className="relative">
              <input
                type="number"
                name="amount"
                id="amount"
                min="1"
                step="any"
                value={customAmount}
                onChange={handleInputChange}
                className="block w-full pl-7 pr-12 py-3 border-gray-200 rounded-lg focus:ring-[var(--theme-color)] focus:border-[var(--theme-color)] bg-gray-50"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">{selectedCurrency.toUpperCase()}</span>
              </div>
            </div>
            {errors.amount && <p className="mt-2 text-sm text-red-600">{errors.amount}</p>}
          </div>

          {/* Cover Fees Checkbox */}
          {parseFloat(customAmount) > 0 && (
            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={coverFee}
                  onChange={(e) => handleFeeToggle(e.target.checked)}
                  className="rounded border-gray-300 text-[var(--theme-color)] focus:ring-[var(--theme-color)]"
                />
                <span className="flex items-center justify-between">
                  <span>
                    I want 100% of my donation to reach the cause (adds&nbsp;
                    {formatCurrency({
                      amount: calculateProcessingFee(getBaseAmount()),
                      currency: selectedCurrency,
                      decimals: 2,
                    })}
                    )
                  </span>
                  <Info
                    className="w-4 h-4 ml-2 text-gray-500 cursor-help flex-shrink-0"
                    data-tooltip-id="cover-fees-tooltip"
                  />
                </span>
                <Tooltip
                  id="cover-fees-tooltip"
                  place="top"
                  className="z-50 max-w-xs !bg-white !text-gray-800 !shadow-lg !rounded-xl !p-5 !border !border-gray-100"
                >
                  <div className="space-y-2 text-xs">
                    <h2 className="text-sm font-semibold">Cover Processing Fees</h2>
                    <p>When checked, 100% of your intended donation amount reaches the cause.</p>
                    <p>This small additional amount helps cover Stripe and platform fees.</p>
                  </div>
                </Tooltip>
              </label>
            </div>
          )}
        </div>

        {/* Currency Dropdown */}
        <div className="flex justify-center">
          <div className="flex items-center text-sm text-gray-600">
            <span>Donating in</span>
            <div className="relative inline-block ml-2">
              <select
                className="appearance-none bg-transparent border-none font-medium text-gray-800 pr-6 focus:outline-none cursor-pointer"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                disabled={conversionLoading}
              >
                <option value="aud">Australian Dollars</option>
                <option value="usd">US Dollars</option>
                <option value="eur">Euros</option>
                <option value="gbp">British Pounds</option>
                <option value="cad">Canadian Dollars</option>
                <option value="sgd">Singapore Dollars</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-theme hover:bg-theme-gradient disabled:bg-theme-accent text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          {isLoading ? "Processing..." : "Next"}
        </button>
      </form>
    </div>
  );
}
