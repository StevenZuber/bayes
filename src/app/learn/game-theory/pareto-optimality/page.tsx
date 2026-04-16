"use client";

import PayoffMatrix from "@/components/game/PayoffMatrix";
import LessonShell from "@/components/lesson/LessonShell";
import { gameScenarios } from "@/lib/game-scenarios";

const PD = gameScenarios[0];
const STAG = gameScenarios[1];

export default function ParetoOptimalityLesson() {
  const steps = [
    <StepIntro key="intro" />,
    <StepDefinition key="def" />,
    <StepPD key="pd" />,
    <StepStag key="stag" />,
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
        Pareto Optimality
      </div>
      <h2 className="text-3xl font-bold text-foreground mb-4">
        Rational isn&apos;t always efficient
      </h2>
      <div className="space-y-4 text-text-secondary">
        <p>
          Nash equilibrium answers: <em>what will rational players do?</em>{" "}
          Pareto optimality answers a different question:{" "}
          <em>is there a better outcome available?</em>
        </p>
        <p>
          These are separate questions. An outcome can be a Nash equilibrium and
          still be terrible for everyone. That&apos;s the core of the
          Prisoner&apos;s Dilemma — and it&apos;s why game theory is
          interesting.
        </p>
      </div>
    </div>
  );
}

function StepDefinition() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground mb-4">The definition</h2>
      <div className="space-y-4 text-text-secondary">
        <p>
          An outcome is <strong className="text-foreground">Pareto optimal</strong>{" "}
          (also called Pareto efficient) if there&apos;s no other outcome that
          makes at least one player better off{" "}
          <em>without making someone else worse off</em>.
        </p>
        <p>
          Informally: you can&apos;t find a free lunch. Any alternative hurts
          at least one person.
        </p>
        <p>
          Contrast with Nash equilibrium, which only asks about{" "}
          <em>unilateral</em> changes. Pareto comparisons consider{" "}
          <em>joint</em> changes — what if both players agreed to switch cells
          together?
        </p>
      </div>
    </div>
  );
}

function StepPD() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        The PD: Nash ≠ Pareto
      </h2>
      <p className="text-text-secondary mb-6 max-w-2xl">
        In the Prisoner&apos;s Dilemma, (Rat, Rat) is the Nash equilibrium — but
        (Silent, Silent) is Pareto optimal. Both players would strictly prefer
        to be there.
      </p>
      <div className="p-5 bg-surface rounded-xl border border-separator max-w-md">
        <PayoffMatrix scenario={PD} highlight="all" />
      </div>
      <div className="mt-6 max-w-2xl space-y-3 text-text-secondary">
        <p>
          Why can&apos;t rational players just agree on the Pareto-optimal cell?
          Because each one is tempted to cheat. From (Silent, Silent), either
          player can unilaterally improve their payoff by ratting — so the cell
          isn&apos;t a Nash equilibrium. Individual rationality pulls them away
          from the collectively efficient outcome.
        </p>
        <p>
          This is the textbook case of a{" "}
          <strong className="text-foreground">Pareto-dominated equilibrium</strong>
          : a stable outcome that&apos;s strictly worse than an alternative for
          everyone.
        </p>
      </div>
    </div>
  );
}

function StepStag() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        Stag Hunt: two equilibria, only one efficient
      </h2>
      <p className="text-text-secondary mb-6 max-w-2xl">
        The Stag Hunt has two Nash equilibria — (Stag, Stag) and (Hare, Hare) —
        but only (Stag, Stag) is Pareto optimal. (Hare, Hare) is stable but
        leaves value on the table.
      </p>
      <div className="p-5 bg-surface rounded-xl border border-separator max-w-md">
        <PayoffMatrix scenario={STAG} highlight="all" />
      </div>
      <p className="text-text-secondary mt-6 max-w-2xl">
        This is why institutions, contracts, and communication matter. They
        help players coordinate on the efficient equilibrium when multiple
        equilibria exist — or escape a dominated one.
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
          <strong className="text-foreground">Pareto optimal:</strong> no other
          outcome makes someone better off without making anyone worse off.
        </li>
        <li>
          <strong className="text-foreground">Nash equilibrium:</strong> no
          single player can improve by deviating alone.
        </li>
        <li>
          These are <em>independent</em> properties. A cell can be one, both,
          or neither.
        </li>
        <li>
          When Nash and Pareto disagree, you get interesting failures of
          collective rationality — arms races, tragedy of the commons, price
          wars.
        </li>
      </ul>
      <p className="text-text-secondary mt-6">
        In the sandbox, you can toggle Nash and Pareto highlights
        independently. Watch how editing payoffs moves the equilibria around —
        sometimes together, sometimes apart.
      </p>
    </div>
  );
}
