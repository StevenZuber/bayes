"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import IconArray from "@/components/visualizations/IconArray";
import AreaDiagram from "@/components/visualizations/AreaDiagram";
import FormulaDisplay from "@/components/visualizations/FormulaDisplay";
import ProbabilitySlider from "@/components/controls/ProbabilitySlider";
import { BayesParams } from "@/types";
import { calculateBayes, formatPercent } from "@/lib/bayes";
import { useThemeColors } from "@/lib/theme-colors";

const INITIAL_PARAMS: BayesParams = {
  prevalence: 0.01,
  sensitivity: 0.99,
  specificity: 0.95,
};

const TOTAL_STEPS = 9;

export default function LearnBayesPage() {
  const [step, setStep] = useState(0);
  const [params, setParams] = useState<BayesParams>(INITIAL_PARAMS);
  const [userGuess, setUserGuess] = useState<number | null>(null);
  const [hasGuessed, setHasGuessed] = useState(false);

  const result = calculateBayes(params);
  const colors = useThemeColors();

  const updateParam = useCallback(
    (key: keyof BayesParams) => (value: number) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submitGuess = () => {
    if (userGuess !== null) setHasGuessed(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-text-tertiary mb-1">
          <span>
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: colors.accentIndigo }}
            initial={false}
            animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && <StepHook />}
          {step === 1 && (
            <StepGuess
              userGuess={userGuess}
              setUserGuess={setUserGuess}
              hasGuessed={hasGuessed}
              submitGuess={submitGuess}
              actual={result.posterior}
            />
          )}
          {step === 2 && <StepPopulation params={params} />}
          {step === 3 && (
            <StepPrior
              params={params}
              updatePrevalence={updateParam("prevalence")}
            />
          )}
          {step === 4 && (
            <StepEvidence
              params={params}
              updateSensitivity={updateParam("sensitivity")}
              updateSpecificity={updateParam("specificity")}
            />
          )}
          {step === 5 && <StepReveal params={params} result={result} />}
          {step === 6 && (
            <StepWhyItMatters
              params={params}
              updatePrevalence={updateParam("prevalence")}
            />
          )}
          {step === 7 && <StepFormula params={params} />}
          {step === 8 && (
            <StepSandbox
              params={params}
              updatePrevalence={updateParam("prevalence")}
              updateSensitivity={updateParam("sensitivity")}
              updateSpecificity={updateParam("specificity")}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t border-separator">
        <button
          onClick={prev}
          disabled={step === 0}
          className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step
                  ? "bg-indigo-500"
                  : i < step
                    ? "bg-indigo-800"
                    : "bg-surface-elevated"
              }`}
            />
          ))}
        </div>
        {step < TOTAL_STEPS - 1 ? (
          <button
            onClick={next}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: colors.accentIndigo }}
          >
            Continue
          </button>
        ) : (
          <Link
            href="/explore/bayes"
            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: colors.accentPurple }}
          >
            Open sandbox
          </Link>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Individual step components
 * ============================================================ */

function StepHook() {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground mb-6">
        Let&apos;s start with a question
      </h2>
      <div className="bg-surface rounded-2xl p-8 text-left border border-separator">
        <p className="text-lg text-text-secondary mb-4">
          A disease affects <strong className="text-foreground">1 in 100</strong> people.
        </p>
        <p className="text-lg text-text-secondary mb-4">
          There&apos;s a test for this disease. It&apos;s highly accurate:
        </p>
        <ul className="text-lg text-text-secondary mb-4 ml-4 space-y-1">
          <li>
            If you <em>have</em> the disease, it correctly says &quot;positive&quot;{" "}
            <strong className="text-foreground">99%</strong> of the time.
          </li>
          <li>
            If you <em>don&apos;t</em> have it, it correctly says
            &quot;negative&quot; <strong className="text-foreground">95%</strong> of the time.
          </li>
        </ul>
        <p className="text-xl font-semibold text-foreground">
          You take the test. It comes back positive.
        </p>
      </div>
    </div>
  );
}

function StepGuess({
  userGuess,
  setUserGuess,
  hasGuessed,
  submitGuess,
  actual,
}: {
  userGuess: number | null;
  setUserGuess: (v: number) => void;
  hasGuessed: boolean;
  submitGuess: () => void;
  actual: number;
}) {
  const colors = useThemeColors();
  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground mb-4">
        What do you think?
      </h2>
      <p className="text-lg text-text-secondary mb-8">
        Given a positive test result, how likely is it that you actually have the
        disease?
      </p>

      <div className="max-w-md mx-auto">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={userGuess ?? 50}
          onChange={(e) => setUserGuess(parseInt(e.target.value))}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: colors.accentIndigo, color: colors.accentIndigo }}
        />
        <div className="text-4xl font-bold mt-4 font-mono" style={{ color: colors.accentIndigo }}>
          {userGuess ?? 50}%
        </div>
        <p className="text-sm text-text-tertiary mt-1">
          Drag the slider to make your guess
        </p>

        {!hasGuessed ? (
          <button
            onClick={submitGuess}
            className="mt-6 px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: colors.accentIndigo }}
          >
            Lock in my guess
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-surface rounded-xl border border-separator"
          >
            <p className="text-text-secondary">
              You guessed <strong className="text-foreground">{userGuess}%</strong>. The actual answer is
              about <strong className="text-foreground">{formatPercent(actual)}</strong>.
            </p>
            {actual < 0.5 && (
              <p className="text-text-tertiary mt-2 text-sm">
                Surprised? Most people are. Let&apos;s see why.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function StepPopulation({ params }: { params: BayesParams }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        Imagine 1,000 people
      </h2>
      <p className="text-lg text-text-secondary mb-8 max-w-2xl">
        Instead of thinking in percentages, let&apos;s think in people. Here are
        1,000 individuals. Each dot is one person.
      </p>
      <div className="flex justify-center">
        <IconArray params={params} phase="population" />
      </div>
    </div>
  );
}

function StepPrior({
  params,
  updatePrevalence,
}: {
  params: BayesParams;
  updatePrevalence: (v: number) => void;
}) {
  const colors = useThemeColors();
  const withCondition = Math.round(1000 * params.prevalence);
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        How common is the disease?
      </h2>
      <p className="text-lg text-text-secondary mb-4 max-w-2xl">
        The disease affects {formatPercent(params.prevalence)} of the population.
        Out of 1,000 people, that&apos;s about{" "}
        <strong style={{ color: colors.accentRed }}>{withCondition}</strong>{" "}
        {withCondition === 1 ? "person" : "people"} with the disease. This is
        the <em>base rate</em> — and it&apos;s the key that most people overlook.
      </p>

      <div className="mb-6 max-w-sm">
        <ProbabilitySlider
          label="Prevalence"
          sublabel="P(Disease)"
          value={params.prevalence}
          onChange={updatePrevalence}
          color={colors.accentRed}
        />
        <p className="text-xs text-text-tertiary mt-1">
          Try dragging this. Watch how few dots turn red.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <IconArray params={params} phase="prior" />
        <AreaDiagram params={params} phase="prior" />
      </div>
    </div>
  );
}

function StepEvidence({
  params,
  updateSensitivity,
  updateSpecificity,
}: {
  params: BayesParams;
  updateSensitivity: (v: number) => void;
  updateSpecificity: (v: number) => void;
}) {
  const colors = useThemeColors();
  const result = calculateBayes(params);
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        Now, apply the test
      </h2>
      <p className="text-lg text-text-secondary mb-4 max-w-2xl">
        Everyone takes the test. It&apos;s good but not perfect — it has two
        properties:
      </p>
      <ul className="text-text-secondary mb-6 ml-4 space-y-2 max-w-2xl">
        <li>
          <strong className="text-foreground">Sensitivity</strong> ({formatPercent(params.sensitivity)}):
          Of the {result.truePositives + result.falseNegatives} sick people, the
          test correctly flags{" "}
          <span className="font-semibold" style={{ color: colors.accentRed }}>
            {result.truePositives}
          </span>{" "}
          as positive.
        </li>
        <li>
          <strong className="text-foreground">Specificity</strong> ({formatPercent(params.specificity)}):
          Of the {result.trueNegatives + result.falsePositives} healthy people,
          the test incorrectly flags{" "}
          <span className="font-semibold" style={{ color: colors.accentOrange }}>
            {result.falsePositives}
          </span>{" "}
          as positive.
        </li>
      </ul>

      <div className="grid md:grid-cols-2 gap-4 mb-6 max-w-lg">
        <ProbabilitySlider
          label="Sensitivity"
          sublabel="P(+|Disease)"
          value={params.sensitivity}
          onChange={updateSensitivity}
          color={colors.accentRed}
        />
        <ProbabilitySlider
          label="Specificity"
          sublabel="P(−|Healthy)"
          value={params.specificity}
          onChange={updateSpecificity}
          color={colors.accentGray}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <IconArray params={params} phase="evidence" />
        <AreaDiagram params={params} phase="evidence" />
      </div>
    </div>
  );
}

function StepReveal({
  params,
  result,
}: {
  params: BayesParams;
  result: ReturnType<typeof calculateBayes>;
}) {
  const colors = useThemeColors();
  const totalPositive = result.truePositives + result.falsePositives;
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        The reveal: look at who tested positive
      </h2>
      <p className="text-lg text-text-secondary mb-6 max-w-2xl">
        Now let&apos;s dim everyone who tested negative and focus on the
        positive results.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-start mb-8">
        <IconArray params={params} phase="full" highlightPositives />
        <div>
          <AreaDiagram params={params} phase="full" />
          <div className="mt-6 p-4 bg-surface rounded-xl border border-separator">
            <p className="text-foreground font-medium mb-2">
              Out of <strong>{totalPositive}</strong> positive results:
            </p>
            <ul className="space-y-1 text-text-secondary">
              <li>
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors.tp }} />
                <strong className="text-foreground">{result.truePositives}</strong> actually have the
                disease (true positives)
              </li>
              <li>
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors.fp }} />
                <strong className="text-foreground">{result.falsePositives}</strong> are healthy but got a
                wrong result (false positives)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center p-6 bg-surface rounded-2xl max-w-lg mx-auto border border-separator">
        <p className="text-text-secondary mb-2">
          The probability you actually have the disease given a positive test:
        </p>
        <p className="text-4xl font-bold font-mono" style={{ color: colors.accentPurple }}>
          {result.truePositives} / {totalPositive} ={" "}
          {formatPercent(result.posterior)}
        </p>
      </div>
    </div>
  );
}

function StepWhyItMatters({
  params,
  updatePrevalence,
}: {
  params: BayesParams;
  updatePrevalence: (v: number) => void;
}) {
  const colors = useThemeColors();
  const result = calculateBayes(params);
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        Why is the answer so low?
      </h2>
      <div className="max-w-2xl space-y-4 text-text-secondary mb-6">
        <p>
          The disease is <strong className="text-foreground">rare</strong>. Out of 1,000 people, only about{" "}
          {Math.round(1000 * params.prevalence)} have it. Even a very
          accurate test will produce more false positives than true positives
          when the condition is rare — because there are so many more healthy
          people to falsely flag.
        </p>
        <p>
          This is called <strong className="text-foreground">base rate neglect</strong>: the tendency to
          ignore how common or rare something is when evaluating evidence.
        </p>
        <p>
          Try increasing the prevalence below and watch the posterior climb.
          When the disease is common, the test becomes much more informative.
        </p>
      </div>

      <div className="mb-6 max-w-sm">
        <ProbabilitySlider
          label="Prevalence"
          sublabel="Try increasing this"
          value={params.prevalence}
          onChange={updatePrevalence}
          color={colors.accentRed}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <IconArray params={params} phase="full" highlightPositives />
        <div>
          <AreaDiagram params={params} phase="full" />
          <p className="mt-3 text-center text-sm text-text-secondary">
            Posterior: <strong className="text-foreground">{formatPercent(result.posterior)}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

function StepFormula({ params }: { params: BayesParams }) {
  const colors = useThemeColors();
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        The formula behind the intuition
      </h2>
      <div className="max-w-2xl space-y-4 text-text-secondary mb-8">
        <p>
          Everything you just saw — the population, the splits, the count — is
          captured by a single equation. <strong className="text-foreground">Bayes&apos; Theorem</strong>:
        </p>
      </div>

      {/* Big symbolic formula */}
      <div className="flex justify-center mb-8">
        <div className="inline-block bg-surface rounded-2xl p-8 text-center border border-separator">
          <div className="text-2xl font-mono flex items-center gap-2 flex-wrap justify-center">
            <span className="font-bold" style={{ color: colors.accentPurple }}>P(A|B)</span>
            <span className="text-text-tertiary">=</span>
            <div className="inline-flex flex-col items-center">
              <div className="border-b-2 border-text-tertiary pb-1 px-3">
                <span style={{ color: colors.accentRed }}>P(B|A)</span>
                <span className="text-text-tertiary mx-1">&middot;</span>
                <span style={{ color: colors.accentRed }}>P(A)</span>
              </div>
              <div className="pt-1 px-3">
                <span className="text-text-secondary">P(B)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map each term */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
          <span className="font-mono font-bold" style={{ color: colors.accentPurple }}>P(A|B)</span>
          <span className="text-text-secondary">
            The <strong className="text-foreground">posterior</strong> — what we want. Probability of having
            the disease given a positive test.
          </span>

          <span className="font-mono font-bold" style={{ color: colors.accentRed }}>P(A)</span>
          <span className="text-text-secondary">
            The <strong className="text-foreground">prior</strong> — how common the disease is before any
            testing. The base rate. This is the prevalence slider.
          </span>

          <span className="font-mono font-bold" style={{ color: colors.accentRed }}>P(B|A)</span>
          <span className="text-text-secondary">
            The <strong className="text-foreground">likelihood</strong> — how likely a positive test is if
            you actually have the disease. This is sensitivity.
          </span>

          <span className="font-mono font-bold text-text-secondary">P(B)</span>
          <span className="text-text-secondary">
            The <strong className="text-foreground">total evidence</strong> — the overall rate of positive
            tests (true positives + false positives). This is the normalizing
            factor.
          </span>
        </div>
      </div>

      <div className="mt-8 max-w-md mx-auto">
        <FormulaDisplay params={params} mode="both" />
      </div>
    </div>
  );
}

function StepSandbox({
  params,
  updatePrevalence,
  updateSensitivity,
  updateSpecificity,
}: {
  params: BayesParams;
  updatePrevalence: (v: number) => void;
  updateSensitivity: (v: number) => void;
  updateSpecificity: (v: number) => void;
}) {
  const colors = useThemeColors();
  const result = calculateBayes(params);
  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-3">
        Now play with it
      </h2>
      <p className="text-lg text-text-secondary mb-6 max-w-2xl">
        All controls are unlocked. Adjust any parameter and see how
        everything is connected. Or head to the full sandbox for scenario
        presets.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl">
        <ProbabilitySlider
          label="Prevalence"
          sublabel="P(A)"
          value={params.prevalence}
          onChange={updatePrevalence}
          color={colors.accentRed}
        />
        <ProbabilitySlider
          label="Sensitivity"
          sublabel="P(B|A)"
          value={params.sensitivity}
          onChange={updateSensitivity}
          color={colors.accentRed}
        />
        <ProbabilitySlider
          label="Specificity"
          sublabel="P(¬B|¬A)"
          value={params.specificity}
          onChange={updateSpecificity}
          color={colors.accentGray}
        />
      </div>

      <div className="text-center mb-6 p-4 bg-surface rounded-xl border border-separator">
        <span className="text-text-secondary">P(A|B) = </span>
        <span className="text-3xl font-bold font-mono" style={{ color: colors.accentPurple }}>
          {formatPercent(result.posterior)}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <IconArray params={params} phase="full" highlightPositives />
        <div>
          <AreaDiagram params={params} phase="full" />
          <div className="mt-6">
            <FormulaDisplay params={params} mode="numeric" />
          </div>
        </div>
      </div>
    </div>
  );
}
