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
  spotlightCell?: { row: Action; col: Action } | null;
  onPayoffChange?: (row: Action, col: Action, which: "row" | "col", value: number) => void;
  /** When true, shows a legend below explaining any markers. */
  showLegend?: boolean;
  className?: string;
}

export default function PayoffMatrix({
  scenario,
  highlight = "none",
  spotlightCell = null,
  onPayoffChange,
  showLegend = true,
  className = "",
}: PayoffMatrixProps) {
  const colors = useThemeColors();
  const analysis = useMemo(() => analyzeGame(scenario.matrix), [scenario.matrix]);

  const nashSet = new Set(analysis.nashEquilibria.map((e) => cellKey(e.row, e.col)));
  const paretoSet = new Set(analysis.paretoOptimal.map((p) => cellKey(p.row, p.col)));

  const showNash = highlight === "nash" || highlight === "all";
  const showPareto = highlight === "pareto" || highlight === "all";

  function cellTint(row: Action, col: Action): string {
    const key = cellKey(row, col);
    const isSpotlight = spotlightCell && spotlightCell.row === row && spotlightCell.col === col;
    if (isSpotlight) return `${colors.accentPurple}33`;
    if (showNash && nashSet.has(key)) return `${colors.accentRed}22`;
    if (showPareto && paretoSet.has(key)) return `${colors.accentBlue}22`;
    return "transparent";
  }

  function cellRing(row: Action, col: Action): string {
    if (highlight === "dominant-row" && analysis.rowDominant === row) return colors.accentRed;
    if (highlight === "dominant-col" && analysis.colDominant === col) return colors.accentBlue;
    return "transparent";
  }

  const { cooperate, defect, rowPlayer, colPlayer } = scenario.labels;
  const actionLabel = (a: Action) => (a === "C" ? cooperate : defect);

  return (
    <div className={`w-full ${className}`}>
      {/* Top player label */}
      <div
        className="text-xs font-semibold uppercase tracking-wide text-center mb-1"
        style={{ color: colors.accentBlue }}
      >
        {colPlayer}
      </div>

      <div className="grid grid-cols-[auto_1fr_1fr] gap-1">
        {/* Empty corner */}
        <div />
        {/* Column action headers */}
        <ActionHeader label={actionLabel("C")} letter="C" />
        <ActionHeader label={actionLabel("D")} letter="D" />

        {/* Row: C */}
        <RowLabel
          rowPlayer={rowPlayer}
          label={actionLabel("C")}
          letter="C"
          color={colors.accentRed}
          showRowPlayer
        />
        <Cell
          row="C"
          col="C"
          scenario={scenario}
          tint={cellTint("C", "C")}
          ring={cellRing("C", "C")}
          onPayoffChange={onPayoffChange}
          markers={cellMarkers(nashSet, paretoSet, showNash, showPareto, "C", "C", colors.accentRed, colors.accentBlue)}
        />
        <Cell
          row="C"
          col="D"
          scenario={scenario}
          tint={cellTint("C", "D")}
          ring={cellRing("C", "D")}
          onPayoffChange={onPayoffChange}
          markers={cellMarkers(nashSet, paretoSet, showNash, showPareto, "C", "D", colors.accentRed, colors.accentBlue)}
        />

        {/* Row: D */}
        <RowLabel
          rowPlayer={rowPlayer}
          label={actionLabel("D")}
          letter="D"
          color={colors.accentRed}
        />
        <Cell
          row="D"
          col="C"
          scenario={scenario}
          tint={cellTint("D", "C")}
          ring={cellRing("D", "C")}
          onPayoffChange={onPayoffChange}
          markers={cellMarkers(nashSet, paretoSet, showNash, showPareto, "D", "C", colors.accentRed, colors.accentBlue)}
        />
        <Cell
          row="D"
          col="D"
          scenario={scenario}
          tint={cellTint("D", "D")}
          ring={cellRing("D", "D")}
          onPayoffChange={onPayoffChange}
          markers={cellMarkers(nashSet, paretoSet, showNash, showPareto, "D", "D", colors.accentRed, colors.accentBlue)}
        />
      </div>

      {showLegend &&
        ((showNash && nashSet.size > 0) || (showPareto && paretoSet.size > 0)) && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
            {showNash && nashSet.size > 0 && (
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: colors.accentRed }}
                />
                Nash equilibrium
              </span>
            )}
            {showPareto && paretoSet.size > 0 && (
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: colors.accentBlue }}
                />
                Pareto optimal
              </span>
            )}
          </div>
        )}
    </div>
  );
}

function cellMarkers(
  nashSet: Set<string>,
  paretoSet: Set<string>,
  showNash: boolean,
  showPareto: boolean,
  row: Action,
  col: Action,
  nashColor: string,
  paretoColor: string
): Array<{ color: string; title: string }> {
  const key = cellKey(row, col);
  const out: Array<{ color: string; title: string }> = [];
  if (showNash && nashSet.has(key)) out.push({ color: nashColor, title: "Nash equilibrium" });
  if (showPareto && paretoSet.has(key))
    out.push({ color: paretoColor, title: "Pareto optimal" });
  return out;
}

function ActionHeader({ label, letter }: { label: string; letter: string }) {
  return (
    <div className="text-center text-xs sm:text-sm font-semibold text-foreground py-1 px-1 truncate">
      <div className="truncate">{label}</div>
      <span className="font-mono text-[10px] text-text-tertiary">({letter})</span>
    </div>
  );
}

function RowLabel({
  rowPlayer,
  label,
  letter,
  color,
  showRowPlayer = false,
}: {
  rowPlayer: string;
  label: string;
  letter: string;
  color: string;
  showRowPlayer?: boolean;
}) {
  return (
    <div className="flex flex-col items-end justify-center pr-2 text-right">
      {showRowPlayer && (
        <div
          className="text-[10px] font-semibold uppercase tracking-wide mb-0.5"
          style={{ color }}
        >
          {rowPlayer}
        </div>
      )}
      <div className="text-xs sm:text-sm font-semibold text-foreground leading-tight">
        {label}
      </div>
      <span className="font-mono text-[10px] text-text-tertiary">({letter})</span>
    </div>
  );
}

function Cell({
  row,
  col,
  scenario,
  tint,
  ring,
  onPayoffChange,
  markers,
}: {
  row: Action;
  col: Action;
  scenario: GameScenario;
  tint: string;
  ring: string;
  onPayoffChange?: (row: Action, col: Action, which: "row" | "col", value: number) => void;
  markers: Array<{ color: string; title: string }>;
}) {
  const colors = useThemeColors();
  const cell = scenario.matrix[row][col];

  return (
    <motion.div
      initial={false}
      animate={{ backgroundColor: tint === "transparent" ? "var(--surface-elevated)" : tint }}
      transition={{ duration: 0.3 }}
      className="relative min-h-[64px] sm:min-h-[80px] flex items-center justify-center rounded-lg border-2"
      style={{
        borderColor: ring === "transparent" ? "var(--separator)" : ring,
      }}
      data-testid={`cell-${row}${col}`}
    >
      {/* Marker dots, top-right corner */}
      {markers.length > 0 && (
        <div className="absolute top-1 right-1 flex gap-1">
          {markers.map((m) => (
            <span
              key={m.title}
              title={m.title}
              aria-label={m.title}
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: m.color }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5 font-mono text-base sm:text-lg">
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
      className="w-10 sm:w-12 bg-transparent border-b border-separator font-bold text-center focus:outline-none focus:border-current"
      style={{ color }}
    />
  );
}
