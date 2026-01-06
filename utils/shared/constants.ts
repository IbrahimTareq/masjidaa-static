import { Autoplay } from "swiper/modules";

export const BRAND_NAME = "Masjidaa";
export const DOMAIN_NAME = process.env.NEXT_PUBLIC_ENV === "production" ? "https://masjidaa.com" : "https://dev.masjidaa.com";

// Standrd Stripe fee 1.7% + 1% platform fee
export const STRIPE_DONATION_FEE_PERCENTAGE_DOMESTIC = 0.027;
// Standard Stripe fee 3.5% + 1% platform fee
export const STRIPE_DONATION_FEE_PERCENTAGE_INTERNATIONAL = 0.045;
// Standard Stripe fixed fee
export const STRIPE_DONATION_FEE_FIXED = 0.30;

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
