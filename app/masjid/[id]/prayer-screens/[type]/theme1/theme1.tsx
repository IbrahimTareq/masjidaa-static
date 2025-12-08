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
  const { dailyPrayerTimes, shurq, jummahPrayerTimes, prayerInfo } =
    formattedData;
  const masjid = useMasjidContext();
  const config = useDateTimeConfig();

  // Use the custom hook to manage prayer screen logic
  const { nextEvent, countdown } = usePrayerScreen(prayerInfo);

  return (
    <LayoutWithHeader headerTitle={masjid?.name || "Masjid"}>
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
              padding: 'clamp(1rem, 2vw, 2rem)',
              paddingBottom: 'clamp(1rem, 1.5vw, 2.5rem)',
              paddingTop: 'clamp(0.5rem, 1vh, 1rem)',
            }}
          >
            {/* Clock Section */}
            <section
              className="text-center"
              style={{
                marginBottom: 'clamp(1.5rem, 2vh, 2.5rem)',
              }}
            >
              {/* Main Clock */}
              <div
                className="flex items-baseline justify-center"
                style={{
                  gap: 'clamp(0.5rem, 1vw, 1rem)',
                  marginBottom: 'clamp(0.75rem, 1vh, 1rem)',
                }}
              >
                <span
                  className="font-medium text-black tabular-nums leading-none"
                  style={{
                    fontSize: 'clamp(3.5rem, 8vw, 10rem)',
                  }}
                >
                  {formatCurrentTime({
                    config: {
                      timeZone: config.timeZone,
                      is12Hour: config.is12Hour,
                    },
                  })}
                </span>
              </div>

              {/* Next Prayer Info */}
              <div
                style={{
                  marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)',
                }}
              >
                <div
                  className="text-gray-400 font-medium uppercase tracking-wider"
                  style={{
                    fontSize: 'clamp(0.875rem, 1.2vw, 1.5rem)',
                    marginBottom: 'clamp(0.5rem, 0.8vh, 0.75rem)',
                  }}
                >
                  {nextEvent.prayer} {nextEvent.label} in
                </div>
                <div
                  className="font-semibold text-black"
                  style={{
                    fontSize: 'clamp(1.875rem, 4vw, 4rem)',
                  }}
                >
                  {countdown.hours !== "00" && (
                    <>
                      {countdown.hours}
                      <span
                        className="font-normal text-gray-600"
                        style={{
                          fontSize: 'clamp(1rem, 1.4vw, 1.5rem)',
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
                          fontSize: 'clamp(1rem, 1.4vw, 1.5rem)',
                        }}
                      >
                        MINS
                      </span>
                      &nbsp;
                    </>
                  )}
                  {countdown.seconds}
                  <span
                    className="font-normal text-gray-600"
                    style={{
                      fontSize: 'clamp(1rem, 1.4vw, 1.5rem)',
                    }}
                  >
                    SEC
                  </span>
                </div>
              </div>
            </section>

            {/* Content Cards Section */}
            <section
              className="grid grid-cols-1 lg:grid-cols-5 mt-auto flex-shrink-0"
              style={{
                gap: 'clamp(0.75rem, 1vw, 1rem)',
                marginBottom: 'clamp(1rem, 1.5vh, 1.5rem)',
              }}
            >
              {/* Jumaah Card */}
              {jummahPrayerTimes && jummahPrayerTimes.length > 0 && (
                <div
                  className="bg-gray-50 border border-gray-200 order-2 lg:order-1 lg:col-span-1 flex flex-col"
                  style={{
                    borderRadius: 'clamp(0.75rem, 1vw, 1rem)',
                    padding: 'clamp(1rem, 1.5vw, 1.5rem)',
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
                              gap: 'clamp(1.5rem, 3vh, 2.5rem)',
                            }}
                          >
                            <div className="text-center">
                              <h2
                                className="font-bold"
                                style={{
                                  fontSize: 'clamp(0.875rem, 1.2vw, 1.5rem)',
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
                                    fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
                                  }}
                                >
                                  Starts
                                </div>
                                <div
                                  className="font-semibold"
                                  style={{
                                    fontSize: 'clamp(1.125rem, 1.6vw, 1.875rem)',
                                  }}
                                >
                                  {session.start}
                                </div>
                              </div>
                              <div>
                                <div
                                  className="font-medium uppercase tracking-wider opacity-70"
                                  style={{
                                    fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
                                  }}
                                >
                                  Khutbah
                                </div>
                                <div
                                  className="font-semibold"
                                  style={{
                                    fontSize: 'clamp(1.125rem, 1.6vw, 1.875rem)',
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
              <div className="flex flex-col items-center justify-center text-center order-1 lg:order-2 lg:col-span-1 lg:col-start-5">
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
                          marginBottom: 'clamp(0.75rem, 1vh, 1rem)',
                        }}
                      >
                        <h3
                          className="font-bold"
                          style={{
                            fontSize: 'clamp(0.875rem, 1.2vw, 1.5rem)',
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
                              fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
                            }}
                          >
                            Sunrise
                          </div>
                          <div
                            className="font-semibold"
                            style={{
                              fontSize: 'clamp(1.125rem, 1.6vw, 1.875rem)',
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
                              fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
                            }}
                          >
                            Duha
                          </div>
                          <div
                            className="font-semibold"
                            style={{
                              fontSize: 'clamp(1.125rem, 1.6vw, 1.875rem)',
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
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mt-auto"
              style={{
                gap: 'clamp(0.75rem, 1vw, 1rem)',
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
                    borderRadius: 'clamp(0.75rem, 1vw, 1rem)',
                    padding: 'clamp(0.75rem, 1.2vw, 1rem)',
                    marginBottom: 'clamp(0.5rem, 0.8vh, 0.75rem)',
                  }}
                >
                  <h3
                    className="font-bold"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.2vw, 1.5rem)',
                      marginBottom: 'clamp(0.5rem, 0.8vh, 0.75rem)',
                    }}
                  >
                    {prayer.name}&nbsp;
                    <span className="font-serif">{prayer.arabic}</span>
                  </h3>
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
                          fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
                        }}
                      >
                        Starts
                      </div>
                      <div
                        className="font-semibold"
                        style={{
                          fontSize: 'clamp(1.125rem, 1.6vw, 1.875rem)',
                        }}
                      >
                        {prayer.start}
                      </div>
                    </div>
                    <div>
                      <div
                        className="font-medium uppercase tracking-wider opacity-70"
                        style={{
                          fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
                        }}
                      >
                        Iqamah
                      </div>
                      <div
                        className="font-semibold"
                        style={{
                          fontSize: 'clamp(1.125rem, 1.6vw, 1.875rem)',
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