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
    play: (history, rng = Math.random) => {
      if (history.length === 0) return "C";
      const last = history[history.length - 1].col;
      if (last === "D" && rng() < 0.1) return "C";
      return last;
    },
  },
  {
    id: "random",
    name: "Random",
    description: "Flips a coin each round.",
    play: (_history, rng = Math.random) => (rng() < 0.5 ? "C" : "D"),
  },
];

/**
 * Deterministic PRNG (mulberry32) returning values in [0, 1). Match and
 * tournament play must be reproducible for a given seed: these run during
 * render, so a `Math.random` draw would bake one result into prerendered
 * HTML and compute a different one at hydration.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getStrategy(id: string): Strategy {
  const s = STRATEGIES.find((s) => s.id === id);
  if (!s) throw new Error(`Unknown strategy: ${id}`);
  return s;
}

/** Swap the perspective of a history so `row` becomes `col` and vice versa. */
function flipHistory(history: Round[]): Round[] {
  return history.map((r) => ({ row: r.col, col: r.row }));
}

/**
 * Run one iterated match between two strategies for `rounds` rounds.
 * Deterministic: randomizing strategies draw from a PRNG seeded with `seed`,
 * so the same inputs always produce the same result.
 *
 * @param colStrategy - Strategy playing the column side
 * @param matrix      - Payoff matrix to score each round against
 * @param rounds      - Number of rounds to play
 * @param rowStrategy - Strategy playing the row side
 * @param seed        - [optional] PRNG seed for randomizing strategies (default: 1)
 * @returns           Both players' total scores and the full round history
 */
export function playMatch(
  rowStrategy: Strategy,
  colStrategy: Strategy,
  matrix: PayoffMatrix,
  rounds: number,
  seed: number = 1
): MatchResult {
  const history: Round[] = [];
  const rng = mulberry32(seed);
  let rowScore = 0;
  let colScore = 0;

  for (let i = 0; i < rounds; i++) {
    const rowAction: Action = rowStrategy.play(history, rng);
    const colAction: Action = colStrategy.play(flipHistory(history), rng);
    history.push({ row: rowAction, col: colAction });
    const cell = matrix[rowAction][colAction];
    rowScore += cell.row;
    colScore += cell.col;
  }

  return { rowScore, colScore, rounds: history };
}

/**
 * Round-robin tournament: every strategy plays every other strategy (including itself).
 * Each pairing plays once; both players' scores from that match accumulate, except
 * self-play, where only the row side's score counts (one entry, not two, per strategy).
 * Deterministic for a given `seed` — each pairing gets its own derived seed.
 *
 * @param matrix     - Payoff matrix to score each round against
 * @param rounds     - Number of rounds per match
 * @param seed       - [optional] Base PRNG seed for randomizing strategies (default: 1)
 * @param strategies - Strategies entered in the tournament
 * @returns          Total score per strategy id and a leaderboard sorted descending
 */
export function runTournament(
  strategies: Strategy[],
  matrix: PayoffMatrix,
  rounds: number,
  seed: number = 1
): TournamentResult {
  const scores: Record<string, number> = {};
  for (const s of strategies) scores[s.id] = 0;

  for (let i = 0; i < strategies.length; i++) {
    for (let j = i; j < strategies.length; j++) {
      const matchSeed = seed + i * strategies.length + j;
      const result = playMatch(strategies[i], strategies[j], matrix, rounds, matchSeed);
      scores[strategies[i].id] += result.rowScore;
      if (i !== j) scores[strategies[j].id] += result.colScore;
    }
  }

  const ranking = Object.entries(scores)
    .map(([strategyId, score]) => ({ strategyId, score }))
    .sort((a, b) => b.score - a.score);

  return { scores, ranking };
}
