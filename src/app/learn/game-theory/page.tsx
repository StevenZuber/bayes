import Link from "next/link";

const LESSONS = [
  {
    slug: "prisoners-dilemma",
    eyebrow: "Start here",
    title: "Prisoner's Dilemma",
    description:
      "The classic setup — two players, one choice each, and a rational outcome that makes everyone worse off.",
  },
  {
    slug: "nash-equilibrium",
    eyebrow: "Concept",
    title: "Nash Equilibrium",
    description:
      "A deeper look at the solution concept behind the PD — and what happens when games have zero, one, or many equilibria.",
  },
  {
    slug: "pareto-optimality",
    eyebrow: "Concept",
    title: "Pareto Optimality",
    description:
      "Why the rational outcome isn't always the efficient one — and how to tell the difference.",
  },
];

export default function GameTheoryIndexPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-10">
        <div className="text-sm font-medium text-text-tertiary uppercase tracking-wide mb-2">
          Game Theory
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Lessons in strategic reasoning
        </h1>
        <p className="text-lg text-text-secondary">
          Short guided walkthroughs, one concept at a time. Start with the
          Prisoner&apos;s Dilemma — the concept lessons assume you&apos;ve done
          that one first.
        </p>
      </div>

      <ol className="space-y-4 list-none p-0">
        {LESSONS.map((lesson, i) => (
          <li key={lesson.slug}>
            <Link
              href={`/learn/game-theory/${lesson.slug}`}
              className="group flex gap-4 p-5 rounded-xl border-2 border-separator hover:border-indigo-500 transition-colors bg-surface"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center font-mono text-sm text-text-secondary">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-indigo-400 uppercase tracking-wide mb-1">
                  {lesson.eyebrow}
                </div>
                <div className="text-lg font-semibold text-foreground group-hover:text-indigo-400 transition-colors">
                  {lesson.title}
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  {lesson.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <div className="mt-10 p-5 rounded-xl border border-separator bg-surface">
        <div className="text-sm font-medium text-text-tertiary uppercase tracking-wide mb-1">
          Prefer to experiment?
        </div>
        <p className="text-text-secondary mb-3">
          Skip the lessons and head to the sandbox. Edit payoffs, pit strategies
          against each other, and see the analysis update live.
        </p>
        <Link
          href="/explore/game-theory"
          className="inline-flex items-center min-h-[44px] px-4 py-2 text-sm font-medium text-white rounded-lg bg-accent-strong"
        >
          Open the sandbox →
        </Link>
      </div>
    </div>
  );
}
