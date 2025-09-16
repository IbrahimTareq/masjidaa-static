"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { Calendar, Check, Home, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DownloadApp() {
  const masjid = useMasjidContext();

  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  return (
    <section className="py-20 bg-theme-accent text-black relative">
      {/* Decorative background */}
      <div
        className="absolute inset-0 bg-[url('/pattern8.jpg')] bg-repeat opacity-10 pointer-events-none"
        style={{ backgroundSize: "400px" }}
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* Left Side */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Stay connected with&nbsp;
            <span className="text-theme">{masjid.name}</span>
          </h1>
          <p className="text-lg font-semibold text-gray-600 mb-8">
            Get accurate prayer times with helpful iqama reminders, instant
            updates on announcements and events, and never miss a moment with
            your community. You can also support your masjid easily and
            securely, helping it continue to serve you and others.
          </p>

          <div className="flex gap-4">
            <Link
              href="https://apps.apple.com/us/app/pillars-prayer-times-qibla/id1559086853"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <Image
                src="/appstore.png"
                alt="App Store"
                width={150}
                height={45}
              />
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=com.pillars.pillars"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <Image
                src="/playstore.png"
                alt="Google Play"
                width={150}
                height={45}
              />
            </Link>
          </div>
        </div>

        <div className="flex justify-center mt-10 lg:mt-0">
          <div className="relative w-[300px] h-[600px] rounded-[2.5rem] border-4 border-gray-800 bg-black shadow-2xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-20"></div>

            <div className="absolute inset-0 flex flex-col bg-white text-black">
              {/* Top banner */}
              <div className="h-56 bg-theme"></div>

              {/* Masjid card */}
              <div className="relative -mt-30 mx-4 bg-white rounded-2xl shadow p-4">
                <h2 className="font-bold text-md mb-2">{masjid.name}</h2>

                {/* Floating logo */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-lg border-2 border-gray-100 flex justify-center items-center p-2 shadow-sm">
                  <img
                    src={masjid.logo || ""}
                    alt="Masjid Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <p>🌐 {masjid.website}</p>
                  <p>📞 {masjid.contact_number}</p>
                  <p>📍 {masjid.address_label}</p>
                </div>

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
              <div className="mt-4 flex-1 px-4 overflow-y-auto bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left pb-2">Prayer</th>
                      <th className="text-center pb-2">Starts</th>
                      <th className="text-center pb-2">Iqamah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-800">
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
              <div className="border-t bg-white flex justify-between py-2 px-15 text-gray-500 text-xs">
                <div className="flex flex-col items-center">
                  <Home />
                  <span>Home</span>
                </div>
                <div className="flex flex-col items-center">
                  <Search />
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
