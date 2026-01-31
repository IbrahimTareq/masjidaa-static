"use client";

import { APPLE_APP_ID } from "@/utils/shared/constants";
import { dismissBanner } from "@/utils/shared/appBannerStorage";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const APP_STORE_URL = `https://apps.apple.com/us/app/pillars-prayer-times-qibla/id${APPLE_APP_ID}`;
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.pillars.pillars";

// Deep link configuration
const APP_DEEP_LINK_SCHEME = "masjidaa";
const APP_DEEP_LINK_BASE_PATH = "masjid";

/**
 * Builds a deep link URL for the Masjidaa app
 * Matches Expo Router structure: app/(tabs)/masjid/[slug]/index.tsx
 * @param masjidSlug - The masjid slug to navigate to
 * @returns The complete deep link URL (e.g., "masjidaa://masjid/masjid-name")
 */
function buildAppDeepLink(masjidSlug: string): string {
  return `${APP_DEEP_LINK_SCHEME}://${APP_DEEP_LINK_BASE_PATH}/${masjidSlug}`;
}

interface AppDownloadBannerProps {
  masjidSlug: string;
  masjidName: string;
  masjidLogo?: string | null;
  isOpen: boolean;
  onDismiss: () => void;
}

export default function AppDownloadBanner({
  masjidSlug,
  masjidName,
  masjidLogo,
  isOpen,
  onDismiss,
}: AppDownloadBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Delay banner appearance by 1.5 seconds
  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleContinueInApp = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      const userAgent = navigator.userAgent || navigator.vendor;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /android/i.test(userAgent);

      // Only attempt deep link on mobile devices
      if (!isIOS && !isAndroid) {
        // Desktop - just open App Store in new tab
        window.open(APP_STORE_URL, "_blank");
        return;
      }

      const storeUrl = isIOS ? APP_STORE_URL : PLAY_STORE_URL;
      const deepLink = buildAppDeepLink(masjidSlug);
      const startTime = Date.now();

      // Try to open the app
      window.location.href = deepLink;

      // Check if page is still visible after a delay
      // If app opened, page will be hidden/blurred
      const checkVisibility = () => {
        const elapsed = Date.now() - startTime;
        // If we're still here after 1.5s and page wasn't hidden, app isn't installed
        if (elapsed > 1500 && !document.hidden) {
          window.location.href = storeUrl;
        }
      };

      // Use both timeout and visibility change for reliability
      const timeoutId = setTimeout(checkVisibility, 1500);

      const handleVisibilityChange = () => {
        if (document.hidden) {
          // App opened successfully, clean up
          clearTimeout(timeoutId);
          document.removeEventListener("visibilitychange", handleVisibilityChange);
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Clean up listener after timeout
      setTimeout(() => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }, 2000);
    },
    [masjidSlug]
  );

  const handleStayOnWebsite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dismissBanner();
      onDismiss();
    },
    [onDismiss]
  );

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-theme flex items-center justify-center z-50 p-4 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Pattern background */}
      <div
        className="absolute inset-0 bg-[url('/pattern8.jpg')] bg-repeat opacity-10"
        style={{ backgroundSize: "400px" }}
      />

      {/* Content */}
      <div 
        className={`relative z-10 flex flex-col items-center justify-center text-center text-white max-w-md w-full px-6 transition-all duration-500 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Logo */}
        {masjidLogo && (
          <div className="mb-6 sm:mb-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-full shadow-xl flex items-center justify-center p-4 border-2 border-white/20">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src={masjidLogo}
                  alt={`${masjidName} logo`}
                  fill
                  className="object-contain p-1"
                  sizes="(max-width: 640px) 96px, 112px"
                />
              </div>
            </div>
          </div>
        )}

        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
          Follow {masjidName} on the app
        </h1>

        {/* Continue in app button */}
        <button
          onClick={handleContinueInApp}
          className="w-full max-w-xs bg-theme-gradient hover:bg-theme-gradient/90 text-white font-semibold py-4 px-8 rounded-lg mb-6"
        >
          Continue in app
        </button>

        {/* Stay on website link */}
        <button
          onClick={handleStayOnWebsite}
          className="text-white underline text-base mb-8 hover:text-white/80"
        >
          Stay on website
        </button>

        {/* App Store badges */}
        <div className="flex flex-row gap-4 items-center justify-center">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer min-h-[44px]"
          >
            <Image
              src="/appstore.png"
              alt="Download on the App Store"
              width={150}
              height={45}
              className="w-[130px] sm:w-[150px] h-auto"
            />
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer min-h-[44px]"
          >
            <Image
              src="/playstore.png"
              alt="GET IT ON Google Play"
              width={150}
              height={45}
              className="w-[130px] sm:w-[150px] h-auto"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
