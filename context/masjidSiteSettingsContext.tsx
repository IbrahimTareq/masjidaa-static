"use client";

import { Tables } from "@/database.types";
import React, { createContext, useContext } from "react";

type MasjidSiteSettingsContextType = {
  siteSettings: Tables<"masjid_site_settings"> | null;
};

const MasjidSiteSettingsContext = createContext<MasjidSiteSettingsContextType | undefined>(
  undefined
);

export function MasjidSiteSettingsProvider({
  children,
  siteSettings,
}: {
  children: React.ReactNode;
  siteSettings: Tables<"masjid_site_settings"> | null;
}) {
  return (
    <MasjidSiteSettingsContext.Provider value={{ siteSettings }}>
      {children}
    </MasjidSiteSettingsContext.Provider>
  );
}

export function useMasjidSiteSettings() {
  const context = useContext(MasjidSiteSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useMasjidSiteSettings must be used within a MasjidSiteSettingsProvider"
    );
  }
  return context;
}
