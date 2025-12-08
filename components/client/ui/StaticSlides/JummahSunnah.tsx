import PrayerLayout from "@/components/LayoutWithHeader";

export default function JummahSunnah() {
  const sunnahPoints = [
    {
      number: 1,
      text: "Whoever reads Surah Al-Kahf on Friday, he will be illuminated with light between the two Fridays.",
      source: "Sahih Al-Albani",
    },
    {
      number: 2,
      text: "Among the best of your days is Friday. So, pray to Allah frequently on it to bless me, for such supplications of you will be presented to me.",
      source: "Abu Dawud",
    },
    {
      number: 3,
      text: "The taking of bath on Friday is compulsory for every Muslim who has attained the age of puberty and also cleaning of teeth with Siwak and using perfume, if available.",
      source: "Sahih Bukhari",
    },
  ];

  return (
    <PrayerLayout headerTitle="Jummah Sunnan">
      <div className="w-full overflow-x-hidden bg-white h-full flex items-center justify-center">
        <div
          className="w-full mx-auto px-[2vw] py-[1.5vh]"
          style={{
            maxWidth: 'clamp(800px, 95vw, 1600px)',
          }}
        >
          {/* Title Section */}
          <div className="text-center mb-[1.5vh]">
            <p
              className="font-bold text-gray-600"
              style={{
                fontSize: 'clamp(1.125rem, 2vw, 2.5rem)',
              }}
            >
              Prophet Muhammad ﷺ said:
            </p>
          </div>

          {/* Hadiths List */}
          <div
            className="w-full mx-auto"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(1rem, 1.5vh, 1.75rem)',
            }}
          >
            {sunnahPoints.map((point) => (
              <div
                key={point.number}
                className="flex gap-[1.2vw] items-start"
                style={{
                  padding: 'clamp(0.5rem, 1vw, 1.25rem)',
                }}
              >
                {/* Number Circle */}
                <div className="flex-shrink-0">
                  <div
                    className="bg-theme text-white rounded-full flex items-center justify-center font-bold"
                    style={{
                      width: 'clamp(2rem, 3vw, 3.5rem)',
                      height: 'clamp(2rem, 3vw, 3.5rem)',
                      fontSize: 'clamp(1rem, 1.5vw, 1.875rem)',
                    }}
                  >
                    {point.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-gray-700 font-medium break-words"
                    style={{
                      fontSize: 'clamp(1rem, 1.6vw, 2rem)',
                      lineHeight: '1.2',
                    }}
                  >
                    "{point.text}"
                    <span
                      className="text-gray-500 italic block mt-[0.25vh]"
                      style={{
                        fontSize: 'clamp(0.875rem, 1.3vw, 1.625rem)',
                      }}
                    >
                      - {point.source}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PrayerLayout>
  );
}
