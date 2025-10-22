/**
 * Common metadata for all donation types
 */
export interface DonationMeta {
  masjid_id: string;
  campaign_id: string;
  campaign_title: string;
  email: string;
  first_name: string;
  last_name: string;
  is_anonymous: boolean;
  amount_cents: number;
  currency: string;
  gift_aid_declared?: boolean;
  address?: string;
}

/**
 * Metadata specific to recurring donations
 */
export interface RecurringMeta {
  frequency: "daily" | "weekly" | "monthly";
  start_date?: string;
  end_date?: string;
  stripe_customer_id: string;
  stripe_account_id: string;
}

/**
 * Donor information
 */
export interface DonorInfo {
  firstName: string;
  lastName: string;
  email: string;
  currency: string;
  isAnonymous: boolean;
  address?: string;
}

/**
 * Donation step types
 */
export type DonationStep = "initial" | "amount" | "payment";

/**
 * Payment mode options
 */
export type PaymentMode = "one_off" | "recurring";

/**
 * Payment frequency options
 */
export type PaymentFrequency = "once" | "daily" | "weekly" | "monthly";

/**
 * Campaign information
 */
export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  amount_raised: number;
  target_amount: number;
  masjid_id: string;
  bank_account_id: string | null;
  short_link_id: string | null;
  active: boolean;
  created_at: string | null;
  // Add any other required fields from the database type
}

/**
 * Masjid (mosque) information
 */
export interface Masjid {
  id: string;
  name: string;
  slug: string;
  local_currency: string;
  theme_color_id: string | null;
  active: boolean;
  address_label: string;
  bg_image: string | null;
  city: string;
  claimed: boolean;
  contact_number: string | null;
  country: string;
  created_at: string | null;
  description: string | null;
  website: string | null;
  // Add any other required fields from the database type
}

/**
 * Bank account information
 */
export interface BankAccount {
  id: string;
  stripe_account_id: string;
  masjid_id: string;
  // Add any other required fields from the database type
}

/**
 * Short link information
 */
export interface ShortLink {
  id: string;
  short_code: string;
  clicks?: number | null;
  created_at?: string | null;
  masjid_id?: string | null;
  original_url?: string;
  type?: "event" | "announcement" | "donation-campaign" | "masjid" | "other";
}

/**
 * Theme information
 */
export interface Theme {
  id: string;
  base_color: string;
  accent_color: string;
  gradient_color: string;
}
