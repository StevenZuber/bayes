import { BayesParams, BayesResult } from "@/types";

/**
 * Calculate Bayes' theorem results using natural frequencies.
 * This mirrors how the visualization works: start with a population,
 * split by condition, then split by test result.
 */
export function calculateBayes(
  params: BayesParams,
  population: number = 1000
): BayesResult {
  const { prevalence, sensitivity, specificity } = params;

  const withCondition = population * prevalence;
  const withoutCondition = population - withCondition;

  const truePositives = withCondition * sensitivity;
  const falseNegatives = withCondition - truePositives;
  const falsePositives = withoutCondition * (1 - specificity);
  const trueNegatives = withoutCondition - falsePositives;

  const totalPositive = truePositives + falsePositives;
  const posterior = totalPositive > 0 ? truePositives / totalPositive : 0;

  return {
    posterior,
    pPositive: totalPositive / population,
    truePositives: Math.round(truePositives),
    falsePositives: Math.round(falsePositives),
    trueNegatives: Math.round(trueNegatives),
    falseNegatives: Math.round(falseNegatives),
    population,
  };
}

/** Format a probability as a percentage string */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Assign a DotState to each dot in the icon array.
 * Returns an array of length `population` with deterministic assignment
 * (condition holders first, then test results within each group).
 */
export function assignDotStates(
  params: BayesParams,
  population: number = 1000
): Array<"true-positive" | "false-positive" | "true-negative" | "false-negative"> {
  const result = calculateBayes(params, population);
  const states: Array<"true-positive" | "false-positive" | "true-negative" | "false-negative"> = [];

  // Fill in order: TP, FN, FP, TN
  for (let i = 0; i < result.truePositives; i++) states.push("true-positive");
  for (let i = 0; i < result.falseNegatives; i++) states.push("false-negative");
  for (let i = 0; i < result.falsePositives; i++) states.push("false-positive");
  for (let i = 0; i < result.trueNegatives; i++) states.push("true-negative");

  // Pad or trim to exact population (rounding can cause off-by-one)
  while (states.length < population) states.push("true-negative");
  if (states.length > population) states.length = population;

  return states;
}
