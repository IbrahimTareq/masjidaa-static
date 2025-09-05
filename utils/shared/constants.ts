import { Autoplay } from "swiper/modules";

export const BRAND_NAME = "Masjidaa";
export const DOMAIN_NAME = "https://masjidaa.com";
export const STRIPE_DONATION_FEE_PERCENTAGE = 0.05;
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
