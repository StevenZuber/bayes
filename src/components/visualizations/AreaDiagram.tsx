"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BayesParams } from "@/types";
import { calculateBayes, formatPercent } from "@/lib/bayes";
import { useThemeColors } from "@/lib/theme-colors";
import { OUTCOME_SHORT_LABELS, outcomeColors } from "@/lib/outcomes";

interface AreaDiagramProps {
  params: BayesParams;
  phase?: "prior" | "evidence" | "full";
  className?: string;
}

export default function AreaDiagram({
  params,
  phase = "full",
  className = "",
}: AreaDiagramProps) {
  const result = calculateBayes(params);
  const colors = useThemeColors();
  const palette = useMemo(() => outcomeColors(colors), [colors]);
  const { prevalence, sensitivity, specificity } = params;

  const leftWidth = Math.max(prevalence, 0.02);
  const rightWidth = 1 - leftWidth;

  const leftTopHeight = sensitivity;
  const rightTopHeight = 1 - specificity;

  const containerHeight = 320;

  return (
    <div className={className}>
      <div
        className="relative border border-separator rounded-lg overflow-hidden"
        style={{ height: containerHeight, width: "100%" }}
      >
        {phase === "prior" ? (
          <>
            <motion.div
              className="absolute top-0 left-0 h-full flex items-center justify-center"
              initial={false}
              animate={{
                width: `${leftWidth * 100}%`,
                backgroundColor: colors.priorBlock,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center px-1">
                <div className="text-sm font-semibold" style={{ color: colors.priorText }}>
                  Has condition
                </div>
                <div className="text-lg font-bold" style={{ color: colors.priorValue }}>
                  {formatPercent(prevalence)}
                </div>
              </div>
            </motion.div>
            <motion.div
              className="absolute top-0 h-full flex items-center justify-center"
              initial={false}
              animate={{
                left: `${leftWidth * 100}%`,
                width: `${rightWidth * 100}%`,
                backgroundColor: colors.noConditionBlock,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center px-1">
                <div className="text-sm font-semibold" style={{ color: colors.noConditionText }}>
                  No condition
                </div>
                <div className="text-lg font-bold" style={{ color: colors.noConditionValue }}>
                  {formatPercent(1 - prevalence)}
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            <AreaBlock
              color={palette["true-positive"].bg}
              textColor={palette["true-positive"].text}
              label={OUTCOME_SHORT_LABELS["true-positive"]}
              value={result.truePositives}
              x={0}
              y={0}
              width={leftWidth}
              height={leftTopHeight}
              containerHeight={containerHeight}
              showLabel={phase === "full"}
            />
            <AreaBlock
              color={palette["false-negative"].bg}
              textColor={palette["false-negative"].text}
              label={OUTCOME_SHORT_LABELS["false-negative"]}
              value={result.falseNegatives}
              x={0}
              y={leftTopHeight}
              width={leftWidth}
              height={1 - leftTopHeight}
              containerHeight={containerHeight}
              showLabel={phase === "full"}
            />
            <AreaBlock
              color={palette["false-positive"].bg}
              textColor={palette["false-positive"].text}
              label={OUTCOME_SHORT_LABELS["false-positive"]}
              value={result.falsePositives}
              x={leftWidth}
              y={0}
              width={rightWidth}
              height={rightTopHeight}
              containerHeight={containerHeight}
              showLabel={phase === "full"}
            />
            <AreaBlock
              color={palette["true-negative"].bg}
              textColor={palette["true-negative"].text}
              label={OUTCOME_SHORT_LABELS["true-negative"]}
              value={result.trueNegatives}
              x={leftWidth}
              y={rightTopHeight}
              width={rightWidth}
              height={1 - rightTopHeight}
              containerHeight={containerHeight}
              showLabel={phase === "full"}
            />

            {/* Column labels */}
            <div
              className="absolute left-0 w-full flex text-xs font-medium"
              style={{ top: -24 }}
            >
              <motion.div
                initial={false}
                animate={{ width: `${leftWidth * 100}%` }}
                transition={{ duration: 0.5 }}
                className="text-center"
                style={{ color: colors.accentRed }}
              >
                P(A) = {formatPercent(prevalence)}
              </motion.div>
              <motion.div
                initial={false}
                animate={{ width: `${rightWidth * 100}%` }}
                transition={{ duration: 0.5 }}
                className="text-center text-text-tertiary"
              >
                P(¬A) = {formatPercent(1 - prevalence)}
              </motion.div>
            </div>

            {/* Posterior highlight */}
            {phase === "full" && (
              <motion.div
                className="absolute top-0 border-4 border-yellow-400 rounded-sm pointer-events-none"
                initial={false}
                animate={{
                  left: 0,
                  width: `${leftWidth * 100}%`,
                  height: `${leftTopHeight * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            )}
          </>
        )}
      </div>

      {phase === "full" && (() => {
        const totalPos = result.truePositives + result.falsePositives;
        const displayPosterior = totalPos > 0 ? result.truePositives / totalPos : 0;
        return (
          <div className="mt-3 text-center">
            <span className="text-sm text-text-tertiary">
              P(A|B) ={" "}
            </span>
            <span className="text-sm font-mono">
              <span style={{ color: colors.accentRed }}>{result.truePositives} TP</span>
              {" / ("}
              <span style={{ color: colors.accentRed }}>{result.truePositives} TP</span>
              {" + "}
              <span style={{ color: colors.accentOrange }}>{result.falsePositives} FP</span>
              {") = "}
            </span>
            <span className="font-bold text-lg text-foreground">
              {formatPercent(displayPosterior)}
            </span>
          </div>
        );
      })()}
    </div>
  );
}

function AreaBlock({
  color,
  textColor,
  label,
  value,
  x,
  y,
  width,
  height,
  containerHeight,
  showLabel,
}: {
  color: string;
  textColor: string;
  label: string;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
  containerHeight: number;
  showLabel: boolean;
}) {
  const pixelHeight = Math.max(height * containerHeight, 4);
  const showText = pixelHeight > 30 && width > 0.04;

  return (
    <motion.div
      className="absolute flex flex-col items-center justify-center"
      initial={false}
      animate={{
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        width: `${width * 100}%`,
        height: `${height * 100}%`,
        backgroundColor: color,
        opacity: 0.85,
      }}
      transition={{ duration: 0.5 }}
    >
      {showLabel && showText && (
        <>
          <div className="text-xs font-semibold opacity-90" style={{ color: textColor }}>{label}</div>
          <div className="text-sm font-bold" style={{ color: textColor }}>{value}</div>
        </>
      )}
    </motion.div>
  );
}
