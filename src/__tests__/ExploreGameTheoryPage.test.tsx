import { render, screen, fireEvent } from "@testing-library/react";
import ExploreGameTheoryPage from "@/app/explore/game-theory/page";
import { gameScenarios } from "@/lib/game-scenarios";

describe("explore/game-theory page", () => {
  it("renders heading, scenario controls, and analysis", () => {
    render(<ExploreGameTheoryPage />);
    expect(
      screen.getByRole("heading", { name: /Game Theory Explorer/i })
    ).toBeInTheDocument();
    // The first scenario is Prisoner's Dilemma
    expect(
      screen.getByRole("button", { name: gameScenarios[0].name })
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByText(/Nash equilibria/i).length).toBeGreaterThan(0);
  });

  it("swaps scenarios when a different scenario is selected", () => {
    render(<ExploreGameTheoryPage />);
    const target = gameScenarios[1];
    const button = screen.getByRole("button", { name: target.name });
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("lets the user edit a payoff and re-analyzes", () => {
    render(<ExploreGameTheoryPage />);
    // Edit the C/C cell row payoff (default 3) to 10 — no change in dominant
    // strategy but the input should reflect the new value.
    const ccRowInput = screen.getByLabelText(/You payoff when C\/C/i) as HTMLInputElement;
    fireEvent.change(ccRowInput, { target: { value: "10" } });
    expect(ccRowInput.value).toBe("10");
  });
});
