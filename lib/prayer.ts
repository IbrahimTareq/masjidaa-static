import type { Tables } from "@/database.types";
import type { PrayerName } from "@/utils/prayer";
import type { SupabaseClient } from "@supabase/supabase-js";

export type PrayerData = {
  settings: Tables<"masjid_prayer_settings"> | null;
  iqamah: Tables<"masjid_iqamah_times"> | null;
  jummah: Tables<"masjid_jummah_times">[] | null;
  prayerInfo: {
    current: {
      name: PrayerName;
      time: string;
    };
    next: {
      name: PrayerName;
      time: string;
    };
    timeUntilNext: {
      hours: number;
      minutes: number;
      seconds: number;
    };
  } | null;
  prayerTimes: {
    fajr: string;
    sunrise: string;
    duha: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  } | null;
};

export async function getPrayerData(
  supabase: SupabaseClient,
  masjidId: string,
  timeFormat: "12" | "24" = "12"
): Promise<PrayerData> {
  const [settingsRes, iqamahRes, jummahRes, adhanRes] = await Promise.all([
    supabase.from("masjid_prayer_settings").select("*").eq("masjid_id", masjidId).single(),
    supabase.from("masjid_iqamah_times")
      .select("*")
      .eq("masjid_id", masjidId)
      .eq("active", true)
      .order("effective_from", { ascending: false })
      .limit(1)
      .single(),
    supabase.from("masjid_jummah_times")
      .select("*")
      .eq("masjid_id", masjidId)
      .order("created_at", { ascending: true }),
    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_API}/get-adhan-times/${masjidId}?time_format=${timeFormat}`)
      .then(r => r.ok ? r.json() as Promise<any> : null)
      .catch(() => null),
  ]);

  return {
    settings: settingsRes.data ?? null,
    iqamah: iqamahRes.data ?? null,
    jummah: jummahRes.data ?? null,
    prayerInfo: adhanRes?.prayerInfo ?? null,
    prayerTimes: adhanRes
      ? {
          fajr: adhanRes.fajr,
          sunrise: adhanRes.sunrise,
          duha: adhanRes.duha,
          dhuhr: adhanRes.dhuhr,
          asr: adhanRes.asr,
          maghrib: adhanRes.maghrib,
          isha: adhanRes.isha,
        }
      : null,
  };
}
