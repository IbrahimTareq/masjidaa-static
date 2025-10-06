"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { DonorInfo, PaymentFrequency } from "@/donation/src/types";
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
interface DonationAmountSelectorProps {
  onAmountSelected: (
    amount: number,
    donorInfo: DonorInfo,
    frequency: PaymentFrequency
  ) => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
  shortLink?: string;
}

export default function DonationAmountSelector({
  onAmountSelected,
  onBack,
  isLoading = false,
  shortLink,
}: DonationAmountSelectorProps) {
  const masjid = useMasjidContext();
  const [customAmount, setCustomAmount] = useState("");
  const [coverFee, setCoverFee] = useState(true);
  const [donorInfo, setDonorInfo] = useState<DonorInfo>({
    firstName: "",
    lastName: "",
    email: "",
    currency: masjid?.local_currency || "aud",
    isAnonymous: false,
  });
  const [frequency, setFrequency] = useState<PaymentFrequency>("once");
  const [selectedCurrency, setSelectedCurrency] = useState(
    masjid?.local_currency || "aud"
  );
  const [convertedAmounts, setConvertedAmounts] = useState<
    Record<number, number>
  >(PRESET_AMOUNTS.reduce((acc, amount) => ({ ...acc, [amount]: amount }), {}));
  const [conversionLoading, setConversionLoading] = useState(false);
  // Track which preset amount was selected (if any)
  const [selectedPresetAmount, setSelectedPresetAmount] = useState<
    number | null
  >(null);

  const [errors, setErrors] = useState<{
    amount?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  }>({});

  // Convert amounts when currency changes
  useEffect(() => {
    const convertAmounts = async () => {
      if (!masjid || selectedCurrency === masjid.local_currency) {
        // Reset to original amounts if using the default currency
        const originalAmounts: Record<number, number> = PRESET_AMOUNTS.reduce(
          (acc, amount) => ({ ...acc, [amount]: amount }),
          {} as Record<number, number>
        );
        setConvertedAmounts(originalAmounts);

        // Update the custom amount if a preset amount is selected
        if (selectedPresetAmount !== null) {
          const amount =
            originalAmounts[selectedPresetAmount] || selectedPresetAmount;
          const feePercentage = getFeePercentage();
          // Use the constant FIXED_FEE
          const newAmount = coverFee
            ? (
                amount +
                amount * feePercentage +
                STRIPE_DONATION_FEE_FIXED
              ).toFixed(2)
            : amount.toString();
          setCustomAmount(newAmount);
        }

        return;
      }

      try {
        setConversionLoading(true);

        // Create a map of converted amounts
        const newAmounts: Record<number, number> = {};

        for (const amount of PRESET_AMOUNTS) {
          // Convert from masjid's currency to selected currency
          const converted = await Convert(amount)
            .from(masjid.local_currency)
            .to(selectedCurrency);

          // Round up to the nearest whole number
          newAmounts[amount] = Math.ceil(converted);
        }

        setConvertedAmounts(newAmounts);

        // Update the custom amount if a preset amount is selected
        if (selectedPresetAmount !== null) {
          const convertedAmount = newAmounts[selectedPresetAmount];
          const feePercentage = getFeePercentage();
          // Use the constant FIXED_FEE
          const newAmount = coverFee
            ? (
                convertedAmount +
                convertedAmount * feePercentage +
                STRIPE_DONATION_FEE_FIXED
              ).toFixed(2)
            : convertedAmount.toString();
          setCustomAmount(newAmount);
        }
      } catch (error) {
        console.error("Currency conversion error:", error);
        // Fallback to original amounts on error
        const fallbackAmounts: Record<number, number> = PRESET_AMOUNTS.reduce(
          (acc, amount) => ({ ...acc, [amount]: amount }),
          {} as Record<number, number>
        );
        setConvertedAmounts(fallbackAmounts);
      } finally {
        setConversionLoading(false);
      }
    };

    convertAmounts();
  }, [
    selectedCurrency,
    masjid?.local_currency,
    masjid,
    selectedPresetAmount,
    coverFee,
  ]);

  const getFeePercentage = () => {
    // Use domestic fee if selected currency matches masjid's local currency, otherwise use international fee
    return selectedCurrency === masjid?.local_currency
      ? STRIPE_DONATION_FEE_PERCENTAGE_DOMESTIC
      : STRIPE_DONATION_FEE_PERCENTAGE_INTERNATIONAL;
  };

  const calculateProcessingFee = (amount: number) => {
    const feePercentage = getFeePercentage();
    // Calculate percentage-based fee and add fixed fee
    const percentageFee = amount * feePercentage;
    return Math.round((percentageFee + STRIPE_DONATION_FEE_FIXED) * 100) / 100; // Round to 2 decimal places
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof DonorInfo | "amount"
  ) => {
    if (field === "amount") {
      const newAmount = e.target.value;
      setCustomAmount(newAmount);

      // Clear selected preset amount if user manually changes the amount
      const feePercentage = getFeePercentage();
      // Use the constant FIXED_FEE
      const matchesPreset =
        selectedPresetAmount !== null &&
        parseFloat(newAmount) ===
          (coverFee
            ? convertedAmounts[selectedPresetAmount] +
              convertedAmounts[selectedPresetAmount] * feePercentage +
              STRIPE_DONATION_FEE_FIXED
            : convertedAmounts[selectedPresetAmount]);

      if (!matchesPreset) {
        setSelectedPresetAmount(null);
      }

      setErrors((prev) => ({ ...prev, amount: undefined }));
    } else {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setDonorInfo((prev: DonorInfo) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePresetClick = (amount: number) => {
    // Store which preset amount was selected
    setSelectedPresetAmount(amount);

    const convertedAmount = convertedAmounts[amount];
    const feePercentage = getFeePercentage();
    // Use the constant FIXED_FEE
    const newAmount = coverFee
      ? (
          convertedAmount +
          convertedAmount * feePercentage +
          STRIPE_DONATION_FEE_FIXED
        ).toFixed(2) // Add fee if checkbox is checked
      : convertedAmount.toString();
    setCustomAmount(newAmount);
    setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const handleFeeToggle = (checked: boolean) => {
    setCoverFee(checked);

    // If a preset amount is selected, update the amount with or without fee
    if (selectedPresetAmount !== null) {
      const convertedAmount = convertedAmounts[selectedPresetAmount];
      const feePercentage = getFeePercentage();
      // Use the constant FIXED_FEE
      const newAmount = checked
        ? (
            convertedAmount +
            convertedAmount * feePercentage +
            STRIPE_DONATION_FEE_FIXED
          ).toFixed(2) // Add fee
        : convertedAmount.toString(); // Original amount without fee

      setCustomAmount(newAmount);
      return;
    }

    // Otherwise handle custom amount
    if (!customAmount) return;
    const baseAmount = parseFloat(customAmount);
    if (isNaN(baseAmount)) return;

    const feePercentage = getFeePercentage();
    // Use the constant FIXED_FEE

    // For adding fee: add percentage fee and fixed fee
    // For removing fee: need to solve for original amount when we know the total with fees
    const newAmount = checked
      ? (
          baseAmount +
          baseAmount * feePercentage +
          STRIPE_DONATION_FEE_FIXED
        ).toFixed(2) // Add fee
      : (baseAmount - STRIPE_DONATION_FEE_FIXED) / (1 + feePercentage) > 0
      ? (
          (baseAmount - STRIPE_DONATION_FEE_FIXED) /
          (1 + feePercentage)
        ).toFixed(2) // Remove fee if it was included
      : "0.00"; // Prevent negative amounts

    setCustomAmount(newAmount);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Amount validation
    const amount = parseFloat(customAmount);
    if (!customAmount || isNaN(amount)) {
      newErrors.amount = "Please enter a valid amount";
    } else if (amount < 1) {
      newErrors.amount = "Minimum donation amount is 1";
    } else if (amount > 999999) {
      newErrors.amount = "Maximum donation amount is 999,999";
    }

    // Personal info validation
    if (!donorInfo.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!donorInfo.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!donorInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Store the selected currency in the donor info for processing
    const donorInfoWithCurrencyAndShortLink = {
      ...donorInfo,
      currency: selectedCurrency,
      shortLink,
    };

    // Convert to cents/pence for Stripe
    await onAmountSelected(
      Math.round(parseFloat(customAmount) * 100),
      donorInfoWithCurrencyAndShortLink,
      frequency
    );
  };

  const getBaseAmount = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount)) return 0;

    const feePercentage = getFeePercentage();
    // Use the constant FIXED_FEE

    // If covering fee, we need to remove both percentage and fixed fee to get base amount
    if (coverFee) {
      const baseAmount =
        (amount - STRIPE_DONATION_FEE_FIXED) / (1 + feePercentage);
      return baseAmount > 0 ? baseAmount : 0; // Prevent negative amounts
    }

    return amount; // If not covering fee, amount is already the base amount
  };

  if (!masjid) return null;

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
        <div className="text-lg font-medium">Donation Details</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Frequency Section - Moved to top */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Frequency
          </label>
          <div className="grid grid-cols-3 gap-0 rounded-lg overflow-hidden border-2 border-gray-200">
            <button
              type="button"
              onClick={() => setFrequency("once")}
              className={`py-3 px-4 transition-colors cursor-pointer ${
                frequency === "once"
                  ? "bg-theme text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              One-time
            </button>
            <button
              type="button"
              onClick={() => setFrequency("weekly")}
              className={`py-3 px-4 transition-colors cursor-pointer ${
                frequency === "weekly"
                  ? "bg-theme text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setFrequency("monthly")}
              className={`py-3 px-4 transition-colors cursor-pointer ${
                frequency === "monthly"
                  ? "bg-theme text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Amount Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Amount
          </label>

          <div className="grid grid-cols-3 gap-3">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                type="button"
                key={amount}
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
                  : formatCurrency({
                      amount: convertedAmounts[amount],
                      currency: selectedCurrency,
                    })}
              </button>
            ))}
          </div>

          <div>
            <div className="relative">
              <input
                type="number"
                name="amount"
                id="amount"
                min="1"
                step="any"
                value={customAmount}
                onChange={(e) => handleInputChange(e, "amount")}
                className="block w-full pl-7 pr-12 py-3 border-gray-200 rounded-lg focus:ring-[var(--theme-color)] focus:border-[var(--theme-color)] bg-gray-50"
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

          {parseFloat(customAmount) > 0 && (
            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <div className="flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={coverFee}
                    onChange={(e) => handleFeeToggle(e.target.checked)}
                    className="rounded border-gray-300 text-[var(--theme-color)] focus:ring-[var(--theme-color)]"
                  />
                </div>
                <span className="text-xs flex items-center justify-between">
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
                  className="z-50 max-w-xs !bg-white !text-gray-800 !opacity-100 !shadow-lg !rounded-xl !p-5 !border !border-gray-100"
                  style={{
                    fontWeight: 500,
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <div className="space-y-2 text-xs">
                    <h2 className="text-sm font-semibold">Cover Processing Fees</h2>
                    <p>
                      When checked, you'll cover the payment processing fees so that 100% of your intended donation amount reaches the cause.
                    </p>
                    <p>
                      This small additional amount helps cover the fees charged by the platform and payment processors for handling the transaction.
                    </p>
                  </div>
                </Tooltip>
              </label>
            </div>
          )}
        </div>

        {/* Personal Information Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={donorInfo.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
                className="block w-full py-3 px-4 border-gray-200 rounded-lg focus:ring-[var(--theme-color)] focus:border-[var(--theme-color)] bg-gray-50"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={donorInfo.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
                className="block w-full py-3 px-4 border-gray-200 rounded-lg focus:ring-[var(--theme-color)] focus:border-[var(--theme-color)] bg-gray-50"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={donorInfo.email}
              onChange={(e) => handleInputChange(e, "email")}
              className="block w-full py-3 px-4 border-gray-200 rounded-lg focus:ring-[var(--theme-color)] focus:border-[var(--theme-color)] bg-gray-50"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <div className="flex-shrink-0">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  checked={donorInfo.isAnonymous}
                  onChange={(e) => handleInputChange(e, "isAnonymous")}
                  className="rounded border-gray-300 text-[var(--theme-color)] focus:ring-[var(--theme-color)]"
                />
              </div>
              <span className="flex items-center justify-between">
                <span>
                  Don't display my name publicly on this donation campaign
                </span>
                <Info
                  className="w-4 h-4 ml-2 text-gray-500 cursor-help flex-shrink-0"
                  data-tooltip-id="anonymous-donation-tooltip"
                />
              </span>
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
                    When checked, your name will not be displayed publicly in
                    the list of donors for this campaign.
                  </p>
                </div>
              </Tooltip>
            </label>
          </div>
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-theme hover:bg-theme-gradient disabled:bg-theme-accent text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          {isLoading ? "Processing..." : "Continue to Payment"}
        </button>
      </form>
    </div>
  );
}
