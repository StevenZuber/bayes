import { render, screen } from "@testing-library/react";
import FormulaDisplay from "@/components/visualizations/FormulaDisplay";
import { BayesParams } from "@/types";

const medicalTest: BayesParams = {
  prevalence: 0.01,
  sensitivity: 0.99,
  specificity: 0.95,
};

describe("FormulaDisplay", () => {
  it("shows symbolic form in symbolic mode", () => {
    render(<FormulaDisplay params={medicalTest} mode="symbolic" />);
    expect(screen.getByText("Bayes' Theorem")).toBeInTheDocument();
    expect(screen.queryByText("With current values")).toBeNull();
  });

  it("shows numeric values and natural frequencies in numeric mode", () => {
    render(<FormulaDisplay params={medicalTest} mode="numeric" />);
    expect(screen.getByText("With current values")).toBeInTheDocument();
    expect(screen.getByText(/In natural frequencies/)).toBeInTheDocument();
    // 1% prevalence, 99% sensitivity, 95% specificity → posterior ≈ 16.7%
    expect(screen.getByText(/16\.7%/)).toBeInTheDocument();
  });

  it("shows both sections in both mode", () => {
    render(<FormulaDisplay params={medicalTest} mode="both" />);
    expect(screen.getByText("Bayes' Theorem")).toBeInTheDocument();
    expect(screen.getByText("With current values")).toBeInTheDocument();
  });
});
