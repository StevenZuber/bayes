# Seeing the Math

Visual, interactive teaching tools for ideas that are easier to see than to read. Instead of memorizing formulas, you watch how the pieces connect through animated visualizations.

## Topics

### Bayes' Theorem

- **Guided lesson** (`/learn/bayes`) — A 9-step walkthrough that starts with a surprising question, builds intuition through natural frequencies and visual representations, then reveals the formula after you already understand it.
- **Interactive sandbox** (`/explore/bayes`) — All three visualizations with full slider controls and scenario presets (medical test, spam filter, courtroom evidence, fire alarm).
- **Three visualization types:**
  - **Icon array** — 1,000 animated dots representing a population, color-coded by condition and test result
  - **Area diagram** — Proportional rectangle subdivision showing how the formula maps to geometry
  - **Formula display** — Live-updating symbolic and numeric Bayes' formula with natural frequency breakdown

### Game Theory

- **Lesson series** (`/learn/game-theory`) — Three guided walkthroughs: the Prisoner's Dilemma, Nash equilibrium, and Pareto optimality.
- **Interactive sandbox** (`/explore/game-theory`) — An editable payoff matrix with live dominant-strategy/Nash/Pareto analysis, iterated matches between strategies (Tit for Tat, Grim Trigger, and friends), and a round-robin tournament.

Plus a **light/dark theme** toggle with localStorage persistence.

## Tech Stack

Next.js, React, TypeScript, Tailwind CSS, Framer Motion

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tests

```bash
npm test
```

## Building

```bash
npm run build
```

## Deployment

Deployed on [Railway](https://railway.app). The app runs as a standard Next.js server (`npm start` on port 3000). No additional environment variables or services required.

## Project Structure

```text
src/
  app/
    page.tsx                        # Landing page
    learn/bayes/page.tsx            # Guided 9-step Bayes lesson
    learn/game-theory/              # Lesson series index + three lessons
    explore/bayes/page.tsx          # Bayes sandbox
    explore/game-theory/page.tsx    # Game theory sandbox
  components/
    visualizations/                 # IconArray, AreaDiagram, FormulaDisplay
    controls/                       # ProbabilitySlider, ScenarioSelector
    game/                           # PayoffMatrix, StrategyTimeline, TournamentResults
    lesson/                         # LessonShell (shared step-by-step lesson chrome)
    layout/                         # Header
    ThemeProvider.tsx               # Light/dark theme context
    ThemeToggle.tsx                 # Theme toggle button
  lib/
    bayes.ts                        # Core probability calculations
    scenarios.ts                    # Bayes scenario presets
    game-theory.ts                  # Payoff matrix analysis (dominance, Nash, Pareto)
    game-scenarios.ts               # Game presets (PD, Stag Hunt, Chicken, Matching Pennies)
    strategies.ts                   # Iterated-play strategies, matches, tournaments
    theme-colors.ts                 # Theme-aware color palette
  types/                            # Shared TypeScript types
```

Extensible by design — new topics go under `/learn/[topic]` and `/explore/[topic]`.
