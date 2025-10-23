"use client";

import React, { ReactNode } from "react";
import { Tooltip } from "react-tooltip";
import { Info } from "lucide-react";

interface DonationFormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  helpText?: string;
  tooltip?: string;
  required?: boolean;
}

/**
 * Reusable form field component with consistent styling
 * Handles labels, errors, tooltips, and help text
 */
export function DonationFormField({
  id,
  label,
  error,
  children,
  helpText,
  tooltip,
  required = false,
}: DonationFormFieldProps) {
  const tooltipId = `tooltip-${id}`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {tooltip && (
          <>
            <Info
              className="w-4 h-4 text-gray-500 cursor-help"
              data-tooltip-id={tooltipId}
            />
            <Tooltip
              id={tooltipId}
              place="top"
              className="z-50 max-w-xs !bg-white !text-gray-800 !shadow-lg !rounded-xl !p-5 !border !border-gray-100"
            >
              <div className="space-y-2 text-xs">
                <h2 className="text-sm font-semibold">{label}</h2>
                <p>{tooltip}</p>
              </div>
            </Tooltip>
          </>
        )}
      </div>

      {/* Field content (input, select, etc.) */}
      {children}

      {/* Error message or help text */}
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : helpText ? (
        <p className="text-xs text-gray-500">{helpText}</p>
      ) : null}
    </div>
  );
}

/**
 * Text input with consistent styling
 */
export function DonationTextInput({
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  className = "",
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`block w-full py-3 px-4 border-gray-200 rounded-lg focus:ring-[var(--theme-color)] focus:border-[var(--theme-color)] bg-gray-50 ${className}`}
    />
  );
}

/**
 * Textarea with consistent styling
 */
export function DonationTextarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  className = "",
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`block w-full py-3 px-4 border-gray-200 rounded-lg focus:ring-[var(--theme-color)] focus:border-[var(--theme-color)] bg-gray-50 ${className}`}
    />
  );
}

/**
 * Checkbox with consistent styling
 */
export function DonationCheckbox({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
}: {
  id: string;
  label: string | ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex items-start gap-2 text-sm text-gray-700 cursor-pointer ${className}`}>
      <div className="flex-shrink-0 mt-0.5">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="rounded border-gray-300 text-[var(--theme-color)] focus:ring-[var(--theme-color)]"
        />
      </div>
      <span>{label}</span>
    </label>
  );
}
