import { Scenario } from "@/types";

export const scenarios: Scenario[] = [
  {
    id: "medical-test",
    name: "Medical Test",
    description:
      "A disease affects 1% of the population. A test for this disease is 99% sensitive and 95% specific.",
    conditionName: "Disease",
    testName: "Test result",
    positiveLabel: "Positive",
    negativeLabel: "Negative",
    defaults: {
      prevalence: 0.01,
      sensitivity: 0.99,
      specificity: 0.95,
    },
  },
  {
    id: "spam-filter",
    name: "Spam Filter",
    description:
      "About 40% of incoming emails are spam. Your filter correctly identifies 95% of spam and incorrectly flags 5% of legitimate email.",
    conditionName: "Spam",
    testName: "Filter result",
    positiveLabel: "Flagged",
    negativeLabel: "Passed",
    defaults: {
      prevalence: 0.4,
      sensitivity: 0.95,
      specificity: 0.95,
    },
  },
  {
    id: "courtroom",
    name: "Courtroom Evidence",
    description:
      "A forensic test matches 1 in 10,000 people. The suspect tested positive. But the city has 1 million people and the prior probability of guilt is very low.",
    conditionName: "Guilty",
    testName: "Forensic match",
    positiveLabel: "Match",
    negativeLabel: "No match",
    defaults: {
      prevalence: 0.001,
      sensitivity: 0.999,
      specificity: 0.9999,
    },
  },
  {
    id: "fire-alarm",
    name: "Fire Alarm",
    description:
      "A fire alarm goes off. Fires are rare (0.1% chance on any given day), but the alarm is 97% sensitive and 95% specific.",
    conditionName: "Fire",
    testName: "Alarm",
    positiveLabel: "Triggered",
    negativeLabel: "Silent",
    defaults: {
      prevalence: 0.001,
      sensitivity: 0.97,
      specificity: 0.95,
    },
  },
];

export function getScenario(id: string): Scenario {
  return scenarios.find((s) => s.id === id) ?? scenarios[0];
}
