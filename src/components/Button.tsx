import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const base =
  "group inline-flex items-center justify-center gap-2.5 font-sans text-sm font-medium tracking-wide " +
  "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-40 disabled:pointer-events-none";

const variants = {
  /** The one that matters. Brass on dark. */
  primary:
    "bg-brass-400 text-olive-950 px-7 py-4 hover:bg-brass-300 hover:-translate-y-0.5 " +
    "shadow-[0_0_0_0_rgba(183,163,92,0.35)] hover:shadow-[0_10px_30px_-10px_rgba(183,163,92,0.6)]",
  /** On olive fields. */
  outline:
    "border border-paper/25 text-paper px-7 py-4 hover:border-brass-400 hover:text-brass-300 " +
    "hover:bg-paper/[0.03]",
  /** On sand / light fields. */
  dark: "bg-olive-600 text-paper px-7 py-4 hover:bg-olive-700 hover:-translate-y-0.5 " +
    "shadow-[0_10px_30px_-18px_rgba(34,40,21,0.9)]",
  outlineDark:
    "border border-olive-900/25 text-olive-900 px-7 py-4 hover:border-olive-600 hover:bg-olive-900/[0.04]",
  /** Text-only, with the arrow rule that slides. */
  link: "text-brass-300 hover:text-brass-200 py-1",
} as const;

type Variant = keyof typeof variants;

function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
    >
      <path
        d="M1 8h13M9 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function ButtonLink({
  children,
  variant = "primary",
  arrow = false,
  className = "",
  ...props
}: ComponentProps<typeof Link> & {
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
}) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  arrow = false,
  className = "",
  ...props
}: ComponentProps<"button"> & {
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
}) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
