import type {
  Action,
  MatchResult,
  PayoffMatrix,
  Round,
  Strategy,
  TournamentResult,
} from "@/types/game";

export const STRATEGIES: Strategy[] = [
  {
    id: "always-cooperate",
    name: "Always Cooperate",
    description: "Plays C every round, no matter what.",
    play: () => "C",
  },
  {
    id: "always-defect",
    name: "Always Defect",
    description: "Plays D every round, no matter what.",
    play: () => "D",
  },
  {
    id: "tit-for-tat",
    name: "Tit for Tat",
    description: "Cooperates on round 1, then copies the opponent's last move.",
    play: (history) => (history.length === 0 ? "C" : history[history.length - 1].col),
  },
  {
    id: "grim-trigger",
    name: "Grim Trigger",
    description: "Cooperates until the opponent defects once — then defects forever.",
    play: (history) => (history.some((r) => r.col === "D") ? "D" : "C"),
  },
  {
    id: "generous-tit-for-tat",
    name: "Generous Tit for Tat",
    description: "Like Tit for Tat, but occasionally forgives a defection (10% chance).",
    play: (history) => {
      if (history.length === 0) return "C";
      const last = history[history.length - 1].col;
      if (last === "D" && Math.random() < 0.1) return "C";
      return last;
    },
  },
  {
    id: "random",
    name: "Random",
    description: "Flips a coin each round.",
    play: () => (Math.random() < 0.5 ? "C" : "D"),
  },
];

export function getStrategy(id: string): Strategy {
  const s = STRATEGIES.find((s) => s.id === id);
  if (!s) throw new Error(`Unknown strategy: ${id}`);
  return s;
}

/** Swap the perspective of a history so `row` becomes `col` and vice versa. */
function flipHistory(history: Round[]): Round[] {
  return history.map((r) => ({ row: r.col, col: r.row }));
}

/** Run one iterated match between two strategies for `rounds` rounds. */
export function playMatch(
  rowStrategy: Strategy,
  colStrategy: Strategy,
  matrix: PayoffMatrix,
  rounds: number
): MatchResult {
  const history: Round[] = [];
  let rowScore = 0;
  let colScore = 0;

  for (let i = 0; i < rounds; i++) {
    const rowAction: Action = rowStrategy.play(history);
    const colAction: Action = colStrategy.play(flipHistory(history));
    history.push({ row: rowAction, col: colAction });
    const cell = matrix[rowAction][colAction];
    rowScore += cell.row;
    colScore += cell.col;
  }

  return { rowScore, colScore, rounds: history };
}

/**
 * Round-robin tournament: every strategy plays every other strategy (including itself).
 * Each pairing plays once; both players' scores from that match accumulate.
 */
export function runTournament(
  strategies: Strategy[],
  matrix: PayoffMatrix,
  rounds: number
): TournamentResult {
  const scores: Record<string, number> = {};
  for (const s of strategies) scores[s.id] = 0;

  for (let i = 0; i < strategies.length; i++) {
    for (let j = i; j < strategies.length; j++) {
      const result = playMatch(strategies[i], strategies[j], matrix, rounds);
      scores[strategies[i].id] += result.rowScore;
      if (i !== j) scores[strategies[j].id] += result.colScore;
    }
  }

  const ranking = Object.entries(scores)
    .map(([strategyId, score]) => ({ strategyId, score }))
    .sort((a, b) => b.score - a.score);

  return { scores, ranking };
}
