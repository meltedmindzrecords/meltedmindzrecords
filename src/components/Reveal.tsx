import type { CSSProperties, ElementType, ReactNode } from "react";

/** Fades and lifts its content in when it scrolls into view (see RevealObserver). */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  color = false,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger, in ms. */
  delay?: number;
  /** Photos inside go from grey to color as they appear. */
  color?: boolean;
  className?: string;
}) {
  return (
    <Tag
      className={`reveal ${color ? "reveal-color" : ""} ${className}`}
      style={delay ? ({ "--d": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
