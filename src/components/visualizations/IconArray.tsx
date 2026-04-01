"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BayesParams } from "@/types";
import { assignDotStates } from "@/lib/bayes";
import { useThemeColors } from "@/lib/theme-colors";

const DOT_LABELS = {
  "true-positive": "True positive",
  "false-positive": "False positive",
  "true-negative": "True negative",
  "false-negative": "False negative",
};

interface IconArrayProps {
  params: BayesParams;
  population?: number;
  highlightPositives?: boolean;
  phase?: "population" | "prior" | "evidence" | "full";
  className?: string;
}

export default function IconArray({
  params,
  population = 1000,
  highlightPositives = false,
  phase = "full",
  className = "",
}: IconArrayProps) {
  const cols = Math.ceil(Math.sqrt(population));
  const colors = useThemeColors();
  const dotStates = useMemo(
    () => assignDotStates(params, population),
    [params, population]
  );

  const dotColors = {
    "true-positive": colors.tp,
    "false-positive": colors.fp,
    "true-negative": colors.tn,
    "false-negative": colors.fn,
  };

  function getDotColor(state: string, index: number): string {
    if (phase === "population") return colors.tn;

    const withConditionCount = Math.round(population * params.prevalence);
    const hasCondition = index < withConditionCount;

    if (phase === "prior") {
      return hasCondition ? colors.tp : colors.tn;
    }

    return dotColors[state as keyof typeof dotColors] ?? colors.tn;
  }

  function getDotOpacity(state: string): number {
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
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-sm text-text-secondary">
          {phase === "prior" ? (
            <>
              <LegendItem color={colors.tp} label="Has condition" />
              <LegendItem color={colors.tn} label="No condition" />
            </>
          ) : (
            Object.entries(dotColors).map(([state, color]) => (
              <LegendItem
                key={state}
                color={color}
                label={DOT_LABELS[state as keyof typeof DOT_LABELS]}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="rounded-full"
        style={{ width: 10, height: 10, backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
}
