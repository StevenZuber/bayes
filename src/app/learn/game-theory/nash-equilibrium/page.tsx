"use client";

import PayoffMatrix from "@/components/game/PayoffMatrix";
import LessonShell from "@/components/lesson/LessonShell";
import { gameScenarios } from "@/lib/game-scenarios";

const PD = gameScenarios.find((s) => s.id === "prisoners-dilemma")!;
const STAG = gameScenarios.find((s) => s.id === "stag-hunt")!;
const CHICKEN = gameScenarios.find((s) => s.id === "chicken")!;
const MATCHING_PENNIES = gameScenarios.find((s) => s.id === "matching-pennies")!;

export default function NashEquilibriumLesson() {
  const steps = [
    <StepIntro key="intro" />,
    <StepOne key="one" />,
    <StepMany key="many" />,
    <StepNone key="none" />,
    <StepRecap key="recap" />,
  ];
  return (
    <LessonShell
      steps={steps}
      finish={{ label: "Open sandbox", href: "/explore/game-theory" }}
    />
  );
}

function StepIntro() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-sm font-medium text-text-tertiary uppercase tracking-wide mb-2">
        Nash Equilibrium
      </div>
      <h2 className="text-3xl font-bold text-foreground mb-4">
        What is it, exactly?
      </h2>
      <div className="space-y-4 text-text-secondary">
        <p>
          A <strong className="text-foreground">Nash equilibrium</strong> is a
          set of choices — one per player — where{" "}
          <em>no one can improve their payoff by changing their choice alone</em>
          , assuming the others stick with theirs.
        </p>
        <p>
          Think of it as a stable resting point. Even if it&apos;s not the best
          outcome collectively, nobody has a personal reason to move.
        </p>
        <p>
          The tricky part: games can have <strong>zero, one, or many</strong>{" "}
          pure-strategy Nash equilibria. The rest of this lesson walks through
          each case.
        </p>
      </div>
    </div>
  );
}

function StepOne() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        One equilibrium: the Prisoner&apos;s Dilemma
      </h2>
      <p className="text-text-secondary mb-6 max-w-2xl">
        The PD has exactly one Nash equilibrium — (Rat out, Rat out). From that
        cell, if either player switches to staying silent, they do worse (0
        instead of 1). Nobody moves.
      </p>
      <div className="p-5 bg-surface rounded-xl border border-separator max-w-md">
        <PayoffMatrix scenario={PD} highlight="nash" />
      </div>
      <p className="text-text-secondary mt-6 max-w-2xl">
        The existence of a dominant strategy for both players is one way to{" "}
        <em>guarantee</em> a unique Nash equilibrium. But dominance isn&apos;t
        required — next game shows that.
      </p>
    </div>
  );
}

function StepMany() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        Many equilibria: the Stag Hunt
      </h2>
      <p className="text-text-secondary mb-6 max-w-2xl">
        Two hunters choose between chasing a stag (needs both) or a hare (solo,
        guaranteed smaller prize). Two Nash equilibria exist:
      </p>
      <ul className="text-text-secondary mb-6 max-w-2xl list-disc ml-6 space-y-1">
        <li>
          Both hunt stag — the best outcome, but requires trusting the other.
        </li>
        <li>
          Both hunt hare — safe, but leaves value on the table.
        </li>
      </ul>
      <div className="p-5 bg-surface rounded-xl border border-separator max-w-md">
        <PayoffMatrix scenario={STAG} highlight="nash" />
      </div>
      <p className="text-text-secondary mt-6 max-w-2xl">
        Neither player has a dominant strategy. The game has a{" "}
        <strong className="text-foreground">coordination problem</strong>: which
        equilibrium you land on depends on expectations, not just payoffs.
      </p>

      <h3 className="text-xl font-bold text-foreground mt-10 mb-3">
        Asymmetric: Chicken
      </h3>
      <p className="text-text-secondary mb-6 max-w-2xl">
        Two drivers race toward each other. Swerving loses face; staying straight
        risks a crash. Chicken has two Nash equilibria, but they&apos;re
        asymmetric — one player dominates the other.
      </p>
      <div className="p-5 bg-surface rounded-xl border border-separator max-w-md">
        <PayoffMatrix scenario={CHICKEN} highlight="nash" />
      </div>
    </div>
  );
}

function StepNone() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        No pure equilibrium: Matching Pennies
      </h2>
      <p className="text-text-secondary mb-6 max-w-2xl">
        Some games have no stable pure strategy. Matching Pennies is the
        classic: you win if the pennies match, I win if they don&apos;t.
        Whatever you choose, I want to switch — and vice versa.
      </p>
      <div className="p-5 bg-surface rounded-xl border border-separator max-w-md">
        <PayoffMatrix scenario={MATCHING_PENNIES} highlight="nash" showLegend />
      </div>
      <p className="text-text-secondary mt-6 max-w-2xl">
        No Nash markers anywhere — because there aren&apos;t any pure Nash
        equilibria to mark. The solution involves{" "}
        <strong className="text-foreground">mixed strategies</strong> (each
        player randomizes 50/50), but that&apos;s beyond this lesson. Point is:
        purely deterministic play doesn&apos;t always settle.
      </p>
    </div>
  );
}

function StepRecap() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground mb-4">Recap</h2>
      <ul className="space-y-3 text-text-secondary">
        <li>
          <strong className="text-foreground">Nash equilibrium:</strong> nobody
          can improve by unilaterally deviating.
        </li>
        <li>
          <strong className="text-foreground">One:</strong> Prisoner&apos;s
          Dilemma. Everyone ends up at the unique stable point, even if it
          isn&apos;t the best for either.
        </li>
        <li>
          <strong className="text-foreground">Many:</strong> Stag Hunt, Chicken.
          Multiple stable points; coordination or bargaining decides which.
        </li>
        <li>
          <strong className="text-foreground">None (pure):</strong> Matching
          Pennies. Requires mixed strategies to stabilize.
        </li>
      </ul>
      <p className="text-text-secondary mt-6">
        Next: once you find a Nash equilibrium, is it actually <em>good</em>?
        That&apos;s Pareto optimality — the next lesson.
      </p>
    </div>
  );
}
