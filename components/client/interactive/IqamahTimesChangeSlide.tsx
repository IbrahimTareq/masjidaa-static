import PrayerLayout from "@/components/LayoutWithHeader";
import { useMasjid } from "@/context/masjidContext";
import type { Tables } from "@/database.types";
import { formatDateToReadable, formatTimeTo12Hour } from "@/utils/time";

type IqamahTimesChangeProps = {
  iqamahTimeChange: Tables<"masjid_iqamah_times">;
};

export default function IqamahTimesChange({
  iqamahTimeChange,
}: IqamahTimesChangeProps) {
  const masjid = useMasjid();

  if (!iqamahTimeChange) {
    return <div>No iqamah time changes</div>;
  }

  // Format the effective date
  const effectiveDate = new Date(iqamahTimeChange.effective_from);
  const formattedDate = formatDateToReadable(effectiveDate.toISOString());

  return (
    <PrayerLayout headerTitle="Iqamah Time Changes">
      <div className="w-full overflow-x-hidden bg-white h-full flex items-center justify-center">
        <div
          className="w-full mx-auto px-[2vw] py-[1.5vh]"
          style={{
            maxWidth: 'clamp(800px, 95vw, 1600px)',
          }}
        >
          {/* Compact Title */}
          <div className="text-center mb-[2vh]">
            <h1
              className="font-bold text-gray-900 leading-tight break-words"
              style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 2.75rem)',
                marginBottom: 'clamp(0.5rem, 0.75vh, 0.75rem)',
              }}
            >
            Effective from {formattedDate}
            </h1>
          </div>

          {/* Two-Column Prayer Times Grid */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2"
            style={{
              gap: 'clamp(1rem, 2vw, 2rem)',
              maxWidth: 'clamp(500px, 70vw, 900px)',
              margin: '0 auto',
            }}
          >
            {/* Left Column */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.5rem, 0.75vh, 0.75rem)',
              }}
            >
              {iqamahTimeChange.fajr && (
                <div
                  className="bg-gray-50 rounded-lg flex items-center"
                  style={{
                    padding: 'clamp(0.5rem, 0.75vw, 1rem)',
                    minHeight: 'clamp(2.5rem, 4vw, 3.5rem)',
                    gap: 'clamp(1rem, 2vw, 2rem)',
                  }}
                >
                  <h3
                    className="font-bold text-gray-800"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.4vw, 1.5rem)',
                    }}
                  >
                    FAJR
                  </h3>
                  <p
                    className="text-theme font-bold ml-auto"
                    style={{
                      fontSize: 'clamp(1rem, 1.6vw, 1.75rem)',
                    }}
                  >
                    {formatTimeTo12Hour(iqamahTimeChange.fajr)}
                  </p>
                </div>
              )}

              {iqamahTimeChange.asr && (
                <div
                  className="bg-gray-50 rounded-lg flex items-center"
                  style={{
                    padding: 'clamp(0.5rem, 0.75vw, 1rem)',
                    minHeight: 'clamp(2.5rem, 4vw, 3.5rem)',
                    gap: 'clamp(1rem, 2vw, 2rem)',
                  }}
                >
                  <h3
                    className="font-bold text-gray-800"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.4vw, 1.5rem)',
                    }}
                  >
                    ASR
                  </h3>
                  <p
                    className="text-theme font-bold ml-auto"
                    style={{
                      fontSize: 'clamp(1rem, 1.6vw, 1.75rem)',
                    }}
                  >
                    {formatTimeTo12Hour(iqamahTimeChange.asr)}
                  </p>
                </div>
              )}

              {iqamahTimeChange.isha && (
                <div
                  className="bg-gray-50 rounded-lg flex items-center"
                  style={{
                    padding: 'clamp(0.5rem, 0.75vw, 1rem)',
                    minHeight: 'clamp(2.5rem, 4vw, 3.5rem)',
                    gap: 'clamp(1rem, 2vw, 2rem)',
                  }}
                >
                  <h3
                    className="font-bold text-gray-800"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.4vw, 1.5rem)',
                    }}
                  >
                    ISHA
                  </h3>
                  <p
                    className="text-theme font-bold ml-auto"
                    style={{
                      fontSize: 'clamp(1rem, 1.6vw, 1.75rem)',
                    }}
                  >
                    {formatTimeTo12Hour(iqamahTimeChange.isha)}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.5rem, 0.75vh, 0.75rem)',
              }}
            >
              {iqamahTimeChange.dhuhr && (
                <div
                  className="bg-gray-50 rounded-lg flex items-center"
                  style={{
                    padding: 'clamp(0.5rem, 0.75vw, 1rem)',
                    minHeight: 'clamp(2.5rem, 4vw, 3.5rem)',
                    gap: 'clamp(1rem, 2vw, 2rem)',
                  }}
                >
                  <h3
                    className="font-bold text-gray-800"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.4vw, 1.5rem)',
                    }}
                  >
                    DHUHR
                  </h3>
                  <p
                    className="text-theme font-bold ml-auto"
                    style={{
                      fontSize: 'clamp(1rem, 1.6vw, 1.75rem)',
                    }}
                  >
                    {formatTimeTo12Hour(iqamahTimeChange.dhuhr)}
                  </p>
                </div>
              )}

              {iqamahTimeChange.maghrib && (
                <div
                  className="bg-gray-50 rounded-lg flex items-center"
                  style={{
                    padding: 'clamp(0.5rem, 0.75vw, 1rem)',
                    minHeight: 'clamp(2.5rem, 4vw, 3.5rem)',
                    gap: 'clamp(1rem, 2vw, 2rem)',
                  }}
                >
                  <h3
                    className="font-bold text-gray-800"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.4vw, 1.5rem)',
                    }}
                  >
                    MAGHRIB
                  </h3>
                  <p
                    className="text-theme font-bold ml-auto"
                    style={{
                      fontSize: 'clamp(1rem, 1.6vw, 1.75rem)',
                    }}
                  >
                    {formatTimeTo12Hour(iqamahTimeChange.maghrib)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PrayerLayout>
  );
}
