import PrayerLayout from "@/components/LayoutWithHeader";

export default function PostPrayerDuas() {
  return (
    <PrayerLayout headerTitle="Supplication After Prayer">
      <div className="w-full overflow-x-hidden bg-white h-full flex items-center justify-center">
        <div
          className="w-full mx-auto px-[2vw] py-[1.5vh]"
          style={{
            maxWidth: 'clamp(800px, 95vw, 1600px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(1rem, 1.5vh, 1.75rem)',
            }}
          >
            {/* Astaghfirullah */}
            <div className="border-b border-gray-100 pb-[1vh]">
              <div className="flex gap-[2vw]">
                <div className="flex-[1.5]">
                  <p
                    className="text-gray-800 font-medium break-words"
                    style={{
                      fontSize: 'clamp(1rem, 1.6vw, 2rem)',
                      lineHeight: '1.2',
                    }}
                  >
                    Astaghfirullaaha, Astaghfirullaaha, Astaghfirullaaha
                    <span className="text-theme font-medium ml-[0.5vw]">
                      (3 times)
                    </span>
                  </p>
                  <p
                    className="text-gray-600 mt-[0.5vh] break-words"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.3vw, 1.625rem)',
                      lineHeight: '1.2',
                    }}
                  >
                    I seek the forgiveness of Allah
                  </p>
                </div>
                <div className="flex-1 text-right">
                  <p
                    className="font-serif text-gray-800 break-words"
                    style={{
                      fontSize: 'clamp(1.25rem, 2vw, 2.5rem)',
                      lineHeight: '1.4',
                      fontFamily: '"Amiri", "Times New Roman", serif',
                    }}
                  >
                    أَسْتَغْفِرُ اللَّه ، أَسْتَغْفِرُ اللَّه ، أَسْتَغْفِرُ اللَّه
                  </p>
                </div>
              </div>
            </div>

            {/* Allahumma antas-salam */}
            <div className="border-b border-gray-100 pb-[1vh]">
              <div className="flex gap-[2vw]">
                <div className="flex-[1.5]">
                  <p
                    className="text-gray-800 font-medium break-words"
                    style={{
                      fontSize: 'clamp(1rem, 1.6vw, 2rem)',
                      lineHeight: '1.2',
                    }}
                  >
                    Allahumma Antas-Salam wa minkas-salam Tabarakta ya Dhal-jalali wal-ikram
                  </p>
                  <p
                    className="text-gray-600 mt-[0.5vh] break-words"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.3vw, 1.625rem)',
                      lineHeight: '1.2',
                    }}
                  >
                    O Allah, You are peace, peace comes from You. Blessed are You O Possessor of Glory and Honour.
                  </p>
                </div>
                <div className="flex-1 text-right">
                  <p
                    className="font-serif text-gray-800 break-words"
                    style={{
                      fontSize: 'clamp(1.25rem, 2vw, 2.5rem)',
                      lineHeight: '1.4',
                      fontFamily: '"Amiri", "Times New Roman", serif',
                    }}
                  >
                    اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ
                  </p>
                </div>
              </div>
            </div>

            {/* Subhanallah */}
            <div className="border-b border-gray-100 pb-[1vh]">
              <div className="flex gap-[2vw]">
                <div className="flex-[1.5]">
                  <p
                    className="text-gray-800 font-medium break-words"
                    style={{
                      fontSize: 'clamp(1rem, 1.6vw, 2rem)',
                      lineHeight: '1.2',
                    }}
                  >
                    SubhaanAllah, Alhamdulillah, AllahuAkbar
                    <span className="text-theme font-medium ml-[0.5vw]">
                      (33 times each)
                    </span>
                  </p>
                  <p
                    className="text-gray-600 mt-[0.5vh] break-words"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.3vw, 1.625rem)',
                      lineHeight: '1.2',
                    }}
                  >
                    Glorified be Allah, All Praise is due to Allah and Allah is the Most Great
                  </p>
                </div>
                <div className="flex-1 text-right">
                  <p
                    className="font-serif text-gray-800 break-words"
                    style={{
                      fontSize: 'clamp(1.25rem, 2vw, 2.5rem)',
                      lineHeight: '1.4',
                      fontFamily: '"Amiri", "Times New Roman", serif',
                    }}
                  >
                    سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَاللَّهُ أَكْبَرُ
                  </p>
                </div>
              </div>
            </div>

            {/* Ayatul Kursi */}
            <div className="pb-[1vh]">
              <div className="flex gap-[2vw]">
                <div className="flex-[1.5]">
                  <p
                    className="text-gray-800 font-medium break-words"
                    style={{
                      fontSize: 'clamp(1rem, 1.6vw, 2rem)',
                      lineHeight: '1.2',
                    }}
                  >
                    Recite Ayatul Kursi
                  </p>
                  <p
                    className="text-gray-600 mt-[0.5vh] break-words"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.3vw, 1.625rem)',
                      lineHeight: '1.2',
                    }}
                  >
                    The Verse of the Throne (2:255)
                  </p>
                </div>
                <div className="flex-1 text-right">
                  <p
                    className="font-serif text-gray-800 break-words"
                    style={{
                      fontSize: 'clamp(1.25rem, 2vw, 2.5rem)',
                      lineHeight: '1.4',
                      fontFamily: '"Amiri", "Times New Roman", serif',
                    }}
                  >
                    آية الكرسي
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PrayerLayout>
  );
}

