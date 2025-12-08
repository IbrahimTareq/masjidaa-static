'use client';

import { useState, useEffect } from 'react';
import PrayerLayout from "@/components/LayoutWithHeader";

// Verse data collection
const VERSE_DATA = [
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship comes ease",
    reference: "Quran 94:6",
  },
  {
    arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
    translation: "And do not despair of relief from Allah. Indeed, no one despairs of relief from Allah except the disbelieving people",
    reference: "Quran 12:87",
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me",
    reference: "Quran 2:152",
  },
  {
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    translation: "And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me",
    reference: "Quran 2:186",
  },
  {
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ",
    translation: "And whoever fears Allah - He will make for him a way out and will provide for him from where he does not expect",
    reference: "Quran 65:2-3",
  },
  {
    arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    translation: "And say, 'My Lord, increase me in knowledge'",
    reference: "Quran 20:114",
  },
  {
    arabic: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
    translation: "Indeed, Allah will not change the condition of a people until they change what is in themselves",
    reference: "Quran 13:11",
  },
  {
    arabic: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
    translation: "And I did not create the jinn and mankind except to worship Me",
    reference: "Quran 51:56",
  },
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship will be ease. Indeed, with hardship will be ease",
    reference: "Quran 94:5-6",
  },
  {
    arabic: "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",
    translation: "And be patient, for indeed, Allah does not allow to be lost the reward of those who do good",
    reference: "Quran 11:115",
  },
  {
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translation: "Verily, in the remembrance of Allah do hearts find rest",
    reference: "Quran 13:28",
  },
  {
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translation: "And whoever relies upon Allah - then He is sufficient for him",
    reference: "Quran 65:3",
  },
  {
    arabic: "وَلَا تَحْسَبَنَّ اللَّهَ غَافِلًا عَمَّا يَعْمَلُ الظَّالِمُونَ",
    translation: "And never think that Allah is unaware of what the wrongdoers do",
    reference: "Quran 14:42",
  },
  {
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient",
    reference: "Quran 2:153",
  },
  {
    arabic: "وَلَا تُفْسِدُوا فِي الْأَرْضِ بَعْدَ إِصْلَاحِهَا",
    translation: "And do not cause corruption on the earth after it has been set right",
    reference: "Quran 7:56",
  },
  {
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "Indeed, Allah is with the patient",
    reference: "Quran 2:153",
  },
  {
    arabic: "وَتُوبُوا إِلَى اللَّهِ جَمِيعًا أَيُّهَ الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ",
    translation: "And turn to Allah in repentance, all of you, O believers, that you might succeed",
    reference: "Quran 24:31",
  },
  {
    arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
    translation: "And He is with you wherever you are",
    reference: "Quran 57:4",
  },
  {
    arabic: "قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ",
    translation: "Say, 'Indeed, my prayer, my rites of sacrifice, my living and my dying are for Allah, Lord of the worlds'",
    reference: "Quran 6:162",
  },
  {
    arabic: "وَلَذِكْرُ اللَّهِ أَكْبَرُ",
    translation: "And the remembrance of Allah is greater",
    reference: "Quran 29:45",
  },
];

export default function VerseOfTheDay() {
  // Get a verse based on the current date (changes daily at midnight)
  const [verse, setVerse] = useState(VERSE_DATA[0]);

  useEffect(() => {
    const updateVerse = () => {
      // Get day of year (0-365) to deterministically select a verse
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - start.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      
      // Use modulo to cycle through all verses
      const verseIndex = dayOfYear % VERSE_DATA.length;
      setVerse(VERSE_DATA[verseIndex]);
    };

    // Update verse immediately
    updateVerse();

    // Calculate milliseconds until midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    // Update at midnight
    const midnightTimer = setTimeout(() => {
      updateVerse();
      // Set up daily interval after first midnight update
      const dailyInterval = setInterval(updateVerse, 24 * 60 * 60 * 1000);
      
      // Cleanup function for the interval
      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    // Cleanup function for the timeout
    return () => clearTimeout(midnightTimer);
  }, []);

  return (
    <PrayerLayout headerTitle="Verse of the Day">
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
            {/* Verse Section */}
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
                {verse.arabic}
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
                "{verse.translation}"
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
                ({verse.reference})
              </p>
            </div>
          </div>
        </div>
      </div>
    </PrayerLayout>
  );
}

