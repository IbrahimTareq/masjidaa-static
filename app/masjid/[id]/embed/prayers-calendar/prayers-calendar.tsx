"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { PrayerSchedule } from "@/lib/server/services/masjidPrayers";
import { BRAND_NAME, DOMAIN_NAME } from "@/utils/shared/constants";

// Helper function to get all days in a month
const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export default function PrayersCalendar({
  monthlyPrayerData,
  year,
  month,
}: {
  monthlyPrayerData: PrayerSchedule[];
  year: number;
  month: number;
}) {
  const masjid = useMasjidContext();

  // Format month name
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(year, month)
  );

  // Get all days in the month to ensure we have a complete calendar
  const daysInMonth = getDaysInMonth(year, month);

  // Create a map of existing prayer data by date for quick lookup
  const prayerDataByDate = new Map<string, PrayerSchedule>();
  monthlyPrayerData.forEach((prayer) => {
    if (prayer.date) {
      prayerDataByDate.set(prayer.date, prayer);
    }
  });

  // Create a complete list of days with available prayer data or placeholders
  const allDaysWithData = daysInMonth.map((day) => {
    const dateString = day.toISOString().split("T")[0];
    return (
      prayerDataByDate.get(dateString) || {
        date: dateString,
        dailyPrayers: undefined,
        shurq: undefined,
        jummah: undefined,
        prayerInfo: undefined,
        lastUpdated: undefined,
      }
    );
  });

  return (
    <div className="bg-white text-black font-montserrat">
      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-4 sm:py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 md:mb-0 text-center md:text-left">
            Monthly Prayer Schedule | {monthName} {year}
          </h2>
          {masjid?.logo ? (
            <img
              src={masjid?.logo || ""}
              alt={masjid?.name || ""}
              className="w-16 sm:w-20"
            />
          ) : (
            <div className="flex flex-wrap gap-3 text-lg sm:text-xl text-gray-500">
              <span>{masjid?.name}</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="rounded-xl overflow-hidden shadow-sm min-w-full">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-gray-500 font-medium whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-2 sm:px-6 py-3 sm:py-4 text-center text-gray-500 font-medium whitespace-nowrap">
                    Fajr
                  </th>
                  <th className="px-2 sm:px-6 py-3 sm:py-4 text-center text-gray-500 font-medium whitespace-nowrap">
                    Sunrise
                  </th>
                  <th className="px-2 sm:px-6 py-3 sm:py-4 text-center text-gray-500 font-medium whitespace-nowrap">
                    Dhuhr
                  </th>
                  <th className="px-2 sm:px-6 py-3 sm:py-4 text-center text-gray-500 font-medium whitespace-nowrap">
                    Asr
                  </th>
                  <th className="px-2 sm:px-6 py-3 sm:py-4 text-center text-gray-500 font-medium whitespace-nowrap">
                    Maghrib
                  </th>
                  <th className="px-2 sm:px-6 py-3 sm:py-4 text-center text-gray-500 font-medium whitespace-nowrap">
                    Isha
                  </th>
                </tr>
              </thead>
              <tbody>
                {allDaysWithData.map((day, index) => {
                  const date = new Date(day.date || "");
                  const isToday =
                    new Date().toDateString() === date.toDateString();
                  const isFriday = date.getDay() === 5; // 5 is Friday

                  // Determine row styling
                  let rowClass = "border-b border-gray-100";
                  if (isToday) rowClass += " bg-blue-50";
                  if (isFriday) rowClass += " bg-green-50/50";
                  if (isToday && isFriday) rowClass += " bg-blue-100";

                  return (
                    <tr
                      key={index}
                      className={`${rowClass} hover:bg-gray-50/70 transition-colors`}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="font-medium">{date.getDate()}</div>
                        <div className="text-xs text-gray-500">
                          {date.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                        <div className="text-xs sm:text-sm">
                          <span className="font-medium">
                            {day.dailyPrayers?.fajr.start || "-"}
                          </span>
                          <span className="text-gray-400 mx-0.5 sm:mx-1">/</span>
                          <span className="text-gray-600">
                            {day.dailyPrayers?.fajr.iqamah || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                        <div className="text-xs sm:text-sm font-medium">
                          {day.shurq?.sunrise || "-"}
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                        <div className="text-xs sm:text-sm">
                          <span className="font-medium">
                            {day.dailyPrayers?.dhuhr.start || "-"}
                          </span>
                          <span className="text-gray-400 mx-0.5 sm:mx-1">/</span>
                          <span className="text-gray-600">
                            {day.dailyPrayers?.dhuhr.iqamah || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                        <div className="text-xs sm:text-sm">
                          <span className="font-medium">
                            {day.dailyPrayers?.asr.start || "-"}
                          </span>
                          <span className="text-gray-400 mx-0.5 sm:mx-1">/</span>
                          <span className="text-gray-600">
                            {day.dailyPrayers?.asr.iqamah || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                        <div className="text-xs sm:text-sm">
                          <span className="font-medium">
                            {day.dailyPrayers?.maghrib.start || "-"}
                          </span>
                          <span className="text-gray-400 mx-0.5 sm:mx-1">/</span>
                          <span className="text-gray-600">
                            {day.dailyPrayers?.maghrib.iqamah || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                        <div className="text-xs sm:text-sm">
                          <span className="font-medium">
                            {day.dailyPrayers?.isha.start || "-"}
                          </span>
                          <span className="text-gray-400 mx-0.5 sm:mx-1">/</span>
                          <span className="text-gray-600">
                            {day.dailyPrayers?.isha.iqamah || "-"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Masjid details - left aligned in a single line */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 w-full md:w-auto">
              {masjid?.address_label && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="truncate">{masjid.address_label}</span>
                </div>
              )}
              {masjid?.contact_number && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="truncate">{masjid.contact_number}</span>
                </div>
              )}
              {masjid?.email && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{masjid.email}</span>
                </div>
              )}
              {masjid?.website && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="truncate">{masjid.website}</span>
                </div>
              )}
            </div>
            
            {/* Powered by - right aligned */}
            <div className="flex items-center text-xs sm:text-sm text-gray-400 bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md mt-3 md:mt-0 self-center md:self-auto">
              <span>Powered by </span>
              <a
                href={`${DOMAIN_NAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold ml-1 text-gray-600 hover:text-theme transition-colors"
              >
                {BRAND_NAME}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
