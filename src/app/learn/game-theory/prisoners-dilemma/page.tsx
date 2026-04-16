"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PayoffMatrix from "@/components/game/PayoffMatrix";
import StrategyTimeline from "@/components/game/StrategyTimeline";
import TournamentResults from "@/components/game/TournamentResults";
import LessonShell from "@/components/lesson/LessonShell";
import { gameScenarios } from "@/lib/game-scenarios";
import { STRATEGIES, getStrategy, playMatch, runTournament } from "@/lib/strategies";
import type { Action } from "@/types/game";
import { useThemeColors } from "@/lib/theme-colors";

const PD = gameScenarios[0];

export default function LearnPrisonersDilemmaPage() {
  const [userChoice, setUserChoice] = useState<Action | null>(null);
  const [hasLockedIn, setHasLockedIn] = useState(false);

  const steps = [
    <StepHook key="hook" />,
    <StepChoice
      key="choice"
      choice={userChoice}
      setChoice={setUserChoice}
      hasLockedIn={hasLockedIn}
      lockIn={() => userChoice && setHasLockedIn(true)}
    />,
    <StepMatrix key="matrix" />,
    <StepDominant key="dominant" />,
    <StepNash key="nash" userChoice={userChoice} />,
    <StepParadox key="paradox" />,
    <StepIterated key="iterated" />,
    <StepTournament key="tournament" />,
  ];

  return (
    <LessonShell
      steps={steps}
      finish={{ label: "Open sandbox", href: "/explore/game-theory" }}
    />
  );
}

/* ============================================================
 * Steps
 * ============================================================ */

function StepHook() {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground mb-6">
        Two suspects. One choice.
      </h2>
      <div className="bg-surface rounded-2xl p-8 text-left border border-separator">
        <p className="text-lg text-text-secondary mb-4">
          You and your partner are arrested and held in{" "}
          <strong className="text-foreground">separate rooms</strong>. The
          prosecutor offers each of you the same deal.
        </p>
        <ul className="text-lg text-text-secondary mb-4 ml-4 space-y-2 list-disc">
          <li>
            If you both <strong className="text-foreground">stay silent</strong>,
            you each get 1 year. (A good outcome.)
          </li>
          <li>
            If you both <strong className="text-foreground">rat out</strong> the
            other, you each get 3 years.
          </li>
          <li>
            If one rats and the other stays silent, the{" "}
            <strong className="text-foreground">rat walks free</strong> and the{" "}
            silent one gets 5 years.
          </li>
        </ul>
        <p className="text-xl font-semibold text-foreground">
          You can&apos;t talk to your partner. What do you do?
        </p>
      </div>
    </div>
  );
}

