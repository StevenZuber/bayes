"use client";

import { useState, useCallback } from "react";
import IconArray from "@/components/visualizations/IconArray";
import AreaDiagram from "@/components/visualizations/AreaDiagram";
import FormulaDisplay from "@/components/visualizations/FormulaDisplay";
import ProbabilitySlider from "@/components/controls/ProbabilitySlider";
import ScenarioSelector from "@/components/controls/ScenarioSelector";
import { BayesParams, Scenario } from "@/types";
import { scenarios } from "@/lib/scenarios";
import { calculateBayes, formatPercent } from "@/lib/bayes";
import { useThemeColors } from "@/lib/theme-colors";

export default function ExploreBayesPage() {
  const [activeScenario, setActiveScenario] = useState<Scenario>(scenarios[0]);
  const [params, setParams] = useState<BayesParams>(scenarios[0].defaults);
  const [highlightPositives, setHighlightPositives] = useState(false);

  const result = calculateBayes(params);
  const colors = useThemeColors();

  const updateParam = useCallback(
    (key: keyof BayesParams) => (value: number) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleScenarioChange = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setParams(scenario.defaults);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bayes&apos; Theorem Explorer
        </h1>
        <p className="text-text-secondary">
          Adjust the parameters and watch all three visualizations update in
          real time.
        </p>
      </div>

      {/* Scenario selector */}
      <div className="mb-6">
        <div className="text-sm font-medium text-text-tertiary mb-2">Scenario</div>
        <ScenarioSelector
          activeId={activeScenario.id}
          onSelect={handleScenarioChange}
        />
        <p className="text-sm text-text-tertiary mt-2">
          {activeScenario.description}
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 p-5 bg-surface rounded-xl border border-separator">
        <ProbabilitySlider
          label="Prevalence"
          sublabel={`P(${activeScenario.conditionName})`}
          value={params.prevalence}
          onChange={updateParam("prevalence")}
          color={colors.accentRed}
        />
        <ProbabilitySlider
          label="Sensitivity"
          sublabel={`P(${activeScenario.positiveLabel}|${activeScenario.conditionName})`}
          value={params.sensitivity}
          onChange={updateParam("sensitivity")}
          color={colors.accentBlue}
        />
        <ProbabilitySlider
          label="Specificity"
          sublabel={`P(${activeScenario.negativeLabel}|No ${activeScenario.conditionName})`}
          value={params.specificity}
          onChange={updateParam("specificity")}
          color={colors.accentGray}
        />
      </div>

      {/* Posterior result */}
      <div className="text-center mb-8 p-5 bg-surface rounded-xl border border-separator">
        <div className="text-sm text-text-tertiary mb-1">
          P({activeScenario.conditionName} | {activeScenario.positiveLabel})
        </div>
        <div className="text-5xl font-bold font-mono" style={{ color: colors.accentPurple }}>
          {formatPercent(result.posterior)}
        </div>
        <div className="text-sm text-text-tertiary mt-1">
          Chance of actually having the condition given a positive result
        </div>
      </div>

      {/* Toggle */}
      <div className="flex justify-end mb-4">
        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={highlightPositives}
            onChange={(e) => setHighlightPositives(e.target.checked)}
            className="rounded border-separator bg-surface-elevated"
            style={{ accentColor: colors.accentIndigo }}
          />
          Highlight positive results only
        </label>
      </div>

      {/* Visualizations */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Icon Array */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-3">
            Population View
          </h3>
          <IconArray
            params={params}
            phase="full"
            highlightPositives={highlightPositives}
          />
        </div>

        {/* Area Diagram */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-3">
            Area Diagram
          </h3>
          <div className="mt-6">
            <AreaDiagram params={params} phase="full" />
          </div>
        </div>

        {/* Formula */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-3">
            The Math
          </h3>
          <FormulaDisplay params={params} mode="both" />
        </div>
      </div>
    </div>
  );
}
