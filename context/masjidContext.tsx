"use client";

import { createContext, useContext } from "react";
import type { Tables } from "@/database.types";

export type Masjid = Tables<"masjids"> | null;

export const MasjidContext = createContext<Masjid>(null);

export const MasjidProvider = ({
  children,
  masjid,
}: {
  children: React.ReactNode;
  masjid: Masjid;
}) => (
  <MasjidContext.Provider value={masjid}>{children}</MasjidContext.Provider>
);

export const useMasjidContext = () => useContext(MasjidContext);

/**
 * Use this hook in components that are guaranteed to be wrapped by SiteWrapper.
 * SiteWrapper already handles the null case with a 404 page, so children
 * can safely assume masjid exists.
 */
export const useMasjid = (): Tables<"masjids"> => {
  const masjid = useContext(MasjidContext);
  if (!masjid) {
    throw new Error(
      "useMasjid must be used within a MasjidProvider with a valid masjid. " +
      "If you see this error, ensure the component is wrapped by SiteWrapper."
    );
  }
  return masjid;
};
