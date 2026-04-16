import {
  OUTCOMES,
  OUTCOME_LABELS,
  OUTCOME_SHORT_LABELS,
  outcomeColors,
} from "@/lib/outcomes";

describe("outcomes", () => {
  it("has labels for every outcome", () => {
    for (const outcome of OUTCOMES) {
      expect(OUTCOME_LABELS[outcome]).toBeTruthy();
      expect(OUTCOME_SHORT_LABELS[outcome]).toBeTruthy();
    }
  });

  it("maps outcomes onto theme tokens", () => {
    const fakeColors = {
      tp: "#tp",
      fp: "#fp",
      tn: "#tn",
      fn: "#fn",
      tpText: "#tpText",
      fpText: "#fpText",
      tnText: "#tnText",
      fnText: "#fnText",
    } as Parameters<typeof outcomeColors>[0];

    const palette = outcomeColors(fakeColors);

    expect(palette["true-positive"]).toEqual({ bg: "#tp", text: "#tpText" });
    expect(palette["false-positive"]).toEqual({ bg: "#fp", text: "#fpText" });
    expect(palette["true-negative"]).toEqual({ bg: "#tn", text: "#tnText" });
    expect(palette["false-negative"]).toEqual({ bg: "#fn", text: "#fnText" });
  });
});
