'use client';

import { useState, useEffect } from 'react';
import PrayerLayout from "@/components/LayoutWithHeader";

// Hadith data collection
const HADITH_DATA = [
  {
    arabic: "مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا",
    translation: "Whoever sends blessings upon me once, Allah will send blessings upon him tenfold",
    reference: "Sahih Muslim 408",
  },
  {
    arabic: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ",
    translation: "The strong believer is better and more beloved to Allah than the weak believer",
    reference: "Sahih Muslim 2664",
  },
  {
    arabic: "إِنَّ اللَّهَ طَيِّبٌ لَا يَقْبَلُ إِلَّا طَيِّبًا",
    translation: "Indeed, Allah is Pure and accepts only that which is pure",
    reference: "Sahih Muslim 1015",
  },
  {
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    translation: "Whoever takes a path in search of knowledge, Allah will make easy for him the path to Paradise",
    reference: "Sahih Muslim 2699",
  },
  {
    arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ",
    translation: "Supplication is worship",
    reference: "Sunan al-Tirmidhi 3372",
  },
  {
    arabic: "خَيْرُ يَوْمٍ طَلَعَتْ عَلَيْهِ الشَّمْسُ يَوْمُ الْجُمُعَةِ",
    translation: "The best day on which the sun has risen is Friday",
    reference: "Sahih Muslim 854",
  },
  {
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    translation: "Actions are judged by intentions",
    reference: "Sahih al-Bukhari 1",
  },
  {
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translation: "Whoever believes in Allah and the Last Day, let him speak good or remain silent",
    reference: "Sahih al-Bukhari 6018",
  },
  {
    arabic: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
    translation: "The most beloved of deeds to Allah are those that are most consistent, even if they are small",
    reference: "Sahih al-Bukhari 6464",
  },
  {
    arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    translation: "The Muslim is the one from whose tongue and hand the Muslims are safe",
    reference: "Sahih al-Bukhari 10",
  },
  {
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    translation: "None of you truly believes until he loves for his brother what he loves for himself",
    reference: "Sahih al-Bukhari 13",
  },
  {
    arabic: "مَنْ تَوَاضَعَ لِلَّهِ رَفَعَهُ اللَّهُ",
    translation: "Whoever humbles himself for the sake of Allah, Allah will elevate him",
    reference: "Sahih Muslim 2588",
  },
  {
    arabic: "الْجَنَّةُ تَحْتَ أَقْدَامِ الْأُمَّهَاتِ",
    translation: "Paradise lies beneath the feet of mothers",
    reference: "Sunan al-Nasa'i 3106",
  },
  {
    arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا",
    translation: "Fear Allah wherever you are, and follow up a bad deed with a good deed which will wipe it out",
    reference: "Sunan al-Tirmidhi 1987",
  },
  {
    arabic: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",
    translation: "Charity does not decrease wealth",
    reference: "Sahih Muslim 2588",
  },
  {
    arabic: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
    translation: "A good word is charity",
    reference: "Sahih al-Bukhari 2989",
  },
];

export default function HadithOfTheDay() {
  // Get a hadith based on the current date (changes daily at midnight)
  const [hadith, setHadith] = useState(HADITH_DATA[0]);

  useEffect(() => {
    const updateHadith = () => {
      // Get day of year (0-365) to deterministically select a hadith
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - start.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      
      // Use modulo to cycle through all hadiths
      const hadithIndex = dayOfYear % HADITH_DATA.length;
      setHadith(HADITH_DATA[hadithIndex]);
    };

    // Update hadith immediately
    updateHadith();

    // Calculate milliseconds until midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    // Update at midnight
    const midnightTimer = setTimeout(() => {
      updateHadith();
      // Set up daily interval after first midnight update
      const dailyInterval = setInterval(updateHadith, 24 * 60 * 60 * 1000);
      
      // Cleanup function for the interval
      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    // Cleanup function for the timeout
    return () => clearTimeout(midnightTimer);
  }, []);

  return (
    <PrayerLayout headerTitle="Hadith of the Day">
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
            {/* Hadith Section */}
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
                  fontSize: 'clamp(1.625rem, 3.5vw, 4.75rem)',
                  lineHeight: '1.4',
                  fontFamily: '"Amiri", "Times New Roman", serif',
                  textAlign: 'center',
                  fontWeight: '600',
                }}
              >
                {hadith.arabic}
              </p>

              {/* Translation */}
              <p
                className="text-gray-600 leading-relaxed break-words"
                style={{
                  fontSize: 'clamp(1.2rem, 2vw, 2.75rem)',
                  lineHeight: '1.4',
                  textAlign: 'center',
                }}
              >
                "{hadith.translation}"
              </p>
            </div>

            {/* Divider */}
            <div
              className="border-t border-gray-300"
              style={{
                width: 'clamp(100px, 30vw, 200px)',
              }}
            />

            {/* Reference Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.5rem, 0.75vh, 1rem)',
                maxWidth: '100%',
              }}
            >
              {/* Reference */}
              <p
                className="text-gray-500 italic break-words"
                style={{
                  fontSize: 'clamp(1.05rem, 1.5vw, 1.85rem)',
                  textAlign: 'center',
                }}
              >
                ({hadith.reference})
              </p>
            </div>
          </div>
        </div>
      </div>
    </PrayerLayout>
  );
}

