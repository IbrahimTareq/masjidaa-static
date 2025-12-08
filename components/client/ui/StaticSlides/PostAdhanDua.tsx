import PrayerLayout from "@/components/LayoutWithHeader";

export default function PostAdhanDua() {
  return (
    <PrayerLayout headerTitle="Supplication After Adhan">
      {/* Main Content */}
      <div className="w-full overflow-x-hidden bg-white h-full flex items-center justify-center">
        <div
          className="w-full mx-auto px-[2vw] py-[3vh] text-center"
          style={{
            maxWidth: 'clamp(800px, 88vw, 1200px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(2rem, 3vh, 4rem)',
              alignItems: 'center',
            }}
          >
            {/* Dua Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(1.25rem, 2.5vh, 2.5rem)',
                maxWidth: '100%',
              }}
            >
              {/* Arabic Text */}
              <p
                className="font-serif leading-relaxed text-gray-800 break-words"
                style={{
                  fontSize: 'clamp(1.5rem, 3.2vw, 4.5rem)',
                  lineHeight: '1.4',
                  fontFamily: '"Amiri", "Times New Roman", serif',
                  textAlign: 'center',
                }}
              >
                اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلاَةِ
                الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ
                وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ
              </p>

              {/* Translation */}
              <p
                className="text-gray-600 leading-relaxed break-words"
                style={{
                  fontSize: 'clamp(1.125rem, 1.8vw, 2.5rem)',
                  lineHeight: '1.4',
                  textAlign: 'center',
                }}
              >
                "O Allah, Lord of this perfect call and established prayer, grant
                Muhammad the intercession and favor, and raise him to the honored
                station You have promised him"
              </p>
            </div>

            {/* Divider */}
            <div
              className="border-t border-gray-300"
              style={{
                width: 'clamp(100px, 30vw, 200px)',
              }}
            />

            {/* Hadith Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.5rem, 0.75vh, 1rem)',
                maxWidth: '100%',
              }}
            >
              {/* Hadith Text */}
              <p
                className="text-gray-800 leading-relaxed break-words"
                style={{
                  fontSize: 'clamp(1.125rem, 1.7vw, 2.125rem)',
                  lineHeight: '1.4',
                  textAlign: 'center',
                }}
              >
                The Prophet ﷺ said: "Whoever says this dua after hearing the
                adhan, my intercession will be permissible for him on the Day of
                Judgment"
              </p>

              {/* Reference */}
              <p
                className="text-gray-500 italic break-words"
                style={{
                  fontSize: 'clamp(1rem, 1.4vw, 1.75rem)',
                  textAlign: 'center',
                }}
              >
                (Sahih al-Bukhari 614)
              </p>
            </div>
          </div>
        </div>
      </div>
    </PrayerLayout>
  );
}
