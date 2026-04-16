import { CLASSIC_PD } from "@/lib/game-theory";
import {
  STRATEGIES,
  getStrategy,
  playMatch,
  runTournament,
} from "@/lib/strategies";

describe("strategies", () => {
  it("tit-for-tat cooperates on round 1, then copies opponent", () => {
    const tft = getStrategy("tit-for-tat");
    expect(tft.play([])).toBe("C");
    expect(tft.play([{ row: "C", col: "D" }])).toBe("D");
    expect(tft.play([{ row: "D", col: "C" }])).toBe("C");
  });

  it("always-defect vs always-cooperate: defector wins, cooperator gets sucker payoff", () => {
    const result = playMatch(
      getStrategy("always-defect"),
      getStrategy("always-cooperate"),
      CLASSIC_PD,
      10
    );
    expect(result.rowScore).toBe(50); // T=5 × 10
    expect(result.colScore).toBe(0);  // S=0 × 10
  });

  it("tit-for-tat vs always-defect loses round 1 only", () => {
    const result = playMatch(
      getStrategy("tit-for-tat"),
      getStrategy("always-defect"),
      CLASSIC_PD,
      10
    );
    // Round 1: TfT cooperates, AD defects → row=0, col=5
    // Rounds 2-10: both defect → row=1, col=1 each round
    expect(result.rowScore).toBe(0 + 9 * 1);
    expect(result.colScore).toBe(5 + 9 * 1);
  });

  it("grim-trigger never cooperates after a defection", () => {
    const grim = getStrategy("grim-trigger");
    expect(grim.play([])).toBe("C");
    expect(grim.play([{ row: "C", col: "C" }])).toBe("C");
    expect(grim.play([{ row: "C", col: "D" }, { row: "D", col: "C" }])).toBe("D");
  });

  it("tournament scores sum consistently", () => {
    const result = runTournament(STRATEGIES, CLASSIC_PD, 20);
    expect(Object.keys(result.scores)).toHaveLength(STRATEGIES.length);
    expect(result.ranking).toHaveLength(STRATEGIES.length);
    // Ranking is sorted descending.
    for (let i = 1; i < result.ranking.length; i++) {
      expect(result.ranking[i - 1].score).toBeGreaterThanOrEqual(
        result.ranking[i].score
      );
    }
  });
});
