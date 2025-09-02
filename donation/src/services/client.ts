"use client";

import { DonationMeta, RecurringMeta } from "../types";

/**
 * Stores donation metadata in session storage
 */
export function storeDonationMeta(donationMeta: DonationMeta): void {
  sessionStorage.setItem("donationMeta", JSON.stringify(donationMeta));
}

/**
 * Stores recurring metadata in session storage
 */
export function storeRecurringMeta(recurringMeta: RecurringMeta): void {
  sessionStorage.setItem("recurringMeta", JSON.stringify(recurringMeta));
}

/**
 * Retrieves donation metadata from session storage
 */
export function getDonationMeta(): DonationMeta | null {
  const data = sessionStorage.getItem("donationMeta");
  return data ? JSON.parse(data) : null;
}

/**
 * Retrieves recurring metadata from session storage
 */
export function getRecurringMeta(): RecurringMeta | null {
  const data = sessionStorage.getItem("recurringMeta");
  return data ? JSON.parse(data) : null;
}

/**
 * Clears donation metadata from session storage
 */
export function clearDonationData(): void {
  sessionStorage.removeItem("donationMeta");
  sessionStorage.removeItem("recurringMeta");
}
