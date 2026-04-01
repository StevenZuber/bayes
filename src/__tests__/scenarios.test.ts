import { scenarios, getScenario } from "@/lib/scenarios";

describe("scenarios", () => {
  it("has at least one scenario", () => {
    expect(scenarios.length).toBeGreaterThan(0);
  });

  it("all scenarios have unique ids", () => {
    const ids = scenarios.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all scenarios have valid probability defaults", () => {
    scenarios.forEach((scenario) => {
      const { prevalence, sensitivity, specificity } = scenario.defaults;
      expect(prevalence).toBeGreaterThanOrEqual(0);
      expect(prevalence).toBeLessThanOrEqual(1);
      expect(sensitivity).toBeGreaterThanOrEqual(0);
      expect(sensitivity).toBeLessThanOrEqual(1);
      expect(specificity).toBeGreaterThanOrEqual(0);
      expect(specificity).toBeLessThanOrEqual(1);
    });
  });

  it("all scenarios have required string fields", () => {
    scenarios.forEach((scenario) => {
      expect(scenario.name.length).toBeGreaterThan(0);
      expect(scenario.description.length).toBeGreaterThan(0);
      expect(scenario.conditionName.length).toBeGreaterThan(0);
      expect(scenario.testName.length).toBeGreaterThan(0);
      expect(scenario.positiveLabel.length).toBeGreaterThan(0);
      expect(scenario.negativeLabel.length).toBeGreaterThan(0);
    });
  });
});

describe("getScenario", () => {
  it("returns the correct scenario by id", () => {
    const scenario = getScenario("medical-test");
    expect(scenario.id).toBe("medical-test");
    expect(scenario.name).toBe("Medical Test");
  });

  it("returns the first scenario for an unknown id", () => {
    const scenario = getScenario("nonexistent");
    expect(scenario.id).toBe(scenarios[0].id);
  });
});
