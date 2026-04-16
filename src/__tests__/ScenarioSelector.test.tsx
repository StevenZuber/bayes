import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import ScenarioSelector from "@/components/controls/ScenarioSelector";
import { scenarios } from "@/lib/scenarios";

expect.extend(toHaveNoViolations);

describe("ScenarioSelector", () => {
  it("renders a button for each scenario", () => {
    render(<ScenarioSelector activeId={scenarios[0].id} onSelect={() => {}} />);
    for (const scenario of scenarios) {
      expect(
        screen.getByRole("button", { name: scenario.name }),
      ).toBeInTheDocument();
    }
  });

  it("marks the active scenario with aria-pressed", () => {
    render(<ScenarioSelector activeId={scenarios[1].id} onSelect={() => {}} />);
    const active = screen.getByRole("button", { name: scenarios[1].name });
    const inactive = screen.getByRole("button", { name: scenarios[0].name });
    expect(active).toHaveAttribute("aria-pressed", "true");
    expect(inactive).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onSelect with the scenario when clicked", () => {
    const onSelect = jest.fn();
    render(<ScenarioSelector activeId={scenarios[0].id} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: scenarios[2].name }));
    expect(onSelect).toHaveBeenCalledWith(scenarios[2]);
  });

  it("has no detectable a11y violations", async () => {
    const { container } = render(
      <ScenarioSelector activeId={scenarios[0].id} onSelect={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
