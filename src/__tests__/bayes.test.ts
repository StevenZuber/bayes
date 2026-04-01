import { calculateBayes, formatPercent, assignDotStates } from "@/lib/bayes";
import { BayesParams } from "@/types";

describe("calculateBayes", () => {
  const medicalTest: BayesParams = {
    prevalence: 0.01,
    sensitivity: 0.99,
    specificity: 0.95,
  };

  it("computes the classic medical test scenario correctly", () => {
    const result = calculateBayes(medicalTest);

    // 1% prevalence, 99% sensitivity, 95% specificity
    // P(A|B) = (0.99 * 0.01) / (0.99*0.01 + 0.05*0.99) = 0.0099 / 0.0594 ≈ 16.67%
    expect(result.posterior).toBeCloseTo(0.1667, 3);
    expect(result.population).toBe(1000);
  });

  it("counts natural frequencies correctly for default population", () => {
    const result = calculateBayes(medicalTest);

    // Out of 1000: 10 sick, 990 healthy
    // TP: 10 * 0.99 ≈ 10, FN: 10 * 0.01 ≈ 0
    // FP: 990 * 0.05 ≈ 50, TN: 990 * 0.95 ≈ 940
    expect(result.truePositives).toBe(10);
    expect(result.falseNegatives).toBe(0);
    expect(result.falsePositives).toBe(50);
    expect(result.trueNegatives).toBe(941);
  });

  it("sums all groups to the population", () => {
    const result = calculateBayes(medicalTest);
    const total =
      result.truePositives +
      result.falsePositives +
      result.trueNegatives +
      result.falseNegatives;
    // Rounding may cause ±1 drift
    expect(Math.abs(total - result.population)).toBeLessThanOrEqual(1);
  });

  it("returns posterior of 0 when prevalence is 0", () => {
    const result = calculateBayes({
      prevalence: 0,
      sensitivity: 0.99,
      specificity: 0.95,
    });
    expect(result.posterior).toBe(0);
    expect(result.truePositives).toBe(0);
  });

  it("returns posterior near 1 when prevalence is very high", () => {
    const result = calculateBayes({
      prevalence: 0.999,
      sensitivity: 0.99,
      specificity: 0.95,
    });
    expect(result.posterior).toBeGreaterThan(0.99);
  });

  it("returns posterior of 0 when sensitivity is 0 (test never fires for sick)", () => {
    const result = calculateBayes({
      prevalence: 0.5,
      sensitivity: 0,
      specificity: 0.95,
    });
    // No true positives, only false positives → TP / (TP + FP) = 0 / FP = 0
    expect(result.posterior).toBe(0);
  });

  it("handles perfect test (100% sensitivity and specificity)", () => {
    const result = calculateBayes({
      prevalence: 0.01,
      sensitivity: 1,
      specificity: 1,
    });
    // Perfect test: no false positives, so posterior = 1
    expect(result.posterior).toBeCloseTo(1, 5);
    expect(result.falsePositives).toBe(0);
    expect(result.falseNegatives).toBe(0);
  });

  it("handles equal prevalence (50/50)", () => {
    const result = calculateBayes({
      prevalence: 0.5,
      sensitivity: 0.9,
      specificity: 0.9,
    });
    // Symmetric case: P(A|B) = (0.9 * 0.5) / (0.9*0.5 + 0.1*0.5) = 0.45/0.5 = 0.9
    expect(result.posterior).toBeCloseTo(0.9, 3);
  });

  it("respects custom population size", () => {
    const result = calculateBayes(medicalTest, 10000);
    expect(result.population).toBe(10000);
    expect(result.truePositives).toBe(99);
    expect(result.falsePositives).toBe(495);
  });

  it("computes pPositive (total positive rate) correctly", () => {
    const result = calculateBayes(medicalTest);
    // P(B) = P(B|A)*P(A) + P(B|¬A)*P(¬A) = 0.99*0.01 + 0.05*0.99 = 0.0099 + 0.0495 = 0.0594
    expect(result.pPositive).toBeCloseTo(0.0594, 3);
  });

  it("posterior equals TP / (TP + FP) in natural frequencies", () => {
    const params: BayesParams = {
      prevalence: 0.05,
      sensitivity: 0.85,
      specificity: 0.90,
    };
    const result = calculateBayes(params, 10000);
    const fromFrequencies =
      result.truePositives / (result.truePositives + result.falsePositives);
    expect(result.posterior).toBeCloseTo(fromFrequencies, 2);
  });
});

describe("formatPercent", () => {
  it("formats with default 1 decimal place", () => {
    expect(formatPercent(0.1667)).toBe("16.7%");
  });

  it("formats with custom decimal places", () => {
    expect(formatPercent(0.1667, 2)).toBe("16.67%");
    expect(formatPercent(0.1667, 0)).toBe("17%");
  });

  it("handles 0 and 1", () => {
    expect(formatPercent(0)).toBe("0.0%");
    expect(formatPercent(1)).toBe("100.0%");
  });

  it("handles small values", () => {
    expect(formatPercent(0.001)).toBe("0.1%");
    expect(formatPercent(0.001, 2)).toBe("0.10%");
  });
});

describe("assignDotStates", () => {
  const params: BayesParams = {
    prevalence: 0.01,
    sensitivity: 0.99,
    specificity: 0.95,
  };

  it("returns exactly `population` dots", () => {
    const states = assignDotStates(params, 1000);
    expect(states).toHaveLength(1000);
  });

  it("assigns only valid states", () => {
    const validStates = new Set([
      "true-positive",
      "false-positive",
      "true-negative",
      "false-negative",
    ]);
    const states = assignDotStates(params, 1000);
    states.forEach((s) => expect(validStates.has(s)).toBe(true));
  });

  it("state counts match calculateBayes results", () => {
    const result = calculateBayes(params, 1000);
    const states = assignDotStates(params, 1000);

    const counts = {
      "true-positive": 0,
      "false-positive": 0,
      "true-negative": 0,
      "false-negative": 0,
    };
    states.forEach((s) => counts[s]++);

    expect(counts["true-positive"]).toBe(result.truePositives);
    expect(counts["false-positive"]).toBe(result.falsePositives);
    // TN may absorb rounding padding, so allow ±1
    expect(
      Math.abs(counts["true-negative"] - result.trueNegatives)
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(counts["false-negative"] - result.falseNegatives)
    ).toBeLessThanOrEqual(1);
  });

  it("groups states in order: TP, FN, FP, TN", () => {
    const states = assignDotStates(params, 1000);

    // Find the indices where each state starts
    let lastTP = -1, firstFN = -1, lastFN = -1, firstFP = -1;
    states.forEach((s, i) => {
      if (s === "true-positive") lastTP = i;
      if (s === "false-negative" && firstFN === -1) firstFN = i;
      if (s === "false-negative") lastFN = i;
      if (s === "false-positive" && firstFP === -1) firstFP = i;
    });

    // TP should come before FN, FN before FP
    if (lastTP >= 0 && firstFN >= 0) expect(lastTP).toBeLessThan(firstFN);
    if (lastFN >= 0 && firstFP >= 0) expect(lastFN).toBeLessThan(firstFP);
  });

  it("works with small populations", () => {
    const states = assignDotStates(params, 100);
    expect(states).toHaveLength(100);
  });
});
