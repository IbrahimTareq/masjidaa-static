"use client";

import { useTheme } from "@/hooks/useTheme";
import React from "react";

export default function ThemeClientWrapper({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  useTheme(id);

  return <>{children}</>;
}
