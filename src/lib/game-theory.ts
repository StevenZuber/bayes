import type { Action, GameAnalysis, PayoffMatrix } from "@/types/game";

export const ACTIONS: Action[] = ["C", "D"];

/**
 * Classic Prisoner's Dilemma payoffs: T > R > P > S and 2R > T + S.
 * T=5 (Temptation), R=3 (Reward), P=1 (Punishment), S=0 (Sucker).
 */
export const CLASSIC_PD: PayoffMatrix = {
  C: {
    C: { row: 3, col: 3 },
    D: { row: 0, col: 5 },
  },
  D: {
    C: { row: 5, col: 0 },
    D: { row: 1, col: 1 },
  },
};

/**
 * A player has a dominant strategy if one action yields a strictly higher
 * payoff than the alternative against every opponent action.
 */
export function rowDominant(m: PayoffMatrix): Action | null {
  const cOverD = m.C.C.row > m.D.C.row && m.C.D.row > m.D.D.row;
  const dOverC = m.D.C.row > m.C.C.row && m.D.D.row > m.C.D.row;
  return cOverD ? "C" : dOverC ? "D" : null;
}

export function colDominant(m: PayoffMatrix): Action | null {
  const cOverD = m.C.C.col > m.C.D.col && m.D.C.col > m.D.D.col;
  const dOverC = m.C.D.col > m.C.C.col && m.D.D.col > m.D.C.col;
  return cOverD ? "C" : dOverC ? "D" : null;
}

/**
 * A cell is a pure-strategy Nash equilibrium if neither player can improve
 * their payoff by unilaterally deviating from it.
 */
export function findNashEquilibria(m: PayoffMatrix): Array<{ row: Action; col: Action }> {
  const eq: Array<{ row: Action; col: Action }> = [];
  for (const r of ACTIONS) {
    for (const c of ACTIONS) {
      const rowOther: Action = r === "C" ? "D" : "C";
      const colOther: Action = c === "C" ? "D" : "C";
      const rowStable = m[r][c].row >= m[rowOther][c].row;
      const colStable = m[r][c].col >= m[r][colOther].col;
      if (rowStable && colStable) eq.push({ row: r, col: c });
    }
  }
  return eq;
}

/** Cells where no other cell gives both players at least as much (with at least one strict). */
export function findParetoOptimal(m: PayoffMatrix): Array<{ row: Action; col: Action }> {
  const all: Array<{ row: Action; col: Action }> = [];
  for (const r of ACTIONS) for (const c of ACTIONS) all.push({ row: r, col: c });

  return all.filter(({ row: r, col: c }) => {
    return !all.some(({ row: r2, col: c2 }) => {
      if (r2 === r && c2 === c) return false;
      const a = m[r][c];
      const b = m[r2][c2];
      const weaklyBetter = b.row >= a.row && b.col >= a.col;
      const strictlyBetter = b.row > a.row || b.col > a.col;
      return weaklyBetter && strictlyBetter;
    });
  });
}

export function analyzeGame(m: PayoffMatrix): GameAnalysis {
  return {
    rowDominant: rowDominant(m),
    colDominant: colDominant(m),
    nashEquilibria: findNashEquilibria(m),
    paretoOptimal: findParetoOptimal(m),
  };
}

export function cellKey(row: Action, col: Action): string {
  return `${row}${col}`;
}
