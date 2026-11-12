"use client";

import { useEffect } from "react";

export type ToastMsg = { kind: "ok" | "error"; text: string } | null;

export function Toast({ toast, onDone }: { toast: ToastMsg; onDone: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDone, 6000);
    return () => clearTimeout(t);
  }, [toast, onDone]);
  if (!toast) return null;
  return (
    <p
      role="status"
      className={`mt-6 rounded-xl px-4 py-3 text-[15px] ${
        toast.kind === "ok" ? "bg-emerald-500/15 text-emerald-100" : "bg-red-500/15 text-red-100"
      }`}
    >
      {toast.text}
    </p>
  );
}

export function PageHead({ title, intro, children }: { title: string; intro?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {intro && <p className="mt-1 max-w-2xl text-[15px] leading-6 text-white/70">{intro}</p>}
      </div>
      {children}
    </div>
  );
}
