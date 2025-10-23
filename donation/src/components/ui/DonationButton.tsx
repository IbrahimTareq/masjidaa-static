"use client";

import React, { ReactNode } from "react";
import { BeatLoader } from "react-spinners";

type ButtonVariant = "primary" | "secondary" | "outline" | "text";

interface DonationButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Standardized button component for donation flow
 * Supports different variants, loading state, and consistent styling
 */
export function DonationButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  isLoading = false,
  variant = "primary",
  fullWidth = false,
  className = "",
}: DonationButtonProps) {
  // Base classes
  const baseClasses = "py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer";
  
  // Width classes
  const widthClasses = fullWidth ? "w-full" : "";
  
  // Variant-specific classes
  const variantClasses = {
    primary: "bg-theme hover:bg-theme-gradient disabled:bg-theme-accent text-white",
    secondary: "bg-white border-2 border-theme text-theme hover:bg-theme-accent disabled:opacity-50",
    outline: "border border-gray-300 text-gray-700 hover:border-gray-400 disabled:opacity-50",
    text: "text-theme hover:text-theme-dark underline disabled:opacity-50",
  };
  
  // Disabled state
  const disabledState = disabled || isLoading;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabledState}
      className={`${baseClasses} ${widthClasses} ${variantClasses[variant]} ${className}`}
    >
      {isLoading ? <BeatLoader color={variant === "primary" ? "#fff" : "var(--theme-color)"} size={8} /> : children}
    </button>
  );
}

/**
 * Button group component for grouped buttons with consistent spacing
 */
export function DonationButtonGroup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {children}
    </div>
  );
}
