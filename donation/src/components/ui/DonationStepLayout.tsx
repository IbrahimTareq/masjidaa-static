"use client";

import React, { ReactNode } from "react";
import { ExtendedDonationStep } from "../../hooks/useDonationForm";

interface DonationStepLayoutProps {
  title: string;
  onBack?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  currentStep?: ExtendedDonationStep;
}

/**
 * Common layout component for all donation steps
 * Provides consistent styling and structure
 */
export function DonationStepLayout({
  title,
  onBack,
  children,
  footer,
  currentStep = "initial",
}: DonationStepLayoutProps) {
  // Calculate progress percentage based on the current step
  const getProgressPercentage = () => {
    const steps: ExtendedDonationStep[] = ["initial", "amount", "recurring_upsell", "gift_aid", "user_details", "payment"];
    const currentIndex = steps.indexOf(currentStep);
    
    // If we're on the initial step, show no progress
    if (currentStep === "initial") return 0;
    
    // For other steps, calculate percentage based on position
    // Skip the initial step in the calculation
    const effectiveSteps = steps.filter(step => step !== "initial");
    const effectiveIndex = effectiveSteps.indexOf(currentStep);
    
    // If step is not found, default to 0
    if (effectiveIndex < 0) return 0;
    
    // Calculate percentage, ensuring payment step is 100%
    return Math.min(((effectiveIndex + 1) / effectiveSteps.length) * 100, 100);
  };

  const progressPercentage = getProgressPercentage();
  const showProgress = currentStep !== "initial";

  return (
    <div className="p-5 pb-4">
      {/* Progress tracker */}
      {showProgress && (
        <div className="sticky top-0 left-0 right-0 -mx-5 -mt-5 bg-white/90 backdrop-blur-sm pb-5 z-10">
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-theme rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Header with back button and title */}
      <div className="flex justify-between items-center mb-8">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            ← Back
          </button>
        ) : (
          <div></div> // Empty div to maintain flex spacing when no back button
        )}
        <div className="text-lg font-medium">{title}</div>
      </div>

      {/* Main content */}
      <div className="space-y-6">
        {children}
      </div>

      {/* Optional footer */}
      {footer && <div className="mt-6">{footer}</div>}
    </div>
  );
}