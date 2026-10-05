import type { ReactNode } from "react";

/**
 * The corner-bracket motif lifted straight off the logo: one mark at the
 * top-right, one at the bottom-left. It reads as a crop mark — framing
 * something for close study, which is what a "lab" does.
 *
 * Used sparingly and always in the same orientation as the logo, so the
 * repetition registers as a system rather than decoration.
 */

type Corners = "diagonal" | "all" | "top-right" | "bottom-left";

const armSize = {
  sm: "w-5 h-5 md:w-6 md:h-6",
  md: "w-8 h-8 md:w-12 md:h-12",
  lg: "w-12 h-12 md:w-20 md:h-20",
} as const;

const strokeWidth = {
  sm: "border-[1.5px]",
  md: "border-2",
  lg: "border-2 md:border-[3px]",
} as const;

export function Bracket({
  children,
  corners = "diagonal",
  size = "md",
  tone = "border-brass-400",
  inset = "-inset-4 md:-inset-8",
  className = "",
}: {
  children?: ReactNode;
  corners?: Corners;
  size?: keyof typeof armSize;
  /** Any Tailwind border-color class. */
  tone?: string;
  /** How far the frame sits outside the content box. */
  inset?: string;
  className?: string;
}) {
  const showTR = corners === "diagonal" || corners === "all" || corners === "top-right";
  const showBL =
    corners === "diagonal" || corners === "all" || corners === "bottom-left";
  const showTL = corners === "all";
  const showBR = corners === "all";

  const arm = `${armSize[size]} ${strokeWidth[size]} ${tone} absolute`;

  return (
    <div className={`relative ${className}`}>
      <div className={`pointer-events-none absolute ${inset}`} aria-hidden="true">
        {showTL && <span className={`${arm} top-0 left-0 border-r-0 border-b-0`} />}
        {showTR && <span className={`${arm} top-0 right-0 border-l-0 border-b-0`} />}
        {showBL && <span className={`${arm} bottom-0 left-0 border-r-0 border-t-0`} />}
        {showBR && <span className={`${arm} bottom-0 right-0 border-l-0 border-t-0`} />}
      </div>
      {children}
    </div>
  );
}

/**
 * Standalone mark — the same bracket used as a section opener, e.g. above a
 * heading where a lesser site would put an icon.
 */
export function BracketMark({
  className = "",
  tone = "border-brass-400",
}: {
  className?: string;
  tone?: string;
}) {
  return (
    <span
      className={`inline-block relative w-7 h-7 shrink-0 ${className}`}
      aria-hidden="true"
    >
      <span className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${tone}`} />
      <span
        className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${tone}`}
      />
    </span>
  );
}
