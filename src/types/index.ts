export interface BayesParams {
  /** P(A) — prior probability of the condition */
  prevalence: number;
  /** P(B|A) — probability of positive test given condition is true */
  sensitivity: number;
  /** P(~B|~A) — probability of negative test given condition is false */
  specificity: number;
}

export interface BayesResult {
  /** P(A|B) — posterior probability (what we want to find) */
  posterior: number;
  /** P(B) — total probability of a positive test */
  pPositive: number;
  /** True positives out of population */
  truePositives: number;
  /** False positives out of population */
  falsePositives: number;
  /** True negatives out of population */
  trueNegatives: number;
  /** False negatives out of population */
  falseNegatives: number;
  /** Total population used for calculation */
  population: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  conditionName: string;
  testName: string;
  positiveLabel: string;
  negativeLabel: string;
  defaults: BayesParams;
}

export type DotState =
  | "true-positive"
  | "false-positive"
  | "true-negative"
  | "false-negative";

export interface LessonStep {
  id: string;
  title: string;
  /** Which controls are interactive in this step */
  interactiveControls: ("prevalence" | "sensitivity" | "specificity")[];
  /** Which visualizations are visible */
  visibleViz: ("icon-array" | "area-diagram" | "formula")[];
}
