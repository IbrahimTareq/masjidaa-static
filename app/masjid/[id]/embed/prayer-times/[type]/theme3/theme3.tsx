"use client";

import { PrayerIcon } from "@/components/client/ui/PrayerIcon";
import { FormattedData } from "@/lib/server/services/prayer";
import { BRAND_NAME, DOMAIN_NAME } from "@/utils/shared/constants";

export default function Theme3({
  formattedData,
}: {
  formattedData: FormattedData;
}) {
  const { prayerTimes, jummahTimes, lastUpdated, hijriDate, gregorianDate } =
    formattedData;

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <div className="max-w-sm mx-auto">
        {/* Date Section */}
        <div className="text-center py-3 bg-theme border-b border-gray-200 rounded-t-lg">
          <p className="text-sm font-semibold text-white mb-1">{hijriDate}</p>
          <p className="text-sm text-white font-medium">{gregorianDate}</p>
        </div>

        {/* Table Container with border and background */}
        <div className="bg-white border border-gray-200 border-t-0 overflow-hidden">
          {/* Prayer Times Header */}
          <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-1">
              <div className="col-span-1"></div> {/* Icon column */}
              <div className="col-span-4"></div> {/* Prayer name column */}
              <div className="col-span-4 text-center">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  STARTS
                </div>
              </div>
              <div className="col-span-3 text-center">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  IQAMAH
                </div>
              </div>
            </div>
          </div>

          {/* Prayer Rows with dividers */}
          <div className="divide-y divide-gray-100">
            {prayerTimes?.map((prayer) => (
              <div
                key={prayer.name}
                className={`grid grid-cols-12 gap-1 items-center px-3 py-4 transition-all ${
                  prayer.isActive
                    ? "bg-theme-accent"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {/* Prayer Icon */}
                <div className="col-span-1 flex justify-center">
                  <div className="w-6 h-6">
                    <PrayerIcon type={prayer.icon} className="text-theme" />
                  </div>
                </div>

                {/* Prayer Name */}
                <div className="col-span-4">
                  <div className="text-sm font-semibold tracking-wider uppercase text-gray-800">
                    {prayer.name}
                  </div>
                </div>

                {/* Athan Time */}
                <div className="col-span-4 text-center relative">
                  <div className="absolute left-0 top-0 h-full w-px bg-gray-200"></div>
                  <div className="text-sm font-medium tracking-wide text-gray-700">
                    {prayer.starts}
                  </div>
                </div>

                {/* Iqamah Time */}
                <div className="col-span-3 text-center relative">
                  <div className="absolute left-0 top-0 h-full w-px bg-gray-200"></div>
                  <div className="text-sm font-bold tracking-wide text-theme">
                    {prayer.iqamah}
                  </div>
                </div>
              </div>
            ))}

            {/* Jummah Header */}
            {jummahTimes && jummahTimes.length > 0 && (
              <div className="bg-gray-100 px-3 py-2 border-t border-gray-200">
                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-1"></div>
                  <div className="col-span-4"></div>
                  <div className="col-span-4 text-center">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Starts
                    </div>
                  </div>
                  <div className="col-span-3 text-center">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Iqamah
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Jummah Row(s) */}
            {jummahTimes &&
              jummahTimes.length > 0 &&
              jummahTimes.map((session, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-1 items-center px-3 py-4 transition-all bg-white hover:bg-gray-50"
                >
                  {/* Prayer Icon */}
                  <div className="col-span-1 flex justify-center">
                    <div className="w-6 h-6">
                      <PrayerIcon type="calendar" className="text-theme" />
                    </div>
                  </div>

                  {/* Prayer Name */}
                  <div className="col-span-4">
                    <div className="text-sm font-semibold tracking-wider uppercase text-gray-800">
                      {jummahTimes.length === 1
                        ? "Jumaah"
                        : `Jumaah ${index + 1}`}
                    </div>
                  </div>

                  {/* Khutbah Time */}
                  <div className="col-span-4 text-center relative">
                    <div className="absolute left-0 top-0 h-full w-px bg-gray-200"></div>
                    <div className="text-sm font-medium tracking-wide text-gray-700">
                      {session.starts}
                    </div>
                  </div>

                  {/* Iqamah Time */}
                  <div className="col-span-3 text-center relative">
                    <div className="absolute left-0 top-0 h-full w-px bg-gray-200"></div>
                    <div className="text-sm font-bold tracking-wide text-theme">
                      {session.khutbah}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Footer */}
        <div className="py-3">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center">
              <span>Powered by </span>
              <a
                href={`${DOMAIN_NAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold ml-1 text-theme"
              >
                {BRAND_NAME}
              </a>
            </div>
            {lastUpdated && (
              <span className="text-gray-400">{lastUpdated}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
