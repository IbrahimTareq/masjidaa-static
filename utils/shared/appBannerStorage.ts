/**
 * Utility functions for managing app download banner dismissal state
 * Uses localStorage to persist dismissal preference with 1-week expiry
 */

const STORAGE_KEY = "app_banner_dismissed";
const EXPIRY_DAYS = 7;

interface DismissalData {
  dismissedAt: number;
  expiresAt: number;
}

/**
 * Store dismissal timestamp with expiry
 */
export function dismissBanner(): void {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const expiresAt = now + EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  const data: DismissalData = {
    dismissedAt: now,
    expiresAt,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Check if banner was dismissed and is still within expiry period
 */
export function isBannerDismissed(): boolean {
  if (typeof window === "undefined") return false;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;

  try {
    const data: DismissalData = JSON.parse(stored);
    const now = Date.now();

    // Check if expired
    if (now >= data.expiresAt) {
      // Clean up expired dismissal
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }

    return true;
  } catch {
    // Invalid data, clean up
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }
}

/**
 * Clear dismissal (for testing or manual reset)
 */
export function clearBannerDismissal(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
