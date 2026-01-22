import { Autoplay } from "swiper/modules";

export const BRAND_NAME = "Masjidaa";
export const DOMAIN_NAME = process.env.NEXT_PUBLIC_ENV === "production" ? "https://masjidaa.com" : "https://dev.masjidaa.com";

// Stripe fee configuration by base currency
// Each entry contains: domestic fee %, international fee %, and fixed fee
// Domestic = Stripe domestic fee + 1% platform fee
// International = Stripe international fee + currency conversion fee + 1% platform fee
export const STRIPE_FEE_CONFIG: Record<string, { domestic: number; international: number; fixed: number }> = {
  // AU: 1.7% Stripe domestic + 1% platform = 2.7%
  //     3.5% Stripe international + 2% currency conversion + 1% platform = 6.5%
  aud: { domestic: 0.027, international: 0.065, fixed: 0.30 },
  // US: 2.9% Stripe domestic + 1% platform = 3.9%
  //     2.9% base + 1.5% international + 1% currency conversion + 1% platform = 6.4%
  usd: { domestic: 0.039, international: 0.064, fixed: 0.30 },
  // UK: 1.9% Stripe domestic + 1% platform = 2.9%
  //     3.25% Stripe international + 2% currency conversion + 1% platform = 6.25%
  gbp: { domestic: 0.029, international: 0.0625, fixed: 0.20 },
};

// Default fallback fees (uses AU rates)
export const DEFAULT_STRIPE_FEES = STRIPE_FEE_CONFIG.aud;

/**
 * Get Stripe fee configuration for a given base currency
 * Falls back to AU rates if currency not configured
 */
export function getStripeFees(baseCurrency: string) {
  const normalizedCurrency = baseCurrency.toLowerCase();
  return STRIPE_FEE_CONFIG[normalizedCurrency] ?? DEFAULT_STRIPE_FEES;
}

export const PRESET_AMOUNTS = [20, 50, 100, 200];
export const SWIPER_SETTINGS = {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  navigation: false,
  modules: [Autoplay],
  className: "mySwiper",
};
