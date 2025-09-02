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
    {
      number: 4,
      text: 'If you say to your companion when the Imam is preaching on Friday, "Be quiet and listen," you have engaged in idle talk.',
      source: "Sahih Bukhari",
    },
    {
      number: 5,
      text: "When Friday comes, the angels sit at the doors of the mosque and record who comes to the Jumu'ah prayer. Then, when the imam comes out, the angels close their records.",
      source: "Sahih Bukhari",
    },
  ];

  return (
    <PrayerLayout headerTitle="Jummah Sunnan">
      <main className="px-4 py-6">
        {/* Title Section */}
        <div className="text-center mb-8">
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-600">
            Prophet Muhammad ﷺ said:
          </p>
        </div>

        {/* Hadiths Grid */}
        <div className="w-full mx-auto space-y-2">
          {sunnahPoints.map((point) => (
            <div key={point.number} className="flex gap-4 p-4">
              {/* Number Circle */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-theme text-white rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl">
                  {point.number}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm sm:text-base lg:text-xl text-gray-700 font-medium leading-relaxed mb-2">
                  "{point.text}"&nbsp;
                  <span className="text-md text-gray-500 italic">
                    - {point.source}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </PrayerLayout>
  );
}
