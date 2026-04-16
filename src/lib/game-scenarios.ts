import type { GameScenario } from "@/types/game";

export const gameScenarios: GameScenario[] = [
  {
    id: "prisoners-dilemma",
    name: "Prisoner's Dilemma",
    description:
      "Two suspects are interrogated separately. Each can stay silent (cooperate) or rat out the other (defect).",
    matrix: {
      C: {
        C: { row: 3, col: 3 },
        D: { row: 0, col: 5 },
      },
      D: {
        C: { row: 5, col: 0 },
        D: { row: 1, col: 1 },
      },
    },
    labels: {
      cooperate: "Stay silent",
      defect: "Rat out",
      rowPlayer: "You",
      colPlayer: "Partner",
    },
  },
  {
    id: "stag-hunt",
    name: "Stag Hunt",
    description:
      "Two hunters decide whether to chase a stag (requires both) or a hare (one person can get alone).",
    matrix: {
      C: {
        C: { row: 4, col: 4 },
        D: { row: 0, col: 2 },
      },
      D: {
        C: { row: 2, col: 0 },
        D: { row: 2, col: 2 },
      },
    },
    labels: {
      cooperate: "Hunt stag",
      defect: "Hunt hare",
      rowPlayer: "Hunter A",
      colPlayer: "Hunter B",
    },
  },
  {
    id: "chicken",
    name: "Chicken",
    description:
      "Two drivers speed toward each other. Swerve and lose face; don't swerve and risk a crash.",
    matrix: {
      C: {
        C: { row: 3, col: 3 },
        D: { row: 1, col: 4 },
      },
      D: {
        C: { row: 4, col: 1 },
        D: { row: 0, col: 0 },
      },
    },
    labels: {
      cooperate: "Swerve",
      defect: "Straight",
      rowPlayer: "Driver A",
      colPlayer: "Driver B",
    },
  },
];
