"use client";

import { createContext, useContext } from "react";
import type { Tables } from "@/database.types";

export type Location = Tables<"masjid_locations"> | null;

export const LocationContext = createContext<Location>(null);

export const LocationProvider = ({
  children,
  location,
}: {
  children: React.ReactNode;
  location: Location;
}) => (
  <LocationContext.Provider value={location}>{children}</LocationContext.Provider>
);

export const useLocationContext = () => useContext(LocationContext);

