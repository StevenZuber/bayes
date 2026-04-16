import { render } from "@testing-library/react";
import LearnBayesPage from "@/app/learn/bayes/page";
import ExploreBayesPage from "@/app/explore/bayes/page";
import LearnGameTheoryPage from "@/app/learn/game-theory/page";
import ExploreGameTheoryPage from "@/app/explore/game-theory/page";

/**
 * Best-effort canary for tap-target sizing. This is a class-signature check,
 * NOT a real rendered-size check — jsdom doesn't compute Tailwind styles, so
 * we can only verify that each interactive control carries one of a known set
 * of sizing classes we consider "big enough." WCAG 2.5.5 target size is 44x44.
 *
 * What this catches: someone adding a new `<button>` with no sizing classes.
 * What this misses: equivalent valid styles (`size-11`, `h-[44px]`, inline
 * style={{ height: 48 }}), width-only concerns, and everything that depends
 * on rendered layout. For full confidence run a Playwright/Cypress check.
 *
 * Convention for this codebase: use `min-h-[44px]` on text buttons and
 * `w-11 h-11` on icon-only buttons. If you're adding a new sizing style,
 * update PASSING_PATTERNS below so this test stays honest.
 *
 * Skipped selectors:
 *  - Range sliders (the native thumb is the hit area, not element bounds).
 *  - Native checkboxes wrapped in a <label> — label text area is the target.
 */

// Tailwind classes that imply a ≥44px dimension under this codebase's conventions.
const PASSING_PATTERNS = [
  /\bh-1[1-9]\b/, // h-11 (44px) through h-19
  /\bh-2[0-9]\b/,
  /\bmin-h-\[(4[4-9]|[5-9]\d|\d{3,})px\]/, // min-h-[44px] or larger
  /\bpy-[3-9]\b/, // py-3 = 12px top+bottom; with text-sm line-height ≥44px
  /\bp-[3-9]\b/,
];

function hasPassingSize(className: string | null): boolean {
  if (!className) return false;
  return PASSING_PATTERNS.some((p) => p.test(className));
}

function collectInteractiveTargets(root: HTMLElement): HTMLElement[] {
  const selectors = [
    "button:not([disabled])",
    "a[href]",
    '[role="tab"]',
    '[role="button"]',
  ];
  return Array.from(root.querySelectorAll<HTMLElement>(selectors.join(",")));
}

function describeElement(el: HTMLElement): string {
  const label =
    el.getAttribute("aria-label") ||
    el.textContent?.trim().slice(0, 40) ||
    el.getAttribute("role") ||
    el.tagName;
  return `${el.tagName.toLowerCase()}[${label}]`;
}

describe("touch target sizes", () => {
  it.each([
    ["learn/bayes", <LearnBayesPage key="learn" />],
    ["explore/bayes", <ExploreBayesPage key="explore" />],
    ["learn/game-theory", <LearnGameTheoryPage key="learn-gt" />],
    ["explore/game-theory", <ExploreGameTheoryPage key="explore-gt" />],
  ])("every interactive control on %s has an adequate tap target", (_name, page) => {
    const { container } = render(page);
    const targets = collectInteractiveTargets(container);
    expect(targets.length).toBeGreaterThan(0);

    const failures = targets
      .filter((el) => !hasPassingSize(el.getAttribute("class")))
      .map(describeElement);

    expect(failures).toEqual([]);
  });
});
