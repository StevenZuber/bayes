"use client";

import { useId } from "react";
import { formatPercent } from "@/lib/bayes";

interface ProbabilitySliderProps {
  label: string;
  sublabel?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  color?: string;
}

export default function ProbabilitySlider({
  label,
  sublabel,
  value,
  onChange,
  min = 0.001,
  max = 0.999,
  step = 0.001,
  disabled = false,
  color = "#818cf8",
}: ProbabilitySliderProps) {
  const id = useId();
  const fullLabel = sublabel ? `${label} ${sublabel}` : label;
  return (
    <div className={`${disabled ? "opacity-40 pointer-events-none" : ""}`}>
      <div className="flex items-baseline justify-between mb-1">
        <label htmlFor={id} className="cursor-pointer">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {sublabel && (
            <span className="text-xs text-text-tertiary ml-1.5">{sublabel}</span>
          )}
        </label>
        <span className="text-sm font-mono font-semibold" style={{ color }}>
          {formatPercent(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        aria-label={fullLabel}
        aria-valuetext={formatPercent(value)}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{ accentColor: color, color }}
      />
    </div>
  );
}
