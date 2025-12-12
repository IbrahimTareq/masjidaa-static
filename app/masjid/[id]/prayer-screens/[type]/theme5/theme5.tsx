"use client";

import { PrayerIcon } from "@/components/client/ui/PrayerIcon";
import { useDateTimeConfig } from "@/context/dateTimeContext";
import { useMasjidContext } from "@/context/masjidContext";
import { usePrayerScreen } from "@/hooks/usePrayerScreen";
import {
  formatCurrentTime,
  formatTime,
} from "@/lib/server/formatters/dateTime";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";

export default function PrayerClient({
  formattedData,
}: {
  formattedData: FormattedData;
}) {
  const {
    dailyPrayerTimes,
    jummahPrayerTimes,
    prayerInfo,
    hijriDate,
    gregorianDate,
  } = formattedData;
  const masjid = useMasjidContext();
  const config = useDateTimeConfig();

  // Use the custom hook to manage prayer screen logic
  const { nextEvent, countdown } = usePrayerScreen(prayerInfo);

  return (
    <div className="font-sans h-screen">
      <div className="max-w-7xl 2xl:max-w-full mx-auto h-full w-full">
        <div className="bg-white text-gray-900 font-sans h-full flex flex-col shadow-2xl">
          {/* Two Column Layout */}
          <div
            className="grid grid-cols-12 h-full items-center"
            style={{
              gap: 'clamp(1.5rem, 3vw, 3rem)',
              padding: 'clamp(1.5rem, 2.5vw, 2.5rem)',
            }}
          >
            {/* Left Side - Countdown */}
            <div
              className="col-span-12 lg:col-span-5 flex flex-col justify-center items-center h-full"
              style={{
                gap: 'clamp(1.5rem, 3vh, 2rem)',
              }}
            >
              {/* Masjid Logo */}
              {masjid?.logo && (
                <div
                  style={{
                    width: 'clamp(6rem, 12vw, 12rem)',
                  }}
                >
                  <img
                    src={masjid?.logo || "/logo.png"}
                    alt="Masjid Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Date and Location */}
              <div className="text-center">
                <div
                  className="font-medium tracking-wider uppercase text-gray-800"
                  style={{
                    fontSize: 'clamp(1.125rem, 2.5vw, 1.875rem)',
                    marginBottom: 'clamp(0.25rem, 0.5vh, 0.5rem)',
                  }}
                >
                  {hijriDate}
                </div>
                <div
                  className="font-medium tracking-wider uppercase text-theme-gradient"
                  style={{
                    fontSize: 'clamp(1rem, 2.2vw, 1.5rem)',
                  }}
                >
                  {gregorianDate}
                </div>
              </div>

              {/* Countdown Timer */}
              <div
                className="flex"
                style={{
                  gap: 'clamp(0.75rem, 2vw, 2rem)',
                }}
              >
                <div className="text-center">
                  <div
                    className="bg-theme-accent border border-theme-accent rounded-lg"
                    style={{
                      padding: 'clamp(0.75rem, 1.5vw, 1rem) clamp(0.75rem, 2vw, 1.5rem)',
                    }}
                  >
                    <div
                      className="font-light text-theme-gradient"
                      style={{
                        fontSize: 'clamp(1.875rem, 6vw, 4.5rem)',
                      }}
                    >
                      {countdown.hours}
                    </div>
                  </div>
                  <div
                    className="text-theme-gradient font-semibold"
                    style={{
                      fontSize: 'clamp(0.75rem, 1.2vw, 1.125rem)',
                      marginTop: 'clamp(0.5rem, 1vh, 0.75rem)',
                    }}
                  >
                    HRS
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="bg-theme-accent border border-theme-accent rounded-lg"
                    style={{
                      padding: 'clamp(0.75rem, 1.5vw, 1rem) clamp(0.75rem, 2vw, 1.5rem)',
                    }}
                  >
                    <div
                      className="font-light text-theme-gradient"
                      style={{
                        fontSize: 'clamp(1.875rem, 6vw, 4.5rem)',
                      }}
                    >
                      {countdown.minutes}
                    </div>
                  </div>
                  <div
                    className="text-theme-gradient font-semibold"
                    style={{
                      fontSize: 'clamp(0.75rem, 1.2vw, 1.125rem)',
                      marginTop: 'clamp(0.5rem, 1vh, 0.75rem)',
                    }}
                  >
                    MIN
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="bg-theme-accent border border-theme-accent rounded-lg"
                    style={{
                      padding: 'clamp(0.75rem, 1.5vw, 1rem) clamp(0.75rem, 2vw, 1.5rem)',
                    }}
                  >
                    <div
                      className="font-light text-theme-gradient"
                      style={{
                        fontSize: 'clamp(1.875rem, 6vw, 4.5rem)',
                      }}
                    >
                      {countdown.seconds}
                    </div>
                  </div>
                  <div
                    className="text-theme-gradient font-semibold"
                    style={{
                      fontSize: 'clamp(0.75rem, 1.2vw, 1.125rem)',
                      marginTop: 'clamp(0.5rem, 1vh, 0.75rem)',
                    }}
                  >
                    SEC
                  </div>
                </div>
              </div>

              {/* Next Prayer Info */}
              <div className="text-center">
                <div
                  className="font-medium tracking-wider uppercase text-gray-800"
                  style={{
                    fontSize: 'clamp(0.875rem, 2vw, 1.875rem)',
                    marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)',
                  }}
                >
                  Until&nbsp;
                  <span className="font-bold text-theme-gradient">
                    {nextEvent.prayer}
                  </span>
                  &nbsp;{nextEvent.label}&nbsp;at&nbsp;
                  {nextEvent.time}
                </div>
                <div
                  className="font-medium tracking-wider uppercase text-theme-gradient"
                  style={{
                    fontSize: 'clamp(0.75rem, 1.8vw, 1.5rem)',
                  }}
                >
                  Current time:&nbsp;
                  {formatCurrentTime({
                    config: {
                      timeZone: config.timeZone,
                      is12Hour: config.is12Hour,
                    },
                  })}
                </div>
              </div>
            </div>

            {/* Right Side - Main Content Container */}
            <div className="col-span-12 lg:col-span-7 flex flex-col justify-center h-full">
              {/* Prayer Times Table */}
              <div className="flex flex-col">
                <div className="bg-gray-50 rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  {/* Prayer Times Header */}
                  <div
                    className="bg-gray-100 border-b border-gray-200"
                    style={{
                      padding: 'clamp(1rem, 2vh, 1.5rem) clamp(1.5rem, 3vw, 2rem)',
                    }}
                  >
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-1"></div>
                      <div className="col-span-5"></div>
                      <div className="col-span-3 text-center">
                        <div
                          className="font-bold tracking-wider uppercase text-gray-600"
                          style={{
                            fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
                          }}
                        >
                          STARTS
                        </div>
                      </div>
                      <div className="col-span-3 text-center">
                        <div
                          className="font-bold tracking-wider uppercase text-gray-600"
                          style={{
                            fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
                          }}
                        >
                          IQAMAH
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prayer Rows */}
                  <div className="divide-y divide-gray-200">
                    {dailyPrayerTimes?.map((prayer) => (
                      <div
                        key={prayer.name}
                        className={`grid grid-cols-12 gap-2 items-center transition-all ${
                          prayer.isActive ? "bg-theme text-white" : ""
                        }`}
                        style={{
                          padding: 'clamp(1rem, 2vh, 1.5rem) clamp(1.5rem, 3vw, 2rem)',
                        }}
                      >
                        {/* Prayer Icon */}
                        <div className="col-span-1 flex justify-center">
                          <div
                            style={{
                              width: 'clamp(2rem, 3vw, 2.25rem)',
                              height: 'clamp(2rem, 3vw, 2.25rem)',
                            }}
                          >
                            <PrayerIcon
                              type={prayer.icon}
                              className={`w-full h-full ${
                                prayer.isActive ? "text-white" : "text-gray-600"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Prayer Name */}
                        <div className="col-span-5">
                          <div
                            className="font-medium tracking-wider uppercase"
                            style={{
                              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
                            }}
                          >
                            {prayer.name}
                          </div>
                        </div>

                        {/* Athan Time */}
                        <div className="col-span-3 text-center">
                          <div
                            className="font-light"
                            style={{
                              fontSize: 'clamp(1.125rem, 2.5vw, 1.875rem)',
                            }}
                          >
                            {prayer.start}
                          </div>
                        </div>

                        {/* Iqamah Time */}
                        <div className="col-span-3 text-center">
                          <div
                            className="font-semibold"
                            style={{
                              fontSize: 'clamp(1.125rem, 2.5vw, 1.875rem)',
                            }}
                          >
                            {prayer.iqamah}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Jummah Section */}
                    {jummahPrayerTimes && jummahPrayerTimes.length > 0 && (
                      <>
                        {/* Jummah Header */}
                        <div
                          className="bg-gray-100"
                          style={{
                            padding: 'clamp(1rem, 2vh, 1.5rem) clamp(1.5rem, 3vw, 2rem)',
                          }}
                        >
                          <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-1"></div>
                            <div className="col-span-5"></div>
                            <div className="col-span-3 text-center">
                              <div
                                className="font-bold tracking-wider uppercase text-gray-600"
                                style={{
                                  fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
                                }}
                              >
                                Starts
                              </div>
                            </div>
                            <div className="col-span-3 text-center">
                              <div
                                className="font-bold tracking-wider uppercase text-gray-600"
                                style={{
                                  fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
                                }}
                              >
                                Khutbah
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Jummah Rows */}
                        {jummahPrayerTimes.map((session, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-2 items-center"
                            style={{
                              padding: 'clamp(1rem, 2vh, 1.5rem) clamp(1.5rem, 3vw, 2rem)',
                            }}
                          >
                            <div className="col-span-1 flex justify-center">
                              <div
                                style={{
                                  width: 'clamp(2rem, 3vw, 2.25rem)',
                                  height: 'clamp(2rem, 3vw, 2.25rem)',
                                }}
                              >
                                <PrayerIcon
                                  type="calendar"
                                  className="w-full h-full text-gray-600"
                                />
                              </div>
                            </div>

                            <div className="col-span-5">
                              <div
                                className="font-medium tracking-wider uppercase"
                                style={{
                                  fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
                                }}
                              >
                                {jummahPrayerTimes.length === 1
                                  ? "Jumaah"
                                  : `Jumaah ${index + 1}`}
                              </div>
                            </div>

                            <div className="col-span-3 text-center">
                              <div
                                className="font-light"
                                style={{
                                  fontSize: 'clamp(1.125rem, 2.5vw, 1.875rem)',
                                }}
                              >
                                {session.start}
                              </div>
                            </div>

                            <div className="col-span-3 text-center">
                              <div
                                className="font-semibold"
                                style={{
                                  fontSize: 'clamp(1.125rem, 2.5vw, 1.875rem)',
                                }}
                              >
                                {session.khutbah}
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
