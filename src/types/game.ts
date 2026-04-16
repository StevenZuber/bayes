export type Action = "C" | "D";

export interface PayoffCell {
  /** Row player's payoff */
  row: number;
  /** Column player's payoff */
  col: number;
}

/**
 * 2x2 payoff matrix indexed as matrix[rowAction][colAction].
 * Conventionally: C = cooperate, D = defect.
 */
export type PayoffMatrix = Record<Action, Record<Action, PayoffCell>>;

export interface GameAnalysis {
  /** The row player's dominant action, if one exists. */
  rowDominant: Action | null;
  /** The column player's dominant action, if one exists. */
  colDominant: Action | null;
  /** Cells that are pure-strategy Nash equilibria. */
  nashEquilibria: Array<{ row: Action; col: Action }>;
  /** Cells that are Pareto-optimal (no cell strictly dominates them for both players). */
  paretoOptimal: Array<{ row: Action; col: Action }>;
}

export interface GameScenario {
  id: string;
  name: string;
  description: string;
  matrix: PayoffMatrix;
  /** Labels used in visualization (e.g. "Stay silent" vs "Cooperate"). */
  labels: {
    cooperate: string;
    defect: string;
    rowPlayer: string;
    colPlayer: string;
  };
}

/** One round of iterated play: what each player chose. */
export interface Round {
  row: Action;
  col: Action;
}

/**
 * A strategy is a pure function from history → next action.
 * `history` contains all rounds so far (row = this player, col = opponent).
 */
export interface Strategy {
  id: string;
  name: string;
  description: string;
  play: (history: Round[]) => Action;
}

export interface MatchResult {
  rowScore: number;
  colScore: number;
  rounds: Round[];
}

export interface TournamentResult {
  /** Strategy id → total score across all matches */
  scores: Record<string, number>;
  /** Sorted leaderboard */
  ranking: Array<{ strategyId: string; score: number }>;
}
