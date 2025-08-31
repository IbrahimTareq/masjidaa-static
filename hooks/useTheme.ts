"use client";

import { Database } from "@/database.types";
import { createClient as createBrowserSupabase } from "@/utils/supabase/client";
import { useEffect } from "react";
import useSWR from "swr";

type Theme = Database["public"]["Tables"]["themes"]["Row"];

export function useThemes(masjidId?: string) {
  const supabase = createBrowserSupabase();

  const fetcher = async () => {
    if (!masjidId) {
      return { currentTheme: null };
    }

    // First, get the masjid to find the theme_color_id
    const { data: masjid, error: masjidError } = await supabase
      .from("masjids")
      .select("theme_color_id")
      .eq("id", masjidId)
      .single();

    if (masjidError || !masjid?.theme_color_id) {
      return { currentTheme: null };
    }

    // Then fetch the theme using the theme_color_id
    const { data: theme, error: themeError } = await supabase
      .from("themes")
      .select("*")
      .eq("id", masjid.theme_color_id)
      .single();

    if (themeError) {
      return { currentTheme: null };
    }

    return { currentTheme: theme };
  };

  const { data, error, isLoading } = useSWR(
    masjidId ? ["theme", masjidId] : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    currentTheme: data?.currentTheme as Theme | null,
    isLoading,
    error,
  };
}

export function useTheme(masjidId?: string) {
  const { currentTheme } = useThemes(masjidId);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty(
      "--theme-color",
      currentTheme?.base_color || "#0C8C4D"
    );
    root.style.setProperty(
      "--theme-color-accent",
      currentTheme?.accent_color || "#0C8C4D"
    );
    root.style.setProperty(
      "--theme-color-gradient",
      currentTheme?.gradient_color || "#0d7d45"
    );
  }, [currentTheme]);

  return { currentTheme };
}
