"use client";

import { useState } from "react";
import { DonorInfo, PaymentFrequency } from "../types";

interface UseDonationUserDetailsProps {
  initialCurrency: string;
  giftAidDeclared: boolean;
  onSubmit: (donorInfo: DonorInfo, frequency: PaymentFrequency) => Promise<void>;
  frequency: PaymentFrequency;
  shortLink?: string;
}

/**
 * Hook for managing donation user details form
 * Handles form state, validation, and submission
 */
export function useDonationUserDetails({
  initialCurrency,
  giftAidDeclared,
  onSubmit,
  frequency,
  shortLink = "",
}: UseDonationUserDetailsProps) {
  // Form state
  const [donorInfo, setDonorInfo] = useState<DonorInfo>({
    firstName: "",
    lastName: "",
    email: "",
    currency: initialCurrency,
    isAnonymous: false,
    address: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: string;
  }>({});

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof DonorInfo
  ) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setDonorInfo((prev: DonorInfo) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Form validation
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

  // Form submission
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

  return {
    donorInfo,
    errors,
    handleInputChange,
    handleSubmit,
  };
}
