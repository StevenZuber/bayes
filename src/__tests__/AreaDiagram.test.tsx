import { render, screen } from "@testing-library/react";
import AreaDiagram from "@/components/visualizations/AreaDiagram";
import { BayesParams } from "@/types";

const medicalTest: BayesParams = {
  prevalence: 0.01,
  sensitivity: 0.99,
  specificity: 0.95,
};

describe("AreaDiagram", () => {
  it("shows prior-phase labels when phase='prior'", () => {
    render(<AreaDiagram params={medicalTest} phase="prior" />);
    expect(screen.getByText("Has condition")).toBeInTheDocument();
    expect(screen.getByText("No condition")).toBeInTheDocument();
    // The four outcome blocks shouldn't appear yet
    expect(screen.queryByText("True +")).toBeNull();
    expect(screen.queryByText("False +")).toBeNull();
  });

  it("renders all four outcome blocks when phase='full'", () => {
    // Use a scenario where every block is large enough to render its label
    // (the component hides labels on very thin slivers).
    const balanced = { prevalence: 0.5, sensitivity: 0.8, specificity: 0.8 };
    render(<AreaDiagram params={balanced} phase="full" />);
    expect(screen.getByText("True +")).toBeInTheDocument();
    expect(screen.getByText("False +")).toBeInTheDocument();
    expect(screen.getByText("True −")).toBeInTheDocument();
    expect(screen.getByText("False −")).toBeInTheDocument();
  });

  it("displays the posterior breakdown at the full phase", () => {
    render(<AreaDiagram params={medicalTest} phase="full" />);
    // 1% prevalence, 99% sens, 95% spec → TP≈10, FP≈50, posterior ≈ 16.7%
    expect(screen.getByText(/P\(A\|B\)/)).toBeInTheDocument();
    expect(screen.getByText(/16\.7%/)).toBeInTheDocument();
    expect(screen.getAllByText(/10 TP/).length).toBeGreaterThan(0);
    expect(screen.getByText(/50 FP/)).toBeInTheDocument();
  });

  it("hides the posterior breakdown in non-full phases", () => {
    render(<AreaDiagram params={medicalTest} phase="evidence" />);
    expect(screen.queryByText(/P\(A\|B\)/)).toBeNull();
  });
});
