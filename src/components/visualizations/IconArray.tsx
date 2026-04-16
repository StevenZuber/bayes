"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BayesParams } from "@/types";
import { assignDotStates, DEFAULT_POPULATION } from "@/lib/bayes";
import { useThemeColors } from "@/lib/theme-colors";
import {
  OUTCOMES,
  OUTCOME_LABELS,
  outcomeColors,
  type Outcome,
} from "@/lib/outcomes";

interface IconArrayProps {
  params: BayesParams;
  population?: number;
  highlightPositives?: boolean;
  phase?: "population" | "prior" | "evidence" | "full";
  className?: string;
}

export default function IconArray({
  params,
  population = DEFAULT_POPULATION,
  highlightPositives = false,
  phase = "full",
  className = "",
}: IconArrayProps) {
  const cols = Math.ceil(Math.sqrt(population));
  const colors = useThemeColors();
  const palette = useMemo(() => outcomeColors(colors), [colors]);
  const dotStates = useMemo(
    () => assignDotStates(params, population),
    [params, population]
  );

  function getDotColor(state: Outcome, index: number): string {
    if (phase === "population") return colors.tn;

    const withConditionCount = Math.round(population * params.prevalence);
    const hasCondition = index < withConditionCount;

    if (phase === "prior") {
      return hasCondition ? colors.tp : colors.tn;
    }

    return palette[state].bg;
  }

  function getDotOpacity(state: Outcome): number {
    if (!highlightPositives) return 1;
    if (state === "true-positive" || state === "false-positive") return 1;
    return 0.12;
  }

  const dotSize = population <= 100 ? 8 : population <= 500 ? 5 : 3;
  const gap = population <= 100 ? 3 : population <= 500 ? 2 : 1;

  return (
    <div className={className}>
      <div
        className="inline-grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {dotStates.map((state, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              backgroundColor: getDotColor(state, i),
              opacity: getDotOpacity(state),
              scale: highlightPositives && (state === "true-positive" || state === "false-positive") ? 1.3 : 1,
            }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.0003, 0.3) }}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
            }}
          />
        ))}
      </div>

      {/* Legend */}
      {phase !== "population" && (
        <ul
          className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-sm text-text-secondary list-none p-0"
          aria-label="Legend"
        >
          {phase === "prior" ? (
            <>
              <LegendItem color={colors.tp} label="Has condition" />
              <LegendItem color={colors.tn} label="No condition" />
            </>
          ) : (
            OUTCOMES.map((outcome) => (
              <LegendItem
                key={outcome}
                color={palette[outcome].bg}
                label={OUTCOME_LABELS[outcome]}
              />
            ))
          )}
        </ul>
      )}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span
        aria-hidden="true"
        className="rounded-full inline-block"
        style={{ width: 10, height: 10, backgroundColor: color }}
      />
      <span>{label}</span>
    </li>
  );
}
