"use client";

import { PrayerIcon } from "@/components/client/ui/PrayerIcon";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";
import { BRAND_NAME, DOMAIN_NAME } from "@/utils/shared/constants";

export default function Theme2({
  formattedData,
}: {
  formattedData: FormattedData;
}) {
  const {
    dailyPrayerTimes,
    jummahPrayerTimes,
    lastUpdated,
    hijriDate,
    gregorianDate,
  } = formattedData;

  return (
    <div className="max-w-[360px] mx-auto bg-white rounded-xl border border-gray-200 font-montserrat text-sm overflow-hidden">
      {/* Header */}
      <div className="bg-theme text-white text-center py-4">
        <h2 className="text-lg font-bold tracking-wider">PRAYER TIMINGS</h2>
      </div>

      {/* Date Section */}
      <div className="text-center py-3 bg-gray-50 border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-800 mb-1">{hijriDate}</p>
        <p className="text-sm text-gray-600 font-medium">{gregorianDate}</p>
      </div>

      {/* Prayer Times Table */}
      <div className="bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <td className="py-3 px-4 text-left">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider opacity-0">
                  Prayer
                </span>
              </td>
              <td className="py-3 px-4 text-center border-l border-gray-200">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  STARTS
                </span>
              </td>
              <td className="py-3 px-4 text-center border-l border-gray-200">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  IQAMAH
                </span>
              </td>
            </tr>
          </thead>
          <tbody>
            {dailyPrayerTimes?.map((prayer) => (
              <tr
                key={prayer.name}
                className={`border-b border-gray-100 transition-colors duration-200 ${
                  prayer.isActive
                    ? "bg-theme-accent"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <td className="py-3 px-4 flex items-center">
                  <span className="mr-3">
                    <PrayerIcon type={prayer.icon} className="text-theme" />
                  </span>
                  <span className="font-semibold text-gray-800 text-sm">
                    {prayer.name}
                  </span>
                </td>
                <td className="py-3 px-4 text-center border-l border-gray-100 relative">
                  <div className="pr-3">
                    <span className="text-sm font-medium text-gray-700">
                      {prayer.start}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center border-l border-gray-100">
                  {prayer.iqamah && (
                    <span className="text-sm font-bold text-theme">
                      {prayer.iqamah}
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {/* Jummah Header Row */}
            {jummahPrayerTimes && jummahPrayerTimes.length > 0 && (
              <tr className="bg-gray-100 border-b border-gray-200">
                <td className="py-3 px-4 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider opacity-0">
                    Prayer
                  </span>
                </td>
                <td className="py-3 px-4 text-center border-l border-gray-200">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Starts
                  </span>
                </td>
                <td className="py-3 px-4 text-center border-l border-gray-200">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Khutbah
                  </span>
                </td>
              </tr>
            )}

            {/* Jummah Row(s) */}
            {jummahPrayerTimes?.map((session, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-4 flex items-center">
                  <div className="w-6 h-6 mr-3">
                    <PrayerIcon type="calendar" className="text-theme" />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">
                    {jummahPrayerTimes.length === 1
                      ? "Jummah"
                      : `Jummah ${index + 1}`}
                  </span>
                </td>
                <td className="py-3 px-4 text-center border-l border-gray-100 relative">
                  <div className="pr-3">
                    <span className="text-sm font-medium text-gray-700">
                      {session.start}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center border-l border-gray-100">
                  <span className="text-sm font-bold text-theme">
                    {session.khutbah}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 text-center py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600 px-4">
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
          {lastUpdated && <span className="text-gray-400">{lastUpdated}</span>}
        </div>
      </div>
    </div>
  );
}
