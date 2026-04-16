"use client";

import { motion } from "framer-motion";
import type { Round } from "@/types/game";
import { useThemeColors } from "@/lib/theme-colors";

interface StrategyTimelineProps {
  rounds: Round[];
  rowLabel: string;
  colLabel: string;
  className?: string;
}

export default function StrategyTimeline({
  rounds,
  rowLabel,
  colLabel,
  className = "",
}: StrategyTimelineProps) {
  const colors = useThemeColors();
  const cellSize = rounds.length > 50 ? 14 : rounds.length > 20 ? 20 : 28;

  function dotColor(action: "C" | "D"): string {
    return action === "C" ? colors.accentBlue : colors.accentOrange;
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-2 text-xs text-text-tertiary">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.accentBlue }} />
          Cooperate
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.accentOrange }} />
          Defect
        </span>
      </div>
      <div className="space-y-2">
        <TimelineRow
          label={rowLabel}
          actions={rounds.map((r) => r.row)}
          cellSize={cellSize}
          dotColor={dotColor}
          labelColor={colors.accentRed}
        />
        <TimelineRow
          label={colLabel}
          actions={rounds.map((r) => r.col)}
          cellSize={cellSize}
          dotColor={dotColor}
          labelColor={colors.accentBlue}
        />
      </div>
    </div>
  );
}

function TimelineRow({
  label,
  actions,
  cellSize,
  dotColor,
  labelColor,
}: {
  label: string;
  actions: Array<"C" | "D">;
  cellSize: number;
  dotColor: (a: "C" | "D") => string;
  labelColor: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="text-xs font-semibold uppercase tracking-wide w-16 shrink-0 text-right"
        style={{ color: labelColor }}
      >
        {label}
      </div>
      <div className="flex gap-0.5 flex-wrap">
        {actions.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15, delay: Math.min(i * 0.01, 0.3) }}
            title={`Round ${i + 1}: ${a === "C" ? "Cooperate" : "Defect"}`}
            className="rounded-sm"
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: dotColor(a),
            }}
          />
        ))}
      </div>
    </div>
  );
}
