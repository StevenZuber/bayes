"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BayesParams } from "@/types";
import { calculateBayes, formatPercent } from "@/lib/bayes";
import { useThemeColors } from "@/lib/theme-colors";
import { OUTCOME_LABELS, outcomeColors, type Outcome } from "@/lib/outcomes";

interface FormulaDisplayProps {
  params: BayesParams;
  mode?: "symbolic" | "numeric" | "both";
  className?: string;
}

export default function FormulaDisplay({
  params,
  mode = "both",
  className = "",
}: FormulaDisplayProps) {
  const result = calculateBayes(params);
  const colors = useThemeColors();
  const palette = useMemo(() => outcomeColors(colors), [colors]);
  const { prevalence, sensitivity, specificity } = params;

  const outcomeCounts: Record<Outcome, number> = {
    "true-positive": result.truePositives,
    "false-positive": result.falsePositives,
    "false-negative": result.falseNegatives,
    "true-negative": result.trueNegatives,
  };

  return (
    <div className={`font-mono text-sm ${className}`}>
      {(mode === "symbolic" || mode === "both") && (
        <div className="mb-4">
          <div className="text-text-tertiary text-xs uppercase tracking-wide mb-2">
            Bayes&apos; Theorem
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-semibold" style={{ color: colors.accentPurple }}>P(A|B)</span>
            <span className="text-text-tertiary">=</span>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 border-b border-text-tertiary pb-1 px-2">
                <span className="font-semibold" style={{ color: colors.accentRed }}>P(B|A)</span>
                <span className="text-text-tertiary">&middot;</span>
                <span className="font-semibold" style={{ color: colors.accentRed }}>P(A)</span>
              </div>
              <div className="flex items-center gap-1 pt-1 px-2">
                <span className="font-semibold text-text-secondary">P(B)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {(mode === "numeric" || mode === "both") && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${prevalence}-${sensitivity}-${specificity}`}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="text-text-tertiary text-xs uppercase tracking-wide mb-2">
              With current values
            </div>

            <div className="grid grid-cols-[auto_auto_1fr] gap-x-3 gap-y-1.5 items-baseline">
              <FormulaRow
                label="P(A)"
                description="Prior (prevalence)"
                value={formatPercent(prevalence)}
                color={colors.accentRed}
              />
              <FormulaRow
                label="P(B|A)"
                description="Sensitivity"
                value={formatPercent(sensitivity)}
                color={colors.accentRed}
              />
              <FormulaRow
                label="P(¬B|¬A)"
                description="Specificity"
                value={formatPercent(specificity)}
                color={colors.accentGray}
              />
              <FormulaRow
                label="P(B)"
                description="Total positive rate"
                value={formatPercent(result.pPositive)}
                color={colors.accentGray}
              />

              <div className="col-span-3 border-t border-separator my-1" />

              <FormulaRow
                label="P(A|B)"
                description="Posterior"
                value={formatPercent(result.posterior)}
                color={colors.accentPurple}
                bold
              />
            </div>

            {/* Natural frequency breakdown */}
            <div className="mt-4 p-3 bg-surface rounded-lg text-xs text-text-secondary">
              <div className="font-semibold text-foreground mb-1">
                In natural frequencies (out of {result.population})
              </div>
              <div className="grid grid-cols-2 gap-1">
                {(
                  [
                    "true-positive",
                    "false-positive",
                    "false-negative",
                    "true-negative",
                  ] as const
                ).map((outcome) => (
                  <span key={outcome}>
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: palette[outcome].bg }}
                    />
                    {OUTCOME_LABELS[outcome]}s: {outcomeCounts[outcome]}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function FormulaRow({
  label,
  description,
  value,
  color,
  bold = false,
}: {
  label: string;
  description: string;
  value: string;
  color: string;
  bold?: boolean;
}) {
  return (
    <>
      <span className={bold ? "font-bold" : "font-semibold"} style={{ color }}>
        {label}
      </span>
      <span className="text-text-secondary">= {value}</span>
      <span className="text-text-tertiary text-xs">{description}</span>
    </>
  );
}
