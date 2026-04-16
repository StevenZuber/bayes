import { render, screen } from "@testing-library/react";
import IconArray from "@/components/visualizations/IconArray";
import { BayesParams } from "@/types";

// jsdom doesn't implement this and Framer Motion touches it.
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    value: () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

const medicalTest: BayesParams = {
  prevalence: 0.01,
  sensitivity: 0.99,
  specificity: 0.95,
};

describe("IconArray", () => {
  it("renders a dot for every member of the population", () => {
    const { container } = render(
      <IconArray params={medicalTest} population={100} />,
    );
    const dots = container.querySelectorAll("[style*='border-radius']");
    expect(dots.length).toBe(100);
  });

  it("renders the full legend with semantic list markup", () => {
    render(<IconArray params={medicalTest} phase="full" />);
    const legend = screen.getByRole("list", { name: /legend/i });
    expect(legend).toBeInTheDocument();
    expect(legend.querySelectorAll("li").length).toBe(4);
    expect(screen.getByText("True positive")).toBeInTheDocument();
    expect(screen.getByText("False positive")).toBeInTheDocument();
    expect(screen.getByText("True negative")).toBeInTheDocument();
    expect(screen.getByText("False negative")).toBeInTheDocument();
  });

  it("renders a reduced legend in the prior phase", () => {
    render(<IconArray params={medicalTest} phase="prior" />);
    expect(screen.getByText("Has condition")).toBeInTheDocument();
    expect(screen.getByText("No condition")).toBeInTheDocument();
    expect(screen.queryByText("True positive")).toBeNull();
  });

  it("omits the legend entirely in the population phase", () => {
    render(<IconArray params={medicalTest} phase="population" />);
    expect(screen.queryByRole("list", { name: /legend/i })).toBeNull();
  });
});
