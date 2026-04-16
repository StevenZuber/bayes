"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Action, GameScenario } from "@/types/game";
import { analyzeGame, cellKey } from "@/lib/game-theory";
import { useThemeColors } from "@/lib/theme-colors";

type Highlight = "none" | "dominant-row" | "dominant-col" | "nash" | "pareto" | "all";

interface PayoffMatrixProps {
  scenario: GameScenario;
  highlight?: Highlight;
  /** Optionally spotlight a single cell (e.g., the current round's outcome). */
  spotlightCell?: { row: Action; col: Action } | null;
  /** Editable payoffs — when provided, the matrix becomes interactive. */
  onPayoffChange?: (row: Action, col: Action, which: "row" | "col", value: number) => void;
  className?: string;
}

export default function PayoffMatrix({
  scenario,
  highlight = "none",
  spotlightCell = null,
  onPayoffChange,
  className = "",
}: PayoffMatrixProps) {
  const colors = useThemeColors();
  const analysis = useMemo(() => analyzeGame(scenario.matrix), [scenario.matrix]);

  const nashSet = new Set(analysis.nashEquilibria.map((e) => cellKey(e.row, e.col)));
  const paretoSet = new Set(analysis.paretoOptimal.map((p) => cellKey(p.row, p.col)));

  function cellBg(row: Action, col: Action): string {
    const key = cellKey(row, col);
    const isSpotlight = spotlightCell && spotlightCell.row === row && spotlightCell.col === col;
    if (isSpotlight) return colors.accentPurple;
    if ((highlight === "nash" || highlight === "all") && nashSet.has(key)) return colors.accentRed;
    if ((highlight === "pareto" || highlight === "all") && paretoSet.has(key))
      return colors.accentBlue;
    return "transparent";
  }

  function cellBorder(row: Action, col: Action): string {
    if (highlight === "dominant-row" && analysis.rowDominant === row) return colors.accentRed;
    if (highlight === "dominant-col" && analysis.colDominant === col) return colors.accentBlue;
    return "transparent";
  }

  const { cooperate, defect, rowPlayer, colPlayer } = scenario.labels;
  const actionLabel = (a: Action) => (a === "C" ? cooperate : defect);

  return (
    <div className={`inline-block ${className}`}>
      <div className="grid grid-cols-[auto_1fr_1fr] grid-rows-[auto_auto_1fr_1fr] gap-1 text-sm">
        {/* Top-left spacer */}
        <div />
        {/* Col player label spanning both action columns */}
        <div
          className="col-span-2 text-center text-xs font-semibold uppercase tracking-wide text-text-tertiary pb-1"
          style={{ color: colors.accentBlue }}
        >
          {colPlayer}
        </div>

        {/* Row player side label */}
        <div
          className="row-span-3 flex items-center justify-center text-xs font-semibold uppercase tracking-wide"
          style={{ color: colors.accentRed, writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {rowPlayer}
        </div>

        {/* Col action headers */}
        <HeaderCell label={actionLabel("C")} subLabel="C" />
        <HeaderCell label={actionLabel("D")} subLabel="D" />

        {/* Row: C */}
        <RowHeader label={actionLabel("C")} subLabel="C" />
        <Cell
          row="C"
          col="C"
          scenario={scenario}
          bg={cellBg("C", "C")}
          border={cellBorder("C", "C")}
          onPayoffChange={onPayoffChange}
          badges={badges(nashSet, paretoSet, highlight, "C", "C")}
        />
        <Cell
          row="C"
          col="D"
          scenario={scenario}
          bg={cellBg("C", "D")}
          border={cellBorder("C", "D")}
          onPayoffChange={onPayoffChange}
          badges={badges(nashSet, paretoSet, highlight, "C", "D")}
        />

        {/* Row: D */}
        <RowHeader label={actionLabel("D")} subLabel="D" />
        <Cell
          row="D"
          col="C"
          scenario={scenario}
          bg={cellBg("D", "C")}
          border={cellBorder("D", "C")}
          onPayoffChange={onPayoffChange}
          badges={badges(nashSet, paretoSet, highlight, "D", "C")}
        />
        <Cell
          row="D"
          col="D"
          scenario={scenario}
          bg={cellBg("D", "D")}
          border={cellBorder("D", "D")}
          onPayoffChange={onPayoffChange}
          badges={badges(nashSet, paretoSet, highlight, "D", "D")}
        />
      </div>
    </div>
  );
}

function badges(
  nashSet: Set<string>,
  paretoSet: Set<string>,
  highlight: Highlight,
  row: Action,
  col: Action
): Array<{ label: string; color: "nash" | "pareto" }> {
  const key = cellKey(row, col);
  const out: Array<{ label: string; color: "nash" | "pareto" }> = [];
  if ((highlight === "nash" || highlight === "all") && nashSet.has(key))
    out.push({ label: "Nash", color: "nash" });
  if ((highlight === "pareto" || highlight === "all") && paretoSet.has(key))
    out.push({ label: "Pareto", color: "pareto" });
  return out;
}

function HeaderCell({ label, subLabel }: { label: string; subLabel: string }) {
  return (
    <div className="text-center py-1 font-semibold text-foreground">
      {label}
      <span className="ml-1 font-mono text-xs text-text-tertiary">({subLabel})</span>
    </div>
  );
}

function RowHeader({ label, subLabel }: { label: string; subLabel: string }) {
  return (
    <div className="flex items-center justify-end pr-2 font-semibold text-foreground">
      {label}
      <span className="ml-1 font-mono text-xs text-text-tertiary">({subLabel})</span>
    </div>
  );
}

function Cell({
  row,
  col,
  scenario,
  bg,
  border,
  onPayoffChange,
  badges,
}: {
  row: Action;
  col: Action;
  scenario: GameScenario;
  bg: string;
  border: string;
  onPayoffChange?: (row: Action, col: Action, which: "row" | "col", value: number) => void;
  badges: Array<{ label: string; color: "nash" | "pareto" }>;
}) {
  const colors = useThemeColors();
  const cell = scenario.matrix[row][col];

  return (
    <motion.div
      initial={false}
      animate={{ backgroundColor: bg }}
      transition={{ duration: 0.3 }}
      className="relative min-w-[120px] min-h-[80px] flex items-center justify-center rounded-lg border-2"
      style={{
        borderColor: border === "transparent" ? "var(--separator)" : border,
        backgroundColor: bg === "transparent" ? "var(--surface)" : undefined,
      }}
      data-testid={`cell-${row}${col}`}
    >
      <div className="flex items-center gap-3 font-mono text-lg">
        {onPayoffChange ? (
          <>
            <PayoffInput
              value={cell.row}
              color={colors.accentRed}
              onChange={(v) => onPayoffChange(row, col, "row", v)}
              label={`${scenario.labels.rowPlayer} payoff when ${row}/${col}`}
            />
            <span className="text-text-tertiary">,</span>
            <PayoffInput
              value={cell.col}
              color={colors.accentBlue}
              onChange={(v) => onPayoffChange(row, col, "col", v)}
              label={`${scenario.labels.colPlayer} payoff when ${row}/${col}`}
            />
          </>
        ) : (
          <>
            <span className="font-bold" style={{ color: colors.accentRed }}>
              {cell.row}
            </span>
            <span className="text-text-tertiary">,</span>
            <span className="font-bold" style={{ color: colors.accentBlue }}>
              {cell.col}
            </span>
          </>
        )}
      </div>
      {badges.length > 0 && (
        <div className="absolute top-1 right-1 flex gap-1">
          {badges.map((b) => (
            <span
              key={b.label}
              className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-white"
              style={{
                backgroundColor:
                  b.color === "nash" ? colors.accentRed : colors.accentBlue,
              }}
            >
              {b.label}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function PayoffInput({
  value,
  color,
  onChange,
  label,
}: {
  value: number;
  color: string;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <input
      type="number"
      value={value}
      step={1}
      aria-label={label}
      onChange={(e) => {
        const v = parseInt(e.target.value, 10);
        if (!Number.isNaN(v)) onChange(v);
      }}
      className="w-12 bg-transparent border-b border-separator font-bold text-center focus:outline-none focus:border-current"
      style={{ color }}
    />
  );
}
