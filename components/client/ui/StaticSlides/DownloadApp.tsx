import PrayerLayout from "@/components/LayoutWithHeader";
import { useLocationContext } from "@/context/locationContext";
import { useMasjidContext } from "@/context/masjidContext";
import { useQRCode } from "@/hooks/useQRCode";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import { Calendar, Check, Home, MapPin, Search } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export default function DownloadApp() {
  const masjid = useMasjidContext();
  const location = useLocationContext();

  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  const qrRef = useRef<HTMLDivElement>(null);

  useQRCode(
    {
      data: `${DOMAIN_NAME}/${masjid?.slug}`,
      width: 180,
      height: 180,
    },
    qrRef
  );

  return (
    <PrayerLayout headerTitle="Join our community online">
      <section className="text-black relative h-full flex items-center justify-center">
        <div
          className="w-full mx-auto px-[2vw] py-[1.5vh]"
          style={{
            maxWidth: 'clamp(800px, 95vw, 1600px)',
          }}
        >
          {/* Content centered in available space */}
          <div className="flex flex-col justify-center items-center text-center">
            <h1
              className="font-extrabold leading-tight break-words"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 4rem)',
                lineHeight: '1.2',
                marginBottom: 'clamp(1rem, 1.5vh, 1.5rem)',
              }}
            >
              Stay connected with&nbsp;
              <span className="text-theme">{masjid.name}</span>
            </h1>
            <p
              className="font-semibold text-gray-600 break-words"
              style={{
                fontSize: 'clamp(1rem, 1.6vw, 2rem)',
                lineHeight: '1.3',
                marginBottom: 'clamp(2rem, 3vh, 3rem)',
                maxWidth: '85%',
              }}
            >
              Get accurate prayer times with helpful iqama reminders, instant
              updates on announcements and events, and never miss a moment with
              your community. You can also support your masjid easily and
              securely, helping it continue to serve you and others.
            </p>

            <div
              className="flex items-center justify-center bg-white rounded-xl w-fit"
              style={{
                gap: 'clamp(1.5rem, 2.5vw, 3rem)',
                padding: 'clamp(1rem, 1.5vw, 2rem)',
              }}
            >
              {/* QR Code */}
              <div
                ref={qrRef}
                className="qr-code-container flex items-center justify-center border border-gray-100 rounded-lg overflow-hidden"
                style={{
                  width: 'clamp(140px, 14vw, 200px)',
                  height: 'clamp(140px, 14vw, 200px)',
                }}
              />

              {/* App Store buttons stacked */}
              <div
                className="flex flex-col items-center justify-center"
                style={{
                  gap: 'clamp(0.75rem, 1vw, 1.25rem)',
                }}
              >
                <Image
                  src="/appstore.png"
                  alt="App Store"
                  width={150}
                  height={45}
                  className="object-contain"
                  style={{
                    width: 'clamp(120px, 12vw, 180px)',
                    height: 'auto',
                  }}
                />
                <Image
                  src="/playstore.png"
                  alt="Google Play"
                  width={150}
                  height={45}
                  className="object-contain"
                  style={{
                    width: 'clamp(120px, 12vw, 180px)',
                    height: 'auto',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PrayerLayout>
  );
}
