'use client';

import { useState, useEffect } from 'react';
import PrayerLayout from "@/components/LayoutWithHeader";

// Dua data collection - Mix of Quranic and Prophetic duas
const DUA_DATA = [
  // Quranic Duas
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire",
    reference: "Quran 2:201",
  },
  {
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    translation: "My Lord, expand for me my breast [with assurance] and ease for me my task",
    reference: "Quran 20:25-26",
  },
  {
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً",
    translation: "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy",
    reference: "Quran 3:8",
  },
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation: "My Lord, increase me in knowledge",
    reference: "Quran 20:114",
  },
  {
    arabic: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    translation: "Our Lord, forgive us our sins and our transgressions, establish our feet firmly, and give us victory over the disbelievers",
    reference: "Quran 3:147",
  },
  {
    arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    translation: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers",
    reference: "Quran 7:23",
  },
  {
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    translation: "Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us leaders for the righteous",
    reference: "Quran 25:74",
  },
  {
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    translation: "Sufficient for us is Allah, and [He is] the best Disposer of affairs",
    reference: "Quran 3:173",
  },
  // Prophetic Duas
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ",
    translation: "O Allah, I ask You for well-being in this world and in the Hereafter",
    reference: "Sunan Ibn Majah 3851",
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ وَمِنْ قَلْبٍ لَا يَخْشَعُ",
    translation: "O Allah, I seek refuge in You from knowledge that does not benefit and from a heart that does not fear You",
    reference: "Sahih Muslim 2722",
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
    translation: "O Allah, I ask You for guidance, piety, chastity and self-sufficiency",
    reference: "Sahih Muslim 2721",
  },
  {
    arabic: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ دِقَّهُ وَجِلَّهُ وَأَوَّلَهُ وَآخِرَهُ وَعَلَانِيَتَهُ وَسِرَّهُ",
    translation: "O Allah, forgive me all my sins, the minor and the major, the first and the last, the apparent and the hidden",
    reference: "Sahih Muslim 483",
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا",
    translation: "O Allah, I ask You for beneficial knowledge, goodly provision and accepted deeds",
    reference: "Sunan Ibn Majah 925",
  },
  {
    arabic: "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي",
    translation: "O Allah, rectify for me my religion which is the safeguard of my affairs, and rectify for me my worldly life wherein is my livelihood",
    reference: "Sahih Muslim 2720",
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ وَتَحَوُّلِ عَافِيَتِكَ وَفُجَاءَةِ نِقْمَتِكَ",
    translation: "O Allah, I seek refuge in You from the decline of Your blessings, the change of the good health You have given, and Your sudden punishment",
    reference: "Sahih Muslim 2739",
  },
  {
    arabic: "اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي",
    translation: "O Allah, guide me and make me steadfast",
    reference: "Sahih Muslim 2725",
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ حُبَّكَ وَحُبَّ مَنْ يُحِبُّكَ وَحُبَّ عَمَلٍ يُقَرِّبُنِي إِلَى حُبِّكَ",
    translation: "O Allah, I ask You for Your love, the love of those who love You, and the love of deeds that will bring me closer to Your love",
    reference: "Sunan al-Tirmidhi 3235",
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ",
    translation: "O Allah, I seek refuge in You from worry, grief, incapacity and laziness",
    reference: "Sahih al-Bukhari 6369",
  },
  {
    arabic: "اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ",
    translation: "O Allah, I have greatly wronged myself and no one forgives sins but You, so grant me forgiveness from You",
    reference: "Sahih al-Bukhari 834",
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ جَهْدِ الْبَلَاءِ وَدَرَكِ الشَّقَاءِ وَسُوءِ الْقَضَاءِ",
    translation: "O Allah, I seek refuge in You from the severity of affliction, from being overtaken by misery, and from bad judgment",
    reference: "Sahih al-Bukhari 6347",
  },
];

export default function DuaOfTheDay() {
  // Get a random dua on component mount
  const [dua, setDua] = useState(DUA_DATA[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * DUA_DATA.length);
    setDua(DUA_DATA[randomIndex]);
  }, []);

  return (
    <PrayerLayout headerTitle="Dua of the Day">
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
                  fontSize: 'clamp(1.625rem, 3.5vw, 4.75rem)',
                  lineHeight: '1.4',
                  fontFamily: '"Amiri", "Times New Roman", serif',
                  textAlign: 'center',
                  fontWeight: '600',
                }}
              >
                {dua.arabic}
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
                "{dua.translation}"
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
                ({dua.reference})
              </p>
            </div>
          </div>
        </div>
      </div>
    </PrayerLayout>
  );
}

