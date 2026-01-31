"use client";

import { useLocationContext } from "@/context/locationContext";
import { useMasjid } from "@/context/masjidContext";
import { APPLE_APP_ID } from "@/utils/shared/constants";
import { Calendar, Check, Home, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AppDownloadClient() {
  const masjid = useMasjid();
  const location = useLocationContext();

  return (
    <section className="py-20 bg-theme-accent text-black relative">
      {/* Decorative background */}
      <div
        className="absolute inset-0 bg-[url('/pattern8.jpg')] bg-repeat opacity-10 pointer-events-none"
        style={{ backgroundSize: "400px" }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side */}
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            Stay connected with&nbsp;
            <span className="text-theme">{masjid.name}</span>
          </h1>
          <p className="text-base md:text-lg font-semibold text-gray-600 mb-6 md:mb-8">
            Get accurate prayer times with helpful iqama reminders, instant
            updates on announcements and events, and never miss a moment with
            your community. You can also support your masjid easily and
            securely, helping it continue to serve you and others.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <Link
              href={`https://apps.apple.com/us/app/pillars-prayer-times-qibla/id${APPLE_APP_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer min-h-[44px]"
            >
              <Image
                src="/appstore.png"
                alt="App Store"
                width={150}
                height={45}
                className="w-[130px] sm:w-[150px] h-auto"
              />
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=com.pillars.pillars"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer min-h-[44px]"
            >
              <Image
                src="/playstore.png"
                alt="Google Play"
                width={150}
                height={45}
                className="w-[130px] sm:w-[150px] h-auto"
              />
            </Link>
          </div>
        </div>

        <div className="flex justify-center mt-10 md:mt-0">
          <div className="relative w-[280px] sm:w-[300px] h-[560px] sm:h-[600px] rounded-[2.5rem] border-4 border-gray-800 bg-black shadow-2xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-20"></div>

            <div className="absolute inset-0 flex flex-col bg-white text-black">
              {/* Top banner */}
              <div className="h-56 bg-theme"></div>

              {/* Masjid card */}
              <div className="relative -mt-30 mx-3 sm:mx-4 bg-white rounded-2xl shadow p-3 sm:p-4">
                <h2 className="font-bold text-sm sm:text-md mb-2 pr-12">{masjid.name}</h2>

                {/* Floating logo */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg border-2 border-gray-100 flex justify-center items-center p-1.5 sm:p-2 shadow-sm">
                  <img
                    src={masjid.logo || ""}
                    alt="Masjid Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                {(masjid.website || masjid.contact_number || location?.address_label) && (
                  <div className="text-[10px] sm:text-xs text-gray-600 space-y-0.5 sm:space-y-1">
                    {masjid.website && <p>🌐 {masjid.website}</p>}
                    {masjid.contact_number && <p>📞 {masjid.contact_number}</p>}
                    {location?.address_label && <p>📍 {location.address_label}</p>}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-row justify-between mt-6">
                  <div className="flex-1 flex items-center justify-center py-2 mx-2 rounded-xl bg-green-100">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="flex-1 flex items-center justify-center py-2 mx-2">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 flex items-center justify-center py-2 mx-2">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Prayer timetable */}
              <div className="mt-3 sm:mt-4 flex-1 px-3 sm:px-4 overflow-y-auto bg-white">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left pb-1.5 sm:pb-2 text-[10px] sm:text-xs">Prayer</th>
                      <th className="text-center pb-1.5 sm:pb-2 text-[10px] sm:text-xs">Starts</th>
                      <th className="text-center pb-1.5 sm:pb-2 text-[10px] sm:text-xs">Iqamah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-800 text-[10px] sm:text-xs">
                    <tr>
                      <td className="py-2 font-semibold">Fajr</td>
                      <td className="text-center">4:52 AM</td>
                      <td className="text-center">6:50 AM</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">Dhuhr</td>
                      <td className="text-center">12:16 PM</td>
                      <td className="text-center">12:00 PM</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">Asr</td>
                      <td className="text-center">3:37 PM</td>
                      <td className="text-center">2:00 PM</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">Maghrib</td>
                      <td className="text-center">6:11 PM</td>
                      <td className="text-center">6:00 PM</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">Isha</td>
                      <td className="text-center">7:34 PM</td>
                      <td className="text-center">8:00 PM</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom nav */}
              <div className="border-t bg-white flex justify-between py-2 px-10 sm:px-15 text-gray-500 text-[10px] sm:text-xs">
                <div className="flex flex-col items-center gap-0.5">
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Home</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Discover</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
