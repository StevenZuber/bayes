"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeColors } from "@/lib/theme-colors";

export interface LessonShellProps {
  steps: ReactNode[];
  /** Where the final "Continue" becomes a link; provide label + href. */
  finish?: { label: string; href: string };
}

export default function LessonShell({ steps, finish }: LessonShellProps) {
  const [step, setStep] = useState(0);
  const colors = useThemeColors();
  const total = steps.length;

  const next = () => setStep((s) => Math.min(s + 1, total - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex justify-between text-xs text-text-tertiary mb-1">
          <span>
            Step {step + 1} of {total}
          </span>
          <span>{Math.round(((step + 1) / total) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: colors.accentIndigo }}
            initial={false}
            animate={{ width: `${((step + 1) / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center mt-12 pt-6 border-t border-separator gap-3">
        <button
          onClick={prev}
          disabled={step === 0}
          className="min-h-[44px] px-4 py-2 text-sm font-medium text-text-secondary hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>
        <nav className="flex" aria-label="Lesson steps">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`Go to step ${i + 1} of ${total}`}
              aria-current={i === step ? "step" : undefined}
              className="flex items-center justify-center w-11 h-11"
            >
              <span
                aria-hidden="true"
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step
                    ? "bg-accent"
                    : i < step
                      ? "bg-accent-muted"
                      : "bg-surface-elevated"
                }`}
              />
            </button>
          ))}
        </nav>
        {step < total - 1 ? (
          <button
            onClick={next}
            className="min-h-[44px] px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: colors.accentIndigo }}
          >
            Continue
          </button>
        ) : finish ? (
          <Link
            href={finish.href}
            className="inline-flex items-center min-h-[44px] px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: colors.accentPurple }}
          >
            {finish.label}
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
