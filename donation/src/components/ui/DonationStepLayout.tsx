"use client";

import React, { ReactNode } from "react";

interface DonationStepLayoutProps {
  title: string;
  onBack?: () => void;
  children: ReactNode;
  footer?: ReactNode;
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
}: DonationStepLayoutProps) {
  return (
    <div className="p-5 pb-4">
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
