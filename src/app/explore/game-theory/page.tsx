"use client";

import { useMemo, useState } from "react";
import PayoffMatrix from "@/components/game/PayoffMatrix";
import StrategyTimeline from "@/components/game/StrategyTimeline";
import TournamentResults from "@/components/game/TournamentResults";
import { gameScenarios } from "@/lib/game-scenarios";
import { analyzeGame } from "@/lib/game-theory";
import { STRATEGIES, getStrategy, playMatch, runTournament } from "@/lib/strategies";
import type { Action, GameScenario, PayoffMatrix as PM } from "@/types/game";
import { useThemeColors } from "@/lib/theme-colors";

type HighlightMode = "none" | "nash" | "pareto" | "all";

export default function ExploreGameTheoryPage() {
  const [scenario, setScenario] = useState<GameScenario>(gameScenarios[0]);
  const [matrix, setMatrix] = useState<PM>(gameScenarios[0].matrix);
  const [highlight, setHighlight] = useState<HighlightMode>("all");
  const [rowStrategyId, setRowStrategyId] = useState("tit-for-tat");
  const [colStrategyId, setColStrategyId] = useState("always-defect");
  const [rounds, setRounds] = useState(20);

  const colors = useThemeColors();
  const workingScenario: GameScenario = { ...scenario, matrix };
  const analysis = useMemo(() => analyzeGame(matrix), [matrix]);

  const match = useMemo(() => {
    const row = getStrategy(rowStrategyId);
    const col = getStrategy(colStrategyId);
    return playMatch(row, col, matrix, rounds);
  }, [rowStrategyId, colStrategyId, matrix, rounds]);

  const tournament = useMemo(
    () => runTournament(STRATEGIES, matrix, rounds),
    [matrix, rounds]
  );

  function handleScenarioChange(next: GameScenario) {
    setScenario(next);
    setMatrix(next.matrix);
  }

  function handlePayoffChange(row: Action, col: Action, which: "row" | "col", value: number) {
    setMatrix((prev) => ({
      ...prev,
      [row]: {
        ...prev[row],
        [col]: {
          ...prev[row][col],
          [which]: value,
        },
      },
    }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Game Theory Explorer
        </h1>
        <p className="text-text-secondary">
          Edit the payoff matrix, change strategies, and watch the equilibria
          and outcomes shift in real time.
        </p>
      </div>

      {/* Scenario selector */}
      <div className="mb-6">
        <div className="text-sm font-medium text-text-tertiary mb-2">Scenario</div>
        <div className="flex flex-wrap gap-2">
          {gameScenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => handleScenarioChange(s)}
              aria-pressed={scenario.id === s.id}
              className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                scenario.id === s.id
                  ? "bg-accent-strong text-white"
                  : "bg-surface-elevated text-text-secondary hover:bg-separator hover:text-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-text-tertiary mt-2">{scenario.description}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Payoff matrix + analysis */}
        <div>
          <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-3">
            Payoff matrix (editable)
          </h2>
          <div className="p-5 bg-surface rounded-xl border border-separator">
            <PayoffMatrix
              scenario={workingScenario}
              highlight={highlight}
              onPayoffChange={handlePayoffChange}
            />
          </div>

          {/* Highlight toggles */}
          <fieldset className="mt-4 flex flex-wrap gap-2">
            <legend className="text-xs font-medium text-text-tertiary mb-2 w-full">
              Highlight
            </legend>
            {(["none", "nash", "pareto", "all"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setHighlight(mode)}
                aria-pressed={highlight === mode}
                className={`min-h-[44px] px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  highlight === mode
                    ? "bg-accent-strong text-white"
                    : "bg-surface-elevated text-text-secondary hover:bg-separator"
                }`}
              >
                {mode === "none"
                  ? "Off"
                  : mode === "nash"
                    ? "Nash equilibria"
                    : mode === "pareto"
                      ? "Pareto optimal"
                      : "Both"}
              </button>
            ))}
          </fieldset>
        </div>

        {/* Analysis */}
        <div>
          <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-3">
            Analysis
          </h2>
          <div className="p-5 bg-surface rounded-xl border border-separator space-y-3 text-sm">
            <AnalysisRow
              label={`${scenario.labels.rowPlayer}'s dominant strategy`}
              value={
                analysis.rowDominant
                  ? analysis.rowDominant === "C"
                    ? scenario.labels.cooperate
                    : scenario.labels.defect
                  : "None"
              }
              color={colors.accentRed}
            />
            <AnalysisRow
              label={`${scenario.labels.colPlayer}'s dominant strategy`}
              value={
                analysis.colDominant
                  ? analysis.colDominant === "C"
                    ? scenario.labels.cooperate
                    : scenario.labels.defect
                  : "None"
              }
              color={colors.accentBlue}
            />
            <AnalysisRow
              label="Nash equilibria"
              value={
                analysis.nashEquilibria.length === 0
                  ? "None (pure)"
                  : analysis.nashEquilibria
                      .map(({ row, col }) => `(${row}, ${col})`)
                      .join(", ")
              }
              color={colors.accentPurple}
            />
            <AnalysisRow
              label="Pareto optimal"
              value={analysis.paretoOptimal
                .map(({ row, col }) => `(${row}, ${col})`)
                .join(", ")}
              color={colors.accentGray}
            />
          </div>
        </div>
      </div>

      {/* Iterated match */}
      <div className="mb-8 p-5 bg-surface rounded-xl border border-separator">
        <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-3">
          Iterated match
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <StrategyPicker
            label={scenario.labels.rowPlayer}
            value={rowStrategyId}
            onChange={setRowStrategyId}
          />
          <StrategyPicker
            label={scenario.labels.colPlayer}
            value={colStrategyId}
            onChange={setColStrategyId}
          />
          <div>
            <label className="block text-xs font-medium text-text-tertiary mb-1">
              Rounds: {rounds}
            </label>
            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={rounds}
              onChange={(e) => setRounds(parseInt(e.target.value, 10))}
              className="w-full"
              style={{ accentColor: colors.accentIndigo, color: colors.accentIndigo }}
            />
          </div>
        </div>

        <StrategyTimeline
          rounds={match.rounds}
          rowLabel={scenario.labels.rowPlayer}
          colLabel={scenario.labels.colPlayer}
        />

        <div className="mt-4 grid grid-cols-2 gap-4">
          <ScoreCard
            label={scenario.labels.rowPlayer}
            score={match.rowScore}
            color={colors.accentRed}
          />
          <ScoreCard
            label={scenario.labels.colPlayer}
            score={match.colScore}
            color={colors.accentBlue}
          />
        </div>
      </div>

      {/* Tournament */}
      <div className="p-5 bg-surface rounded-xl border border-separator">
        <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-3">
          Round-robin tournament
        </h2>
        <p className="text-sm text-text-secondary mb-4">
          Every strategy plays every other strategy (and itself) for {rounds} rounds.
          Total payoff decides the winner.
        </p>
        <TournamentResults result={tournament} strategies={STRATEGIES} />
      </div>
    </div>
  );
}

function AnalysisRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-text-secondary">{label}</span>
      <span className="font-mono font-semibold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function StrategyPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
}) {
  const strategy = STRATEGIES.find((s) => s.id === value);
  return (
    <div>
      <label className="block text-xs font-medium text-text-tertiary mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-surface-elevated border border-separator text-foreground text-sm"
      >
        {STRATEGIES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      {strategy && (
        <p className="text-xs text-text-tertiary mt-1">{strategy.description}</p>
      )}
    </div>
  );
}

function ScoreCard({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  return (
    <div className="text-center p-3 bg-surface-elevated rounded-lg">
      <div className="text-xs text-text-tertiary mb-1">{label}</div>
      <div className="text-2xl font-bold font-mono" style={{ color }}>
        {score}
      </div>
    </div>
  );
}
