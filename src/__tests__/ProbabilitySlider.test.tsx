import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import ProbabilitySlider from "@/components/controls/ProbabilitySlider";

expect.extend(toHaveNoViolations);

describe("ProbabilitySlider", () => {
  it("renders label and formatted value", () => {
    render(
      <ProbabilitySlider
        label="Prevalence"
        sublabel="P(A)"
        value={0.25}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Prevalence")).toBeInTheDocument();
    expect(screen.getByText("P(A)")).toBeInTheDocument();
    expect(screen.getByText("25.0%")).toBeInTheDocument();
  });

  it("associates the label with the range input via htmlFor/id", () => {
    render(
      <ProbabilitySlider label="Sensitivity" value={0.9} onChange={() => {}} />,
    );
    // getByLabelText will only find it if the label is properly linked.
    const slider = screen.getByLabelText(/Sensitivity/);
    expect(slider).toBeInstanceOf(HTMLInputElement);
    expect((slider as HTMLInputElement).type).toBe("range");
  });

  it("exposes aria-valuetext for screen readers", () => {
    render(
      <ProbabilitySlider label="Specificity" value={0.5} onChange={() => {}} />,
    );
    const slider = screen.getByLabelText(/Specificity/);
    expect(slider).toHaveAttribute("aria-valuetext", "50.0%");
  });

  it("calls onChange with a numeric value", () => {
    const onChange = jest.fn();
    render(<ProbabilitySlider label="Prior" value={0.1} onChange={onChange} />);
    const slider = screen.getByLabelText(/Prior/) as HTMLInputElement;
    fireEvent.change(slider, { target: { value: "0.42" } });
    expect(onChange).toHaveBeenCalledWith(0.42);
  });

  it("has no detectable a11y violations", async () => {
    const { container } = render(
      <ProbabilitySlider label="Prevalence" value={0.01} onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
