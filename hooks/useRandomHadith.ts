"use client";

import { useState, useEffect } from 'react';

interface Hadith {
  text: string;
  source: string;
}

const hadiths: Hadith[] = [
  {
    text: "The Messenger of Allah ﷺ was asked: Which charity is best? He replied: Charity given while you are healthy, covetous, hoping to live, and fearing poverty.",
    source: "Sahih al-Bukhari"
  },
  {
    text: "The believer\’s shade on the Day of Resurrection will be his charity.",
    source: "Sunan al-Tirmidhi"
  },
  {
    text: "Charity does not decrease wealth, no one forgives another except that Allah increases his honor, and no one humbles himself for the sake of Allah except that Allah raises his status.",
    source: "Sahih Muslim"
  },
  {
    text: "And whatever you spend in charity, He will compensate you for it. For He is the Best Provider.",
    source: "Quran 34:39"
  },
  {
    text: "The example of those who spend their wealth in the cause of Allah is that of a grain that sprouts into seven ears, each bearing one hundred grains. And Allah multiplies the reward even more to whoever He wills. For Allah is All-Bountiful, All-Knowing.",
    source: "Quran 2:261"
  },
  {
    text: "Whatever charity you give, only seeking the pleasure of Allah — it is they whose reward will be multiplied.",
    source: "Quran 30:39"
  },
  {
    text: "Charity extinguishes sins just as water extinguishes fire.",
    source: "Sunan al-Tirmidhi"
  }
];


export function useRandomHadith() {
  // Always use the first hadith for initial render to avoid hydration mismatch
  const [currentHadith, setCurrentHadith] = useState<Hadith>(hadiths[0]);
  const [isClient, setIsClient] = useState(false);

  // Mark when we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get a random hadith once after initial client render
  useEffect(() => {
    if (isClient) {
      // Get a random hadith only once after hydration
      const randomIndex = Math.floor(Math.random() * hadiths.length);
      if (randomIndex !== 0) { // Only update if it's different from initial
        setCurrentHadith(hadiths[randomIndex]);
      }
    }
  }, [isClient]); // Only depends on isClient, runs once

  return {
    hadith: currentHadith,
  };
}
