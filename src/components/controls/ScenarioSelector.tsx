"use client";

import { scenarios } from "@/lib/scenarios";
import { Scenario } from "@/types";

interface ScenarioSelectorProps {
  activeId: string;
  onSelect: (scenario: Scenario) => void;
}

export default function ScenarioSelector({
  activeId,
  onSelect,
}: ScenarioSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => onSelect(scenario)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeId === scenario.id
              ? "bg-indigo-600 text-white"
              : "bg-surface-elevated text-text-secondary hover:bg-separator hover:text-foreground"
          }`}
        >
          {scenario.name}
        </button>
      ))}
    </div>
  );
}
