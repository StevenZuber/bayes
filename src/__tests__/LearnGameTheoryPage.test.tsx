import { render, screen, fireEvent } from "@testing-library/react";
import LearnGameTheoryPage from "@/app/learn/game-theory/prisoners-dilemma/page";

describe("learn/game-theory/prisoners-dilemma page", () => {
  it("starts on the hook step", () => {
    render(<LearnGameTheoryPage />);
    expect(screen.getByText(/Step 1 of 8/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Two suspects\. One choice\./i })
    ).toBeInTheDocument();
  });

  it("advances through steps via Continue", () => {
    render(<LearnGameTheoryPage />);
    const cont = screen.getByRole("button", { name: /Continue/i });
    fireEvent.click(cont);
    expect(screen.getByText(/Step 2 of 8/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Make your choice/i })
    ).toBeInTheDocument();
  });

  it("lets the user pick an action and lock it in", () => {
    render(<LearnGameTheoryPage />);
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    fireEvent.click(screen.getByRole("button", { name: /Rat out/i }));
    expect(
      screen.getByRole("button", { name: /Rat out/i })
    ).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: /Lock in my choice/i }));
    expect(screen.getByText(/Hold onto that/i)).toBeInTheDocument();
  });

  it("step nav uses aria-current for the active step", () => {
    render(<LearnGameTheoryPage />);
    const nav = screen.getByRole("navigation", { name: /Lesson steps/i });
    const dots = nav.querySelectorAll("button");
    expect(dots).toHaveLength(8);
    expect(dots[0]).toHaveAttribute("aria-current", "step");

    fireEvent.click(dots[3]);
    expect(dots[3]).toHaveAttribute("aria-current", "step");
    expect(dots[0]).not.toHaveAttribute("aria-current");
  });

  it("final step replaces Continue with an Open sandbox link", () => {
    render(<LearnGameTheoryPage />);
    const nav = screen.getByRole("navigation", { name: /Lesson steps/i });
    const dots = nav.querySelectorAll("button");
    fireEvent.click(dots[7]);
    expect(screen.getByRole("link", { name: /Open sandbox/i })).toHaveAttribute(
      "href",
      "/explore/game-theory"
    );
  });
});
