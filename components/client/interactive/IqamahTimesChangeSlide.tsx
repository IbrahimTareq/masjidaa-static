import PrayerLayout from "@/components/LayoutWithHeader";
import { useMasjidContext } from "@/context/masjidContext";
import type { Tables } from "@/database.types";
import { formatDateToReadable, formatTimeTo12Hour } from "@/utils/time";

type IqamahTimesChangeProps = {
  iqamahTimeChange: Tables<"masjid_iqamah_times">;
};

export default function IqamahTimesChange({
  iqamahTimeChange,
}: IqamahTimesChangeProps) {
  const masjid = useMasjidContext();

  if (!masjid || !iqamahTimeChange) {
    return <div>Masjid not found or no iqamah time changes</div>;
  }

  // Format the effective date
  const effectiveDate = new Date(iqamahTimeChange.effective_from);
  const formattedDate = formatDateToReadable(effectiveDate.toISOString());

  return (
    <PrayerLayout headerTitle="Iqamah Time Changes">
      <section className="text-black relative flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl px-8 z-10 bg-white/90 rounded-lg mx-4 pt-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-medium text-gray-700 mb-10">
              Iqamah Time Changes Effective from
              <br />
              <span className="font-bold">{formattedDate}</span>
            </h2>
            <div className="w-full flex items-center justify-center mb-4">
              <div className="h-px bg-gray-300 w-20 mx-2"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="h-px bg-gray-300 w-20 mx-2"></div>
            </div>
          </div>

          <div className="max-w-lg mx-auto mt-10">
            {iqamahTimeChange.fajr && (
              <div className="flex justify-between items-center border-b border-gray-200 py-4">
                <h3 className="text-4xl font-bold text-gray-800">FAJR</h3>
                <p className="text-4xl text-gray-700">
                  {formatTimeTo12Hour(iqamahTimeChange.fajr)}
                </p>
              </div>
            )}

            {iqamahTimeChange.dhuhr && (
              <div className="flex justify-between items-center border-b border-gray-200 py-4">
                <h3 className="text-4xl font-bold text-gray-800">DHUHR</h3>
                <p className="text-4xl text-gray-700">
                  {formatTimeTo12Hour(iqamahTimeChange.dhuhr)}
                </p>
              </div>
            )}

            {iqamahTimeChange.asr && (
              <div className="flex justify-between items-center border-b border-gray-200 py-4">
                <h3 className="text-4xl font-bold text-gray-800">ASR</h3>
                <p className="text-4xl text-gray-700">
                  {formatTimeTo12Hour(iqamahTimeChange.asr)}
                </p>
              </div>
            )}

            {iqamahTimeChange.maghrib && (
              <div className="flex justify-between items-center border-b border-gray-200 py-4">
                <h3 className="text-4xl font-bold text-gray-800">MAGHRIB</h3>
                <p className="text-4xl text-gray-700">
                  {formatTimeTo12Hour(iqamahTimeChange.maghrib)}
                </p>
              </div>
            )}

            {iqamahTimeChange.isha && (
              <div className="flex justify-between items-center py-4">
                <h3 className="text-4xl font-bold text-gray-800">ISHA</h3>
                <p className="text-4xl text-gray-700">
                  {formatTimeTo12Hour(iqamahTimeChange.isha)}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </PrayerLayout>
  );
}
