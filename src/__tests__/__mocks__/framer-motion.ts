import React from "react";

// Minimal Framer Motion mock for jsdom. Strips animation-only props and renders
// a plain DOM element so tests can assert on structure and text content.
const ANIMATION_PROPS = new Set([
  "initial",
  "animate",
  "exit",
  "transition",
  "variants",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileInView",
  "whileDrag",
  "layout",
  "layoutId",
  "drag",
  "dragConstraints",
  "onAnimationStart",
  "onAnimationComplete",
]);

function stripMotionProps<T extends Record<string, unknown>>(props: T): T {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (!ANIMATION_PROPS.has(key)) out[key] = props[key];
  }
  return out as T;
}

type MotionProxy = {
  [tag: string]: React.ComponentType<Record<string, unknown>>;
};

export const motion: MotionProxy = new Proxy(
  {},
  {
    get: (_target, tag: string) => {
      const Component = React.forwardRef<
        HTMLElement,
        Record<string, unknown> & { children?: React.ReactNode }
      >((props, ref) =>
        React.createElement(
          tag,
          { ...stripMotionProps(props), ref },
          (props as { children?: React.ReactNode }).children,
        ),
      );
      Component.displayName = `motion.${tag}`;
      return Component;
    },
  },
) as MotionProxy;

export const AnimatePresence = ({
  children,
}: {
  children: React.ReactNode;
}) => React.createElement(React.Fragment, null, children);