function StepChoice({
  choice,
  setChoice,
  hasLockedIn,
  lockIn,
}: {
  choice: Action | null;
  setChoice: (a: Action) => void;
  hasLockedIn: boolean;
  lockIn: () => void;
}) {
  const colors = useThemeColors();
  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground mb-4">Make your choice</h2>
      <p className="text-lg text-text-secondary mb-8">
        Imagine you&apos;re in the room. No information about your partner. Pick
        one.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
        <ChoiceButton
          label={PD.labels.cooperate}
          sublabel="Cooperate (C)"
          selected={choice === "C"}
          disabled={hasLockedIn}
          onClick={() => setChoice("C")}
          color={colors.accentBlue}
        />
        <ChoiceButton
          label={PD.labels.defect}
          sublabel="Defect (D)"
          selected={choice === "D"}
          disabled={hasLockedIn}
          onClick={() => setChoice("D")}
          color={colors.accentOrange}
        />
      </div>

      {!hasLockedIn ? (
        <button
          onClick={lockIn}
          disabled={!choice}
          className="mt-6 min-h-[44px] px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-40"
          style={{ backgroundColor: colors.accentIndigo }}
        >
          Lock in my choice
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-surface rounded-xl border border-separator max-w-md mx-auto"
        >
          <p className="text-text-secondary">
            You chose{" "}
            <strong className="text-foreground">
              {choice === "C" ? PD.labels.cooperate : PD.labels.defect}
            </strong>
            . Hold onto that. Let&apos;s see what the math says.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function ChoiceButton({
  label,
  sublabel,
  selected,
  disabled,
  onClick,
  color,
}: {
  label: string;
  sublabel: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className="min-h-[88px] p-4 rounded-xl border-2 transition-all disabled:opacity-80 disabled:cursor-not-allowed"
      style={{
        borderColor: selected ? color : "var(--separator)",
        backgroundColor: selected ? `${color}22` : "var(--surface)",
      }}
    >
      <div className="text-lg font-semibold text-foreground">{label}</div>
      <div className="text-xs text-text-tertiary mt-1">{sublabel}</div>
    </button>
  );
}

function StepMatrix() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">The payoff matrix</h2>
      <p className="text-lg text-text-secondary mb-6 max-w-2xl">
        Game theorists pack the whole situation into a single grid. Rows are
        your choice. Columns are your partner&apos;s. Each cell shows the payoff:
        <span style={{ color: "var(--color-accent-strong)" }}> (your payoff, their payoff)</span>.
      </p>
      <p className="text-sm text-text-tertiary mb-6 max-w-2xl">
        Higher numbers are better. Think of them as &quot;years of freedom
        saved&quot;: 5 = walks free, 0 = 5 years in prison.
      </p>

      <div className="flex justify-center">
        <div className="p-6 bg-surface rounded-2xl border border-separator">
          <PayoffMatrix scenario={PD} highlight="none" />
        </div>
      </div>

      <div className="mt-6 max-w-2xl mx-auto text-text-secondary">
        <p>
          Read a cell like coordinates. Top-left: both stay silent → each gets 3.
          Bottom-right: both rat → each gets 1. Off-diagonal cells are the
          asymmetric outcomes.
        </p>
      </div>
    </div>
  );
}

function StepDominant() {
  const colors = useThemeColors();
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        Look at your row
      </h2>
      <p className="text-lg text-text-secondary mb-6 max-w-2xl">
        Pretend your partner&apos;s decision is locked in. Compare your two
        options.
      </p>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="p-5 bg-surface rounded-xl border border-separator">
          <div className="text-sm text-text-tertiary uppercase tracking-wide mb-2">
            If they stay silent
          </div>
          <div className="text-text-secondary space-y-1">
            <div>
              You stay silent → you get{" "}
              <strong className="text-foreground">3</strong>
            </div>
            <div>
              You rat → you get <strong className="text-foreground">5</strong>
            </div>
          </div>
          <div className="mt-3 text-sm font-semibold" style={{ color: colors.accentOrange }}>
            Ratting is better by 2.
          </div>
        </div>

        <div className="p-5 bg-surface rounded-xl border border-separator">
          <div className="text-sm text-text-tertiary uppercase tracking-wide mb-2">
            If they rat
          </div>
          <div className="text-text-secondary space-y-1">
            <div>
              You stay silent → you get{" "}
              <strong className="text-foreground">0</strong>
            </div>
            <div>
              You rat → you get <strong className="text-foreground">1</strong>
            </div>
          </div>
          <div className="mt-3 text-sm font-semibold" style={{ color: colors.accentOrange }}>
            Ratting is better by 1.
          </div>
        </div>
      </div>

      <div className="mt-8 p-5 bg-surface rounded-xl border-2" style={{ borderColor: colors.accentOrange }}>
        <p className="text-foreground font-medium">
          No matter what your partner does, you&apos;re better off ratting. This
          is called a{" "}
          <strong>dominant strategy</strong>. And by symmetry, it&apos;s also
          true for your partner.
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="p-5 bg-surface rounded-xl border border-separator">
          <PayoffMatrix scenario={PD} highlight="dominant-row" />
          <p className="text-xs text-text-tertiary text-center mt-3">
            Your dominant row is highlighted.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepNash({ userChoice }: { userChoice: Action | null }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        Both rational players end up here
      </h2>
      <p className="text-lg text-text-secondary mb-6 max-w-2xl">
        If both players follow their dominant strategy, they both rat. That cell
        — (D, D) — is a <strong className="text-foreground">Nash equilibrium</strong>
        : neither player regrets their choice given what the other did.
      </p>

      <div className="flex justify-center mb-6">
        <div className="p-5 bg-surface rounded-xl border border-separator">
          <PayoffMatrix scenario={PD} highlight="nash" />
        </div>
      </div>

      {userChoice && (
        <div className="max-w-xl mx-auto p-4 bg-surface rounded-xl border border-separator">
          <p className="text-text-secondary">
            You picked{" "}
            <strong className="text-foreground">
              {userChoice === "C" ? PD.labels.cooperate : PD.labels.defect}
            </strong>
            .{" "}
            {userChoice === "D" ? (
              <>
                That&apos;s the dominant-strategy answer. Rational — but read
                on, because it&apos;s also how both players end up with a{" "}
                <em>worse</em> outcome than if they&apos;d both stayed silent.
              </>
            ) : (
              <>
                You chose the cooperative path. It&apos;s the socially better
                choice — but it&apos;s not a Nash equilibrium. If your partner
                reasons like step 3, they&apos;ll rat, and you&apos;ll take the
                worst outcome.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

function StepParadox() {
  const colors = useThemeColors();
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        The paradox
      </h2>
      <p className="text-lg text-text-secondary mb-6 max-w-2xl">
        Both players, acting rationally, land at (1, 1). But (3, 3) was
        available — and strictly better for both. The Nash equilibrium is not
        Pareto optimal. That&apos;s the paradox.
      </p>

      <div className="flex justify-center mb-6">
        <div className="p-5 bg-surface rounded-xl border border-separator">
          <PayoffMatrix scenario={PD} highlight="all" />
          <div className="mt-3 flex gap-4 text-xs justify-center">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: colors.accentRed }} />
              Nash equilibrium
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: colors.accentBlue }} />
              Pareto optimal
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-3 text-text-secondary">
        <p>
          Individual rationality (&quot;always defect&quot;) produces collective
          irrationality (everyone loses). This one cell is where cartels break
          down, arms races start, and the tragedy of the commons lives.
        </p>
        <p>
          And yet — in the real world, people cooperate all the time. What
          changes?
        </p>
      </div>
    </div>
  );
}

function StepIterated() {
  const rounds = 20;
  const match = useMemo(() => {
    const row = getStrategy("tit-for-tat");
    const col = getStrategy("always-defect");
    return playMatch(row, col, PD.matrix, rounds);
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        What if you play again tomorrow?
      </h2>
      <p className="text-lg text-text-secondary mb-6 max-w-2xl">
        When the game repeats, defection has a cost — your opponent can
        retaliate next round. Suddenly cooperation becomes sustainable.
      </p>

      <div className="mb-6 max-w-2xl space-y-2 text-text-secondary">
        <p>
          A famous strategy is <strong className="text-foreground">Tit for Tat</strong>:
          start by cooperating, then just copy whatever your opponent did last
          round. It&apos;s nice, retaliatory, forgiving, and clear.
        </p>
        <p>
          Here&apos;s Tit for Tat (row) versus Always Defect (column) over 20
          rounds:
        </p>
      </div>

      <div className="p-5 bg-surface rounded-xl border border-separator">
        <StrategyTimeline
          rounds={match.rounds}
          rowLabel="Tit for Tat"
          colLabel="Always Defect"
        />
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xs text-text-tertiary">Tit for Tat</div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {match.rowScore}
            </div>
          </div>
          <div>
            <div className="text-xs text-text-tertiary">Always Defect</div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {match.colScore}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-text-secondary max-w-2xl">
        Tit for Tat loses the first round, then mirrors every defection. It never
        wins a match outright — but as you&apos;ll see next, it wins the
        tournament.
      </p>
    </div>
  );
}

function StepTournament() {
  const tournament = useMemo(() => runTournament(STRATEGIES, PD.matrix, 50), []);
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        The tournament
      </h2>
      <p className="text-lg text-text-secondary mb-6 max-w-2xl">
        In 1980, Robert Axelrod ran a round-robin tournament of strategies for
        the iterated prisoner&apos;s dilemma. The winner surprised everyone: the
        simplest, nicest strategy — Tit for Tat. Here&apos;s a mini version
        (50 rounds per matchup):
      </p>

      <div className="p-5 bg-surface rounded-xl border border-separator">
        <TournamentResults result={tournament} strategies={STRATEGIES} />
      </div>

      <div className="mt-6 max-w-2xl text-text-secondary space-y-3">
        <p>
          The takeaway isn&apos;t that cooperation is always right. It&apos;s
          that the structure of the game — one-shot vs. repeated, anonymous vs.
          identifiable, finite vs. open-ended — completely changes what rational
          play looks like.
        </p>
        <p>
          Head to the sandbox to edit the payoffs, pit strategies against each
          other, and see when cooperation breaks down.
        </p>
      </div>
    </div>
  );
}
