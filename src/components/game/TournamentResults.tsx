"use client";

import { motion } from "framer-motion";
import type { Strategy, TournamentResult } from "@/types/game";
import { useThemeColors } from "@/lib/theme-colors";

interface TournamentResultsProps {
  result: TournamentResult;
  strategies: Strategy[];
  className?: string;
}

export default function TournamentResults({
  result,
  strategies,
  className = "",
}: TournamentResultsProps) {
  const colors = useThemeColors();
  const maxScore = Math.max(...Object.values(result.scores), 1);

  const byId = new Map(strategies.map((s) => [s.id, s]));

  return (
    <div className={className}>
      <ol className="space-y-2 list-none p-0">
        {result.ranking.map((entry, idx) => {
          const strategy = byId.get(entry.strategyId);
          const pct = (entry.score / maxScore) * 100;
          return (
            <li key={entry.strategyId} className="flex items-center gap-3">
              <div className="w-6 text-right text-sm font-mono text-text-tertiary">
                {idx + 1}.
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-foreground truncate">
                    {strategy?.name ?? entry.strategyId}
                  </span>
                  <span className="font-mono text-sm text-text-secondary">
                    {entry.score}
                  </span>
                </div>
                <div className="h-2 bg-surface-elevated rounded-full overflow-hidden mt-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: idx === 0 ? colors.accentPurple : colors.accentIndigo,
                    }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
