"use client";

import { useEffect, useState } from "react";

import { LinkIcon } from "@/components/Icons";
import { LABEL_TIME_ZONE } from "@/lib/time";

type Link = { label: string; href: string | null | undefined };

/*
 * Live countdown to a release. The server renders the numbers for its own
 * "now" (passed in), the browser starts from that same value so nothing
 * flashes, then corrects to the real time and ticks once a second. At zero
 * it turns into "Out now".
 *
 * Screen readers: the ticking boxes are aria-live="off" (no chatter every
 * second) and a visually hidden line says when it comes out. The flip to
 * "Out now" is a polite status message.
 */

const UNITS = [
  { key: "d", label: "Days", short: "Days" },
  { key: "h", label: "Hours", short: "Hrs" },
  { key: "m", label: "Minutes", short: "Min" },
  { key: "s", label: "Seconds", short: "Sec" },
] as const;

/** Card-size button text: the platform alone ("Spotify"), the full words stay for screen readers. */
function shortLabel(label: string): string {
  if (label === "Pre-save (all platforms)") return "All platforms";
  return label.replace(/^Pre-save on /, "");
}

function parts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

/** "Friday, November 20, 2026" (+ " at 6:00 PM CST" when it is not midnight). */
export function releaseMoment(iso: string): string {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: LABEL_TIME_ZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: LABEL_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
  return /^12:00\s?AM/.test(time) ? date : `${date} at ${time}`;
}

export default function Countdown({
  to,
  serverNow,
  size = "lg",
  className = "",
  before = [],
  after = [],
  name,
}: {
  /** ISO moment it comes out. */
  to: string;
  /** The server's clock when it rendered (ms), so the first paint matches. */
  serverNow: number;
  size?: "lg" | "sm";
  className?: string;
  /** Buttons while it is counting down (pre-save links), the main action. */
  before?: Link[];
  /** Buttons once it is out (the normal streaming links). */
  after?: Link[];
  /** The release title, so screen readers hear which release a button is for. */
  name?: string;
}) {
  const target = Date.parse(to);
  const [now, setNow] = useState(serverNow);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (t < target) timer = setTimeout(tick, 1000 - (t % 1000) + 5);
    };
    timer = setTimeout(tick, 0);
    return () => clearTimeout(timer);
  }, [target]);

  const left = target - now;
  const when = releaseMoment(to);

  const lg = size === "lg";
  const out = !(left > 0);
  const buttons = (out ? after : before).filter((l): l is { label: string; href: string } => !!l.href);
  const actions = buttons.length > 0 && (
    <div className={lg ? "mt-6 flex flex-wrap gap-3" : "mt-3 flex flex-col gap-2"}>
      {buttons.map(({ label, href }, i) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`caps inline-flex items-center justify-center gap-2.5 transition ${
            lg ? "w-full px-8 py-4 text-[15px] hover:-translate-y-0.5 sm:w-auto" : "w-full px-3 py-3 text-[12.5px]"
          } ${
            i === 0
              ? "bg-molten text-black hover:bg-white"
              : "border border-white/50 text-white hover:border-white hover:bg-white hover:text-black"
          }`}
        >
          <LinkIcon label={label} className={lg ? "text-lg" : "text-[15px]"} />
          {lg || buttons.length === 1 ? (
            <span>
              {label}
              {name && <span className="sr-only">: {name}</span>}
            </span>
          ) : (
            <span>
              <span aria-hidden="true">{shortLabel(label)}</span>
              <span className="sr-only">
                {label}
                {name && `: ${name}`}
              </span>
            </span>
          )}
        </a>
      ))}
    </div>
  );

  if (out) {
    return (
      <div className={className}>
        <p role="status" className="countdown-out flex items-center gap-3">
          <span className="pulse-dot inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-molten" aria-hidden="true" />
          <span className={`display text-white ${lg ? "text-[3.6rem] sm:text-[5rem]" : "text-[1.9rem] sm:text-[2.3rem]"}`}>
            Out now
          </span>
        </p>
        {actions}
      </div>
    );
  }

  const p = parts(left);

  return (
    <div className={className}>
      <p className="sr-only">Releases on {when}</p>
      <div
        role="timer"
        aria-live="off"
        aria-atomic="true"
        className={`countdown grid grid-cols-4 ${lg ? "gap-2 sm:gap-3" : "gap-1.5"}`}
      >
        {UNITS.map((u) => {
          const v = p[u.key];
          const text = String(v).padStart(2, "0");
          return (
            <div
              key={u.key}
              className={`countdown-cell flex flex-col items-center justify-center border text-center ${
                lg
                  ? "border-white/15 bg-white/[0.04] px-1 pb-3 pt-4 sm:pb-4 sm:pt-6"
                  : "border-white/15 bg-white/[0.04] px-0.5 pb-1.5 pt-2"
              } ${u.key === "s" ? "countdown-hot" : ""}`}
            >
              <span
                className={`display countdown-num tabular-nums ${u.key === "s" ? "text-molten" : "text-white"} ${
                  lg ? "text-[3.4rem] sm:text-[5.5rem] lg:text-[6.5rem]" : "text-[1.7rem] sm:text-[2rem]"
                }`}
              >
                <span key={u.key === "s" ? text : undefined} className={u.key === "s" ? "countdown-tick" : undefined}>
                  <span className="fig">{text}</span>
                </span>
              </span>
              <span className={`caps ${lg ? "mt-2 text-[11px] sm:mt-3 sm:text-[13px]" : "mt-1 text-[9.5px] sm:text-[10.5px]"} text-white/70`}>
                <span className="sr-only">{u.label}</span>
                <span aria-hidden="true">{lg ? u.label : u.short}</span>
              </span>
            </div>
          );
        })}
      </div>
      {actions}
    </div>
  );
}
