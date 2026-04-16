import { render, screen, fireEvent, within } from "@testing-library/react";
import LearnBayesPage from "@/app/learn/bayes/page";

const TOTAL_STEPS = 9;

describe("learn/bayes page", () => {
  it("starts at step 1 of 9", () => {
    render(<LearnBayesPage />);
    expect(screen.getByText(`Step 1 of ${TOTAL_STEPS}`)).toBeInTheDocument();
  });

  it("advances through steps with the Continue button", () => {
    render(<LearnBayesPage />);
    fireEvent.click(screen.getByRole("button", { name: /Continue/ }));
    expect(screen.getByText(`Step 2 of ${TOTAL_STEPS}`)).toBeInTheDocument();
  });

  it("disables Back on the first step", () => {
    render(<LearnBayesPage />);
    expect(screen.getByRole("button", { name: /Back/ })).toBeDisabled();
  });

  it("renders a step-nav with TOTAL_STEPS buttons and marks the active one", () => {
    render(<LearnBayesPage />);
    const nav = screen.getByRole("navigation", { name: /Lesson steps/i });
    const tabs = within(nav).getAllByRole("button");
    expect(tabs).toHaveLength(TOTAL_STEPS);
    expect(tabs[0]).toHaveAttribute("aria-current", "step");
    expect(tabs[1]).not.toHaveAttribute("aria-current");
  });

  it("jumps to an arbitrary step when its tab is clicked", () => {
    render(<LearnBayesPage />);
    const nav = screen.getByRole("navigation", { name: /Lesson steps/i });
    const tabs = within(nav).getAllByRole("button");
    fireEvent.click(tabs[4]);
    expect(screen.getByText(`Step 5 of ${TOTAL_STEPS}`)).toBeInTheDocument();
    expect(tabs[4]).toHaveAttribute("aria-current", "step");
  });

  it("replaces Continue with 'Open sandbox' link on the last step", () => {
    render(<LearnBayesPage />);
    const nav = screen.getByRole("navigation", { name: /Lesson steps/i });
    const tabs = within(nav).getAllByRole("button");
    fireEvent.click(tabs[TOTAL_STEPS - 1]);
    expect(screen.queryByRole("button", { name: /Continue/ })).toBeNull();
    const sandbox = screen.getByRole("link", { name: /Open sandbox/ });
    expect(sandbox).toHaveAttribute("href", "/explore/bayes");
  });
});
