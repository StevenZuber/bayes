"use client";

import { useMemo } from "react";
import { useTheme } from "@/components/ThemeProvider";

/** Resolved color values for the current theme. Used by visualization components
 *  that need raw hex strings for inline styles and Framer Motion animations. */
export interface ThemeColors {
  tp: string;
  fp: string;
  fn: string;
  tn: string;
  priorBlock: string;
  noConditionBlock: string;
  tpText: string;
  fpText: string;
  fnText: string;
  tnText: string;
  priorText: string;
  priorValue: string;
  noConditionText: string;
  noConditionValue: string;
  accentRed: string;
  accentOrange: string;
  accentBlue: string;
  accentPurple: string;
  accentIndigo: string;
  accentGray: string;
}

const DARK: ThemeColors = {
  tp: "#f87171",
  fp: "#fb923c",
  fn: "#60a5fa",
  tn: "#4B4B4F",
  priorBlock: "#991b1b",
  noConditionBlock: "#3A3A3C",
  tpText: "#fecaca",
  fpText: "#fed7aa",
  fnText: "#bfdbfe",
  tnText: "#e5e7eb",
  priorText: "#fecaca",
  priorValue: "#fee2e2",
  noConditionText: "#d1d5db",
  noConditionValue: "#e5e7eb",
  accentRed: "#f87171",
  accentOrange: "#fb923c",
  accentBlue: "#60a5fa",
  accentPurple: "#c084fc",
  accentIndigo: "#818cf8",
  accentGray: "#9ca3af",
};

const LIGHT: ThemeColors = {
  tp: "#dc2626",
  fp: "#ea580c",
  fn: "#2563eb",
  tn: "#d1d5db",
  priorBlock: "#fecaca",
  noConditionBlock: "#e5e7eb",
  tpText: "#991b1b",
  fpText: "#9a3412",
  fnText: "#1e40af",
  tnText: "#374151",
  priorText: "#991b1b",
  priorValue: "#7f1d1d",
  noConditionText: "#4b5563",
  noConditionValue: "#374151",
  accentRed: "#dc2626",
  accentOrange: "#ea580c",
  accentBlue: "#2563eb",
  accentPurple: "#7c3aed",
  accentIndigo: "#4f46e5",
  accentGray: "#6b7280",
};

export function useThemeColors(): ThemeColors {
  const { theme } = useTheme();
  return useMemo(() => (theme === "light" ? LIGHT : DARK), [theme]);
}
