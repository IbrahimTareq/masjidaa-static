import PrayerLayout from "@/components/LayoutWithHeader";

export default function PostAdhanDua() {
  return (
    <PrayerLayout headerTitle="Supplication After Adhan">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl space-y-8 lg:space-y-12">
          <div className="space-y-4">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-serif leading-normal text-gray-800">
              اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلاَةِ
              الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ
              وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ
            </p>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-500">
              Allahumma Rabba hadhihi-d-da'wat it-tammah was-salat il-qa'imah,
              ati Muhammadan il-wasilata wal-fadilah, wab'athhu maqaman
              mahmudan-il-ladhi wa'adtah
            </p>
            <p className="text-base sm:text-lg lg:text-2xl text-gray-500">
              "O Allah, Lord of this perfect call and established prayer, grant
              Muhammad the intercession and favor, and raise him to the honored
              station You have promised him"
            </p>
          </div>

          <div className="border-t border-gray-300 flex-shrink-0"></div>

          <div className="space-y-4">
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-800">
              The Prophet ﷺ said: "Whoever says this dua after hearing the
              adhan, my intercession will be permissible for him on the Day of
              Judgment"
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-gray-500 italic">
              (Sahih al-Bukhari 614)
            </p>
          </div>
        </div>
      </main>
    </PrayerLayout>
  );
}
