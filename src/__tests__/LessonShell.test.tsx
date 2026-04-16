import { render, screen, fireEvent } from "@testing-library/react";
import LessonShell from "@/components/lesson/LessonShell";

function makeSteps(n: number) {
  return Array.from({ length: n }, (_, i) => (
    <div key={i} data-testid={`step-${i}`}>
      Step body {i}
    </div>
  ));
}

describe("LessonShell", () => {
  it("starts on step 1 and shows a progress indicator", () => {
    render(<LessonShell steps={makeSteps(4)} />);
    expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
    expect(screen.getByTestId("step-0")).toBeInTheDocument();
    expect(screen.queryByTestId("step-1")).not.toBeInTheDocument();
  });

  it("advances with Continue and returns with Back", () => {
    render(<LessonShell steps={makeSteps(3)} />);
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));
    expect(screen.getByTestId("step-1")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Back/i }));
    expect(screen.getByTestId("step-0")).toBeInTheDocument();
  });

  it("Back is disabled on the first step", () => {
    render(<LessonShell steps={makeSteps(3)} />);
    expect(screen.getByRole("button", { name: /Back/i })).toBeDisabled();
  });

  it("step dots jump to the chosen step and mark aria-current", () => {
    render(<LessonShell steps={makeSteps(4)} />);
    const nav = screen.getByRole("navigation", { name: /Lesson steps/i });
    const dots = nav.querySelectorAll("button");
    expect(dots).toHaveLength(4);
    expect(dots[0]).toHaveAttribute("aria-current", "step");
    fireEvent.click(dots[2]);
    expect(
      screen.getByRole("navigation", { name: /Lesson steps/i }).querySelectorAll("button")[2]
    ).toHaveAttribute("aria-current", "step");
    expect(screen.getByTestId("step-2")).toBeInTheDocument();
  });

  it("replaces Continue with a finish link on the last step when finish is provided", () => {
    render(
      <LessonShell
        steps={makeSteps(3)}
        finish={{ label: "Open sandbox", href: "/somewhere" }}
      />
    );
    const nav = screen.getByRole("navigation", { name: /Lesson steps/i });
    fireEvent.click(nav.querySelectorAll("button")[2]);
    expect(screen.queryByRole("button", { name: /Continue/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open sandbox/i })).toHaveAttribute(
      "href",
      "/somewhere"
    );
  });

  it("omits the finish link when no finish prop is provided", () => {
    render(<LessonShell steps={makeSteps(2)} />);
    const nav = screen.getByRole("navigation", { name: /Lesson steps/i });
    fireEvent.click(nav.querySelectorAll("button")[1]);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
