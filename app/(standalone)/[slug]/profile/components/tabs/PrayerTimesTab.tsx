import { PrayerTime } from "@/lib/server/domain/prayer/getServerPrayerData";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ApprovedBusinessAd } from "../../types";
import { BusinessAdCard } from "../BusinessAdCard";
import { PrayerTimeCard } from "../PrayerTimeCard";

interface PrayerTimesTabProps {
  dailyPrayers: (PrayerTime | undefined)[];
  sunrise: { sunrise: string } | null;
  jummah: { start: string; khutbah: string } | undefined;
  gregorianDate: string;
  islamicDate: string;
  businessAds: ApprovedBusinessAd[];
}

export function PrayerTimesTab({
  dailyPrayers,
  sunrise,
  jummah,
  gregorianDate,
  islamicDate,
  businessAds,
}: PrayerTimesTabProps) {
  const [fajr, dhuhr, asr, maghrib, isha] = dailyPrayers;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Prayer Times
          </h3>
          <p className="text-gray-600">
            {gregorianDate} • {islamicDate}
          </p>
        </div>

        {/* Prayer Times Grid - Theme4 Style */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[fajr, dhuhr, asr, maghrib, isha]
            .filter(
              (prayer): prayer is NonNullable<typeof prayer> =>
                prayer !== undefined
            )
            .map((prayer) => (
              <PrayerTimeCard
                key={prayer.name}
                name={prayer.name}
                arabicName={prayer.arabic}
                adhanTime={prayer.start}
                iqamahTime={prayer.iqamah}
                isActive={prayer.isActive || false}
              />
            ))}

          {sunrise && (
            <div className="text-center p-6 rounded-lg bg-gray-100 text-gray-700 shadow-sm transition-all">
              <div className="mb-2">
                <h3 className="text-lg font-medium uppercase text-gray-700">
                  Shurq شروق
                </h3>
              </div>
              <div className="mb-1">
                <span className="text-3xl md:text-4xl font-bold text-theme">
                  {sunrise.sunrise}
                </span>
              </div>
              <div className="text-sm uppercase text-gray-500">Sunrise</div>
            </div>
          )}
        </div>

        {/* Jumu'ah - Theme4 Style */}
        {jummah && (
          <div className="bg-gray-100 text-gray-700 shadow-sm p-6 rounded-lg transition-all">
            <div className="text-center">
              <div className="mb-2">
                <h3 className="text-lg font-medium text-gray-700 uppercase">
                  Jumuah الجمعة
                </h3>
              </div>
              <div className="mb-1">
                <span className="text-3xl md:text-4xl font-bold text-theme">
                  {jummah.start}
                </span>
              </div>
              <div className="text-sm text-gray-500 uppercase">
                Khutbah {jummah.khutbah}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Business Ads for Prayer Tab */}
      {businessAds.length > 0 && (
        <>
          {businessAds.slice(0, 2).map((ad) => (
            <BusinessAdCard key={ad.id} ad={ad} />
          ))}
        </>
      )}

      {/* Subtle advertising CTA */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-center">
        <p className="text-sm text-gray-600 mb-2">
          Want to see your business here?&nbsp;
          <Link
            href={`https://ads.masjidaa.com`}
            className="text-theme font-medium inline-flex items-center gap-1 transition-colors"
          >
            Sign up for an account
            <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
