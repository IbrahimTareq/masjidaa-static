"use client";

import { useState } from "react";

interface UseDonationGiftAidProps {
  onSubmit: (giftAidDeclared: boolean) => void;
}

/**
 * Hook for managing Gift Aid declaration
 * Handles state and submission for Gift Aid step
 */
export function useDonationGiftAid({
  onSubmit,
}: UseDonationGiftAidProps) {
  // Gift Aid declaration state
  const [giftAidDeclared, setGiftAidDeclared] = useState(false);

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(giftAidDeclared);
  };

  return {
    giftAidDeclared,
    setGiftAidDeclared,
    handleSubmit,
  };
}
