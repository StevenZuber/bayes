import { render, screen, fireEvent } from "@testing-library/react";
import ExploreBayesPage from "@/app/explore/bayes/page";
import { scenarios } from "@/lib/scenarios";

describe("explore/bayes page", () => {
  it("renders scenario controls and visualizations", () => {
    render(<ExploreBayesPage />);
    expect(
      screen.getByRole("heading", { name: /Bayes'? Theorem Explorer/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Prevalence/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sensitivity/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Specificity/)).toBeInTheDocument();
  });

  it("swaps scenario defaults when a different scenario is selected", () => {
    render(<ExploreBayesPage />);
    const target = scenarios[1];
    const button = screen.getByRole("button", { name: target.name });
    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    const prevalence = screen.getByLabelText(/Prevalence/) as HTMLInputElement;
    expect(parseFloat(prevalence.value)).toBeCloseTo(target.defaults.prevalence);
  });

  it("updates the posterior when prevalence is changed", () => {
    render(<ExploreBayesPage />);
    const prevalence = screen.getByLabelText(/Prevalence/) as HTMLInputElement;
    fireEvent.change(prevalence, { target: { value: "0.5" } });

    // scenarios[0] defaults: sens=0.99, spec=0.95. At prevalence=0.5, posterior ≈ 95.2%.
    const posterior = screen.getByTestId("posterior-value");
    expect(posterior.textContent).toMatch(/9[0-9]\.\d%/);
  });

  it("toggles highlight-positives without crashing", () => {
    render(<ExploreBayesPage />);
    const toggle = screen.getByLabelText(
      /Highlight positive results only/,
    ) as HTMLInputElement;
    expect(toggle.checked).toBe(false);
    fireEvent.click(toggle);
    expect(toggle.checked).toBe(true);
  });
});
