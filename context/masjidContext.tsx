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
