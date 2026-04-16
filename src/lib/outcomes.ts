import type { ThemeColors } from "@/lib/theme-colors";

export type Outcome =
  | "true-positive"
  | "false-positive"
  | "true-negative"
  | "false-negative";

export const OUTCOMES: Outcome[] = [
  "true-positive",
  "false-positive",
  "true-negative",
  "false-negative",
];

export const OUTCOME_LABELS: Record<Outcome, string> = {
  "true-positive": "True positive",
  "false-positive": "False positive",
  "true-negative": "True negative",
  "false-negative": "False negative",
};

export const OUTCOME_SHORT_LABELS: Record<Outcome, string> = {
  "true-positive": "True +",
  "false-positive": "False +",
  "true-negative": "True −",
  "false-negative": "False −",
};

export interface OutcomeColor {
  bg: string;
  text: string;
}

export function outcomeColors(colors: ThemeColors): Record<Outcome, OutcomeColor> {
  return {
    "true-positive": { bg: colors.tp, text: colors.tpText },
    "false-positive": { bg: colors.fp, text: colors.fpText },
    "true-negative": { bg: colors.tn, text: colors.tnText },
    "false-negative": { bg: colors.fn, text: colors.fnText },
  };
}
