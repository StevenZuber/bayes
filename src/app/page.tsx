import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">
          Seeing Bayes
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          A visual, interactive guide to one of the most important ideas in
          probability. Build real intuition — not just memorize a formula.
        </p>
      </div>

      {/* The hook */}
      <div className="bg-surface rounded-2xl p-8 mb-16 border border-separator">
        <p className="text-lg text-text-secondary mb-4">
          A medical test is <strong className="text-foreground">99% accurate</strong>. You test positive.
        </p>
        <p className="text-2xl font-semibold text-foreground mb-4">
          What are the chances you actually have the disease?
        </p>
        <p className="text-text-tertiary">
          Most people say 99%. The real answer might surprise you. It depends on
          something most people forget to ask about.
        </p>
      </div>

      {/* Two paths */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/learn/bayes"
          className="group block p-6 rounded-xl border-2 border-separator hover:border-indigo-500 transition-colors bg-surface"
        >
          <div className="text-sm font-medium text-indigo-400 mb-2">
            Guided lesson
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-indigo-400 transition-colors">
            Learn from scratch
          </h2>
          <p className="text-text-secondary text-sm">
            A step-by-step walkthrough that builds your intuition visually
            before showing the formula. No math background needed.
          </p>
        </Link>

        <Link
          href="/explore/bayes"
          className="group block p-6 rounded-xl border-2 border-separator hover:border-purple-500 transition-colors bg-surface"
        >
          <div className="text-sm font-medium text-purple-400 mb-2">
            Interactive sandbox
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-purple-400 transition-colors">
            Explore freely
          </h2>
          <p className="text-text-secondary text-sm">
            Already know Bayes? Jump straight into the interactive
            visualizations. Adjust parameters and see the math come alive.
          </p>
        </Link>
      </div>

      {/* Footer hint */}
      <p className="text-center text-sm text-text-tertiary mt-16">
        No sign-ups. No tracking. Just math, made visible.
      </p>
    </div>
  );
}
