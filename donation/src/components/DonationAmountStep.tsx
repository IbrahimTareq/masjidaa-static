"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { formatCurrency } from "@/utils/currency";
import { PRESET_AMOUNTS } from "@/utils/shared/constants";
import { Info } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { useDonationAmount } from "../hooks/useDonationAmount";
import { ExtendedDonationStep } from "../hooks/useDonationForm";
import { PaymentFrequency } from "../types";
import { DonationButton, DonationStepLayout } from "./ui";

interface DonationAmountStepProps {
  onNext: (
    amount: string,
    coverFee: boolean,
    frequency: PaymentFrequency,
    selectedCurrency: string
  ) => void;
  onBack: () => void;
  isLoading?: boolean;
  currentStep?: ExtendedDonationStep;
}

export default function DonationAmountStep({
  onNext,
  onBack,
  isLoading = false,
  currentStep = "amount",
}: DonationAmountStepProps) {
  const masjid = useMasjidContext();

  const {
    customAmount,
    coverFee,
    frequency,
    selectedCurrency,
    selectedPresetAmount,
    errors,
    convertedAmounts,
    conversionLoading,
    getBaseAmount,
    calculateProcessingFee,
    setFrequency,
    setSelectedCurrency,
    handlePresetClick,
    handleFeeToggle,
    handleInputChange,
    handleSubmit,
  } = useDonationAmount({
    masjidCurrency: masjid?.local_currency || "aud",
    onAmountSelected: onNext,
  });

  if (!masjid) return null;

  return (
    <DonationStepLayout title="Donation Amount" onBack={onBack} currentStep={currentStep}>
      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        {/* Frequency Selection */}
        <div className="space-y-3 md:space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Donation Frequency
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {["once", "weekly", "monthly", "daily"].map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => setFrequency(freq as PaymentFrequency)}
                className={`text-xs md:text-sm py-3 px-3 md:px-4 rounded-lg border-2 transition-colors min-h-[44px] ${
                  frequency === freq
                    ? "border-[var(--theme-color)] bg-[var(--theme-color-10)] text-[var(--theme-color)]"
                    : "border-gray-200 hover:border-gray-300 text-gray-700 cursor-pointer"
                }`}
              >
                {freq === "once"
                  ? "One-off"
                  : freq.charAt(0).toUpperCase() + freq.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Selection */}
        <div className="space-y-3 md:space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Suggested Amounts
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handlePresetClick(amount)}
                disabled={conversionLoading}
                className={`text-xs md:text-sm py-3 px-3 md:px-4 rounded-lg border-2 transition-colors min-h-[44px] ${
                  selectedPresetAmount === amount
                    ? "border-[var(--theme-color)] bg-[var(--theme-color-10)] text-[var(--theme-color)]"
                    : "border-gray-200 hover:border-gray-300 text-gray-700 cursor-pointer"
                } ${conversionLoading ? "opacity-50 cursor-wait" : ""}`}
              >
                {conversionLoading
                  ? "..."
                  : formatCurrency({
                      amount: convertedAmounts[amount],
                      currency: selectedCurrency,
                    })}
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
                className="block w-full pl-7 pr-12 py-3 border-gray-200 rounded-lg focus:ring-[var(--theme-color)] focus:border-[var(--theme-color)] bg-gray-50 text-sm md:text-base min-h-[44px]"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {selectedCurrency.toUpperCase()}
                </span>
              </div>
            </div>
            {errors.amount && (
              <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
            )}
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
                <span className="flex items-center">
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
              </label>
              <Tooltip
                id="cover-fees-tooltip"
                place="top"
                className="z-50 max-w-xs !bg-white !text-gray-800 !opacity-100 !shadow-lg !rounded-xl !p-5 !border !border-gray-100"
                style={{
                  fontWeight: 500,
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              >
                <div className="space-y-2 text-xs">
                  <h2 className="text-sm font-semibold">
                    Cover Processing Fees
                  </h2>
                  <p>
                    When checked, 100% of your intended donation amount
                    reaches the cause.
                  </p>
                  <p>
                    This small additional amount helps cover Stripe and
                    platform fees.
                  </p>
                </div>
              </Tooltip>
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
                <option value="aud">🇦🇺 Australian Dollars</option>
                <option value="gbp">🇬🇧 British Pounds</option>
                <option value="cad">🇨🇦 Canadian Dollars</option>
                <option value="nzd">🇳🇿 New Zealand Dollars</option>
                <option value="usd">🇺🇸 US Dollars</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <DonationButton
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          fullWidth
        >
          Next
        </DonationButton>
      </form>
    </DonationStepLayout>
  );
}
