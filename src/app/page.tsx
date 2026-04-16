import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">
          Seeing the Math
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Visual, interactive guides to ideas that are easier to see than to
          read. Build real intuition — not just memorize a formula.
        </p>
      </div>

      {/* Topics */}
      <div className="space-y-10">
        <Topic
          eyebrow="Probability"
          title="Bayes' Theorem"
          hook="A medical test is 99% accurate. You test positive. What are the chances you actually have the disease? Most people guess wrong — sometimes by a lot."
          learnHref="/learn/bayes"
          exploreHref="/explore/bayes"
        />
        <Topic
          eyebrow="Game Theory"
          title="Prisoner's Dilemma"
          hook="Two suspects, two rooms, one choice each. Acting rationally, both end up worse than if they'd cooperated. The simplest setup in game theory — and the most revealing."
          learnHref="/learn/game-theory"
          exploreHref="/explore/game-theory"
        />
      </div>

      {/* Footer hint */}
      <p className="text-center text-sm text-text-tertiary mt-16">
        No sign-ups. No tracking. Just math, made visible.
      </p>
    </div>
  );
}

function Topic({
  eyebrow,
  title,
  hook,
  learnHref,
  exploreHref,
}: {
  eyebrow: string;
  title: string;
  hook: string;
  learnHref: string;
  exploreHref: string;
}) {
  return (
    <section className="bg-surface rounded-2xl p-8 border border-separator">
      <div className="text-sm font-medium text-text-tertiary uppercase tracking-wide mb-1">
        {eyebrow}
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>
      <p className="text-text-secondary mb-6">{hook}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href={learnHref}
          className="group block p-4 rounded-xl border-2 border-separator hover:border-indigo-500 transition-colors bg-background"
        >
          <div className="text-sm font-medium text-indigo-400 mb-1">
            Guided lesson
          </div>
          <div className="text-foreground font-semibold group-hover:text-indigo-400 transition-colors">
            Learn from scratch →
          </div>
        </Link>
        <Link
          href={exploreHref}
          className="group block p-4 rounded-xl border-2 border-separator hover:border-purple-500 transition-colors bg-background"
        >
          <div className="text-sm font-medium text-purple-400 mb-1">
            Interactive sandbox
          </div>
          <div className="text-foreground font-semibold group-hover:text-purple-400 transition-colors">
            Explore freely →
          </div>
        </Link>
      </div>
    </section>
  );
}
