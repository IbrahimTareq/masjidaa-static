"use client";

import LayoutWithHeader from "@/components/LayoutWithHeader";
import { useDateTimeConfig } from "@/context/dateTimeContext";
import { useMasjidContext } from "@/context/masjidContext";
import { usePrayerScreen } from "@/hooks/usePrayerScreen";
import { formatCurrentTime } from "@/lib/server/formatters/dateTime";
import { FormattedData } from "@/lib/server/domain/prayer/getServerPrayerData";

import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function PrayerClient({
  formattedData,
}: {
  formattedData: FormattedData;
}) {
  const { dailyPrayerTimes, shurq, jummahPrayerTimes, prayerInfo, hijriDate, gregorianDate } =
    formattedData;
  const masjid = useMasjidContext();
  const config = useDateTimeConfig();

  // Use the custom hook to manage prayer screen logic
  const { nextEvent, countdown } = usePrayerScreen(prayerInfo);

  return (
    <LayoutWithHeader
      headerTitle={masjid?.name || "Masjid"}
      dates={{
        hijri: hijriDate,
        gregorian: gregorianDate,
      }}
    >
      <div className="h-full flex flex-col">
        {/* Container with rounded background */}
        <div
          className="bg-white flex-1 flex flex-col overflow-hidden"
          style={{
            borderRadius: 'clamp(1rem, 2vw, 2rem)',
          }}
        >
          {/* Main Content Area */}
          <main
            className="flex-1 flex flex-col min-h-0"
            style={{
              padding: 'clamp(0.75rem, 1.5vw, 2rem)',
              paddingBottom: 'clamp(0.75rem, 1.2vw, 2.5rem)',
              paddingTop: 'clamp(0.5rem, 0.8vh, 1rem)',
            }}
          >
            {/* Time Header - Clean 2-column layout */}
            <header className="mb-4 md:mb-6">
              <div className="bg-white rounded-2xl overflow-hidden">
                <div
                  className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200"
                  style={{
                    minHeight: 'clamp(140px, 18vh, 250px)',
                  }}
                >
                  {/* Current Time Section */}
                  <div className="flex flex-col justify-center text-center p-4 md:p-6">
                    <div
                      className="text-gray-500 font-medium uppercase tracking-wide mb-1"
                      style={{
                        fontSize: 'clamp(0.875rem, 1.4vw, 1.75rem)',
                      }}
                    >
                      Current Time
                    </div>
                    <div
                      className="font-bold text-gray-900 tabular-nums"
                      style={{
                        fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                        lineHeight: '1.1',
                      }}
                    >
                      {formatCurrentTime({
                        config: {
                          timeZone: config.timeZone,
                          is12Hour: config.is12Hour,
                        },
                      })}
                    </div>
                  </div>

                  {/* Next Prayer Section */}
                  <div className="flex flex-col justify-center text-center p-4 md:p-6">
                    <div
                      className="text-gray-500 font-medium uppercase tracking-wide mb-1"
                      style={{
                        fontSize: 'clamp(0.875rem, 1.4vw, 1.75rem)',
                      }}
                    >
                      <span className="text-theme font-bold">{nextEvent.prayer}</span> {nextEvent.label} in
                    </div>
                    <div
                      className="font-bold text-gray-900 tabular-nums"
                      style={{
                        fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                        lineHeight: '1.1',
                      }}
                    >
                      {countdown.hours !== "00" && (
                        <>
                          {countdown.hours}
                          <span
                            className="font-normal text-gray-600"
                            style={{
                              fontSize: 'clamp(1rem, 1.5vw, 1.6rem)',
                            }}
                          >
                            HR
                          </span>
                          &nbsp;
                        </>
                      )}
                      {countdown.minutes !== "00" && (
                        <>
                          {countdown.minutes}
                          <span
                            className="font-normal text-gray-600"
                            style={{
                              fontSize: 'clamp(1rem, 1.5vw, 1.6rem)',
                            }}
                          >
                            MIN
                          </span>
                          &nbsp;
                        </>
                      )}
                      {countdown.seconds}
                      <span
                        className="font-normal text-gray-600"
                        style={{
                          fontSize: 'clamp(1rem, 1.5vw, 1.6rem)',
                        }}
                      >
                        SEC
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Content Cards Section */}
            <section
              className="grid grid-cols-1 md:grid-cols-5 mt-auto flex-shrink-0"
              style={{
                gap: 'clamp(0.5rem, 0.8vw, 1rem)',
                marginBottom: 'clamp(0.5rem, 1vh, 1.5rem)',
              }}
            >
              {/* Jumaah Card */}
              {jummahPrayerTimes && jummahPrayerTimes.length > 0 && (
                <div
                  className="bg-gray-50 border border-gray-200 order-2 md:order-1 md:col-span-1 flex flex-col"
                  style={{
                    borderRadius: 'clamp(0.5rem, 0.8vw, 1rem)',
                    padding: 'clamp(0.75rem, 1.2vw, 1.5rem)',
                  }}
                >
                  <div className="flex-1">
                    <Swiper
                      spaceBetween={30}
                      centeredSlides={true}
                      autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                      }}
                      navigation={false}
                      modules={[Autoplay]}
                      className="mySwiper"
                    >
                      {jummahPrayerTimes?.map((session, index) => (
                        <SwiperSlide key={index}>
                          <div
                            className="flex flex-col justify-between"
                            style={{
                              gap: 'clamp(0.75rem, 2vh, 2.5rem)',
                            }}
                          >
                            <div className="text-center">
                              <h2
                                className="font-bold"
                                style={{
                                  fontSize: 'clamp(0.75rem, 1vw, 1.5rem)',
                                }}
                              >
                                {jummahPrayerTimes.length > 1
                                  ? `Jumaah Session ${index + 1} `
                                  : "Jumaah جمعة"}
                              </h2>
                            </div>
                            <div
                              className="grid grid-cols-2 text-center"
                              style={{
                                gap: 'clamp(0.5rem, 0.8vw, 0.75rem)',
                              }}
                            >
                              <div>
                                <div
                                  className="font-medium uppercase tracking-wider opacity-70"
                                  style={{
                                    fontSize: 'clamp(0.625rem, 0.8vw, 0.875rem)',
                                  }}
                                >
                                  Starts
                                </div>
                                <div
                                  className="font-semibold"
                                  style={{
                                    fontSize: 'clamp(1rem, 1.4vw, 1.875rem)',
                                  }}
                                >
                                  {session.start}
                                </div>
                              </div>
                              <div>
                                <div
                                  className="font-medium uppercase tracking-wider opacity-70"
                                  style={{
                                    fontSize: 'clamp(0.625rem, 0.8vw, 0.875rem)',
                                  }}
                                >
                                  Khutbah
                                </div>
                                <div
                                  className="font-semibold"
                                  style={{
                                    fontSize: 'clamp(1rem, 1.4vw, 1.875rem)',
                                  }}
                                >
                                  {session.khutbah}
                                </div>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              )}

              {/* Sunrise/Duha Card */}
              <div className="flex flex-col items-center justify-center text-center order-1 md:order-2 md:col-span-1 md:col-start-5">
                <div className="w-full h-full">
                  <div
                    className="text-center transition-all bg-gray-50 border border-gray-200 text-gray-900 h-full"
                    style={{
                      borderRadius: 'clamp(0.5rem, 0.8vw, 0.75rem)',
                      padding: 'clamp(0.75rem, 1.2vw, 1rem)',
                    }}
                  >
                    <div className="h-full flex flex-col">
                      <div
                        style={{
                          marginBottom: 'clamp(0.5rem, 0.8vh, 1rem)',
                        }}
                      >
                        <h3
                          className="font-bold"
                          style={{
                            fontSize: 'clamp(0.75rem, 1vw, 1.5rem)',
                          }}
                        >
                          Shurq شروق
                        </h3>
                      </div>

                      <div
                        className="mt-auto grid grid-cols-2"
                        style={{
                          gap: 'clamp(0.5rem, 0.8vw, 0.75rem)',
                        }}
                      >
                        {/* Sunrise Time */}
                        <div>
                          <div
                            className="font-medium uppercase tracking-wider opacity-70"
                            style={{
                              fontSize: 'clamp(0.625rem, 0.8vw, 0.875rem)',
                            }}
                          >
                            Sunrise
                          </div>
                          <div
                            className="font-semibold"
                            style={{
                              fontSize: 'clamp(1rem, 1.4vw, 1.875rem)',
                            }}
                          >
                            {shurq?.sunrise || "--:--"}
                          </div>
                        </div>

                        {/* Duha Time */}
                        <div>
                          <div
                            className="font-medium uppercase tracking-wider opacity-70"
                            style={{
                              fontSize: 'clamp(0.625rem, 0.8vw, 0.875rem)',
                            }}
                          >
                            Duha
                          </div>
                          <div
                            className="font-semibold"
                            style={{
                              fontSize: 'clamp(1rem, 1.4vw, 1.875rem)',
                            }}
                          >
                            {shurq?.duha || "--:--"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Prayer Cards Grid */}
            <section
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mt-auto"
              style={{
                gap: 'clamp(0.5rem, 0.8vw, 1rem)',
              }}
            >
              {dailyPrayerTimes?.map((prayer, index) => (
                <div
                  key={index}
                  className={`
                    text-center transition-all duration-200
                    ${
                      prayer?.isActive
                        ? "bg-theme text-white"
                        : "bg-gray-200 text-gray-800"
                    }
                  `}
                  style={{
                    borderRadius: 'clamp(0.5rem, 0.8vw, 1rem)',
                    padding: 'clamp(0.5rem, 1vw, 1rem)',
                    marginBottom: 0,
                  }}
                >
                  <h3
                    className="font-bold"
                    style={{
                      fontSize: 'clamp(0.75rem, 1vw, 1.5rem)',
                      marginBottom: 'clamp(0.375rem, 0.6vh, 0.75rem)',
                    }}
                  >
                    {prayer.name}&nbsp;
                    <span className="font-serif">{prayer.arabic}</span>
                  </h3>
                  <div
                    className="grid grid-cols-2 text-center"
                    style={{
                      gap: 'clamp(0.375rem, 0.6vw, 0.75rem)',
                    }}
                  >
                    <div>
                      <div
                        className="font-medium uppercase tracking-wider opacity-70"
                        style={{
                          fontSize: 'clamp(0.625rem, 0.8vw, 0.875rem)',
                        }}
                      >
                        Starts
                      </div>
                      <div
                        className="font-semibold"
                        style={{
                          fontSize: 'clamp(1rem, 1.4vw, 1.875rem)',
                        }}
                      >
                        {prayer.start}
                      </div>
                    </div>
                    <div>
                      <div
                        className="font-medium uppercase tracking-wider opacity-70"
                        style={{
                          fontSize: 'clamp(0.625rem, 0.8vw, 0.875rem)',
                        }}
                      >
                        Iqamah
                      </div>
                      <div
                        className="font-semibold"
                        style={{
                          fontSize: 'clamp(1rem, 1.4vw, 1.875rem)',
                        }}
                      >
                        {prayer.iqamah}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </main>
        </div>
      </div>
    </LayoutWithHeader>
  );
}