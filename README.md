# Intuiting Bayesian Probability

A visual, interactive teaching tool for building intuition about Bayes' Theorem. Instead of memorizing a formula, you see how prior beliefs, evidence, and posterior probabilities connect through animated visualizations.

## Features

- **Guided lesson** (`/learn/bayes`) — A 9-step walkthrough that starts with a surprising question, builds intuition through natural frequencies and visual representations, then reveals the formula after you already understand it.
- **Interactive sandbox** (`/explore/bayes`) — All three visualizations with full slider controls and scenario presets (medical test, spam filter, courtroom evidence, fire alarm).
- **Three visualization types:**
  - **Icon array** — 1,000 animated dots representing a population, color-coded by condition and test result
  - **Area diagram** — Proportional rectangle subdivision showing how the formula maps to geometry
  - **Formula display** — Live-updating symbolic and numeric Bayes' formula with natural frequency breakdown
- **Light/dark theme** toggle with localStorage persistence

## Tech Stack

Next.js, React, TypeScript, Tailwind CSS, Framer Motion, D3 (math utilities)

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

```
src/
  app/
    page.tsx                    # Landing page
    learn/bayes/page.tsx        # Guided 9-step lesson
    explore/bayes/page.tsx      # Interactive sandbox
  components/
    visualizations/             # IconArray, AreaDiagram, FormulaDisplay
    controls/                   # ProbabilitySlider, ScenarioSelector
    layout/                     # Header
    ThemeProvider.tsx            # Light/dark theme context
    ThemeToggle.tsx              # Theme toggle button
  lib/
    bayes.ts                    # Core probability calculations
    scenarios.ts                # Preset scenario data
    theme-colors.ts             # Theme-aware color palette
  types/
    index.ts                    # Shared TypeScript types
```

Extensible by design — new topics go under `/learn/[topic]` and `/explore/[topic]`.
