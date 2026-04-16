import { render, screen } from "@testing-library/react";
import PayoffMatrix from "@/components/game/PayoffMatrix";
import { gameScenarios } from "@/lib/game-scenarios";

const PD = gameScenarios.find((s) => s.id === "prisoners-dilemma")!;
const MATCHING_PENNIES = gameScenarios.find((s) => s.id === "matching-pennies")!;

describe("PayoffMatrix", () => {
  it("renders all four cells with payoffs", () => {
    render(<PayoffMatrix scenario={PD} />);
    expect(screen.getByTestId("cell-CC")).toBeInTheDocument();
    expect(screen.getByTestId("cell-CD")).toBeInTheDocument();
    expect(screen.getByTestId("cell-DC")).toBeInTheDocument();
    expect(screen.getByTestId("cell-DD")).toBeInTheDocument();
  });

  it("marks the Nash cell with a Nash dot when highlight=nash", () => {
    render(<PayoffMatrix scenario={PD} highlight="nash" />);
    const ddCell = screen.getByTestId("cell-DD");
    expect(ddCell.querySelector('[aria-label="Nash equilibrium"]')).toBeInTheDocument();

    const ccCell = screen.getByTestId("cell-CC");
    expect(ccCell.querySelector('[aria-label="Nash equilibrium"]')).toBeNull();
  });

  it("shows the Nash legend when Nash cells exist", () => {
    render(<PayoffMatrix scenario={PD} highlight="nash" />);
    expect(screen.getByText("Nash equilibrium")).toBeInTheDocument();
  });

  it("hides the Nash legend when no cells qualify (Matching Pennies)", () => {
    render(<PayoffMatrix scenario={MATCHING_PENNIES} highlight="nash" />);
    expect(screen.queryByText("Nash equilibrium")).not.toBeInTheDocument();
    // And no cells should carry a Nash marker dot.
    expect(
      screen.queryByLabelText("Nash equilibrium")
    ).not.toBeInTheDocument();
  });

  it("renders editable inputs when onPayoffChange is provided", () => {
    const onChange = jest.fn();
    render(<PayoffMatrix scenario={PD} onPayoffChange={onChange} />);
    expect(
      screen.getByLabelText(/You payoff when C\/C/i)
    ).toBeInTheDocument();
  });

  it("suppresses legend when showLegend is false", () => {
    render(<PayoffMatrix scenario={PD} highlight="all" showLegend={false} />);
    expect(screen.queryByText("Nash equilibrium")).not.toBeInTheDocument();
    expect(screen.queryByText("Pareto optimal")).not.toBeInTheDocument();
  });
});
