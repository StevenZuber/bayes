import {
  CLASSIC_PD,
  analyzeGame,
  colDominant,
  findNashEquilibria,
  findParetoOptimal,
  rowDominant,
} from "@/lib/game-theory";
import type { PayoffMatrix } from "@/types/game";

describe("game-theory: Prisoner's Dilemma", () => {
  it("detects D as the dominant strategy for both players", () => {
    expect(rowDominant(CLASSIC_PD)).toBe("D");
    expect(colDominant(CLASSIC_PD)).toBe("D");
  });

  it("finds (D, D) as the unique Nash equilibrium", () => {
    const eq = findNashEquilibria(CLASSIC_PD);
    expect(eq).toEqual([{ row: "D", col: "D" }]);
  });

  it("(D, D) is Nash but not Pareto optimal; (C, C) is Pareto optimal", () => {
    const pareto = findParetoOptimal(CLASSIC_PD);
    const has = (r: "C" | "D", c: "C" | "D") =>
      pareto.some((p) => p.row === r && p.col === c);
    expect(has("D", "D")).toBe(false);
    expect(has("C", "C")).toBe(true);
  });

  it("analyzeGame bundles all four facts", () => {
    const a = analyzeGame(CLASSIC_PD);
    expect(a.rowDominant).toBe("D");
    expect(a.colDominant).toBe("D");
    expect(a.nashEquilibria).toHaveLength(1);
    expect(a.paretoOptimal.length).toBeGreaterThan(0);
  });
});

describe("game-theory: Stag Hunt", () => {
  // Classic stag hunt: (4,4) stag/stag dominates coordinate-wise, but (hare, hare)
  // is also a Nash equilibrium. No dominant strategy exists.
  const STAG: PayoffMatrix = {
    C: { C: { row: 4, col: 4 }, D: { row: 0, col: 2 } },
    D: { C: { row: 2, col: 0 }, D: { row: 2, col: 2 } },
  };

  it("has no dominant strategy", () => {
    expect(rowDominant(STAG)).toBeNull();
    expect(colDominant(STAG)).toBeNull();
  });

  it("has two pure Nash equilibria: (C,C) and (D,D)", () => {
    const eq = findNashEquilibria(STAG);
    expect(eq).toHaveLength(2);
    expect(eq).toContainEqual({ row: "C", col: "C" });
    expect(eq).toContainEqual({ row: "D", col: "D" });
  });
});
