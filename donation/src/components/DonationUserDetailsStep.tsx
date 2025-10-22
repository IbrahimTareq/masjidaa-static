"use client";

import { DonorInfo, PaymentFrequency } from "../types";
import React, { useState } from "react";
import { Info } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { BeatLoader } from "react-spinners";
import { useDonation } from "../context/DonationContext";

interface DonationUserDetailsStepProps {
  onSubmit: (donorInfo: DonorInfo, frequency: PaymentFrequency) => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
  shortLink?: string;
  initialCurrency: string;
  frequency: PaymentFrequency;
}

export default function DonationUserDetailsStep({
  onSubmit,
  onBack,
  isLoading = false,
  shortLink,
  initialCurrency,
  frequency,
}: DonationUserDetailsStepProps) {
  const { giftAidDeclared } = useDonation();
  const [donorInfo, setDonorInfo] = useState<DonorInfo>({
    firstName: "",
    lastName: "",
    email: "",
    currency: initialCurrency,
    isAnonymous: false,
    address: "",
  });

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: string;
  }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof DonorInfo
  ) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setDonorInfo((prev: DonorInfo) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

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
    
    // Validate address if Gift Aid is declared
    if (giftAidDeclared && !donorInfo.address?.trim()) {
      newErrors.address = "Address is required for Gift Aid donations";
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
    const donorInfoWithShortLink = {
      ...donorInfo,
      shortLink,
    };

    await onSubmit(donorInfoWithShortLink, frequency);
  };

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
        <div className="text-lg font-medium">Your Information</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          
          {/* Address field - only shown when Gift Aid is declared */}
          {giftAidDeclared && (
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address
              </label>
              <textarea
                id="address"
                value={donorInfo.address}
                onChange={(e) => handleInputChange(e as any, "address")}
                className="block w-full py-3 px-4 border-gray-200 rounded-lg focus:ring-[var(--theme-color)] focus:border-[var(--theme-color)] bg-gray-50"
                placeholder="Your full address"
                rows={3}
              />
              {errors.address && (
                <p className="mt-2 text-sm text-red-600">{errors.address}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Required for Gift Aid declarations.
              </p>
            </div>
          )}

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
                    When checked, your name will <strong>not</strong> be displayed publicly in
                    the list of donors for this campaign.
                  </p>
                </div>
              </Tooltip>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-theme hover:bg-theme-gradient disabled:bg-theme-accent text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          {isLoading ? <BeatLoader color="#fff" size={8} /> : "Continue to Payment"}
        </button>
      </form>
    </div>
  );
}
