"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SITE_IMAGES_BUCKET } from "@/lib/supabaseBrowser";
import { releaseInstant } from "@/lib/time";

import { useAdmin } from "./AdminShell";
import { slugify, type CmsConfig, type Field, type Row } from "./cms";

type Toast = { kind: "ok" | "error"; text: string } | null;

/** Turns a stored path ("/artists/x.jpg") or URL into something an <img> can show. */
function previewSrc(v: unknown): string | null {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

export default function CmsManager({ config }: { config: CmsConfig }) {
  const { supabase, session } = useAdmin();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [artistNames, setArtistNames] = useState<string[]>([]);

  const filterKey = JSON.stringify(config.filter ?? {});
  const load = useCallback(async () => {
    let query = supabase.from(config.table).select("*");
    for (const [k, v] of Object.entries(JSON.parse(filterKey) as Record<string, string>)) query = query.eq(k, v);
    const { data, error } = await query
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
    if (error) {
      setLoadError(error.message);
      setRows([]);
    } else {
      setLoadError("");
      setRows((data ?? []) as Row[]);
    }
  }, [supabase, config.table, filterKey]);

  useEffect(() => {
    load();
  }, [load]);

  // Dashboard quick links open the "new" form directly (?new=1).
  const openedNew = useRef(false);

  useEffect(() => {
    if (!config.fields.some((f) => f.type === "artist")) return;
    supabase
      .from("artists")
      .select("name")
      .order("sort_order")
      .then(({ data }) => setArtistNames((data ?? []).map((a) => String(a.name))));
  }, [supabase, config.fields]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  /** Ask the site to rebuild its pages now (otherwise it refreshes within a minute). */
  const refreshSite = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }, [session.access_token]);

  const afterChange = async (verb: string) => {
    const live = await refreshSite();
    setToast({
      kind: "ok",
      text: live ? `${verb}. It's live on the website now.` : `${verb}. The website will show it within a minute.`,
    });
    await load();
  };

  const startNew = useCallback(() => {
    const maxOrder = Math.max(0, ...(rows ?? []).map((r) => Number(r.sort_order) || 0));
    const blank: Row = { visible: true, sort_order: maxOrder + 10, ...(config.filter ?? {}) };
    for (const f of config.fields) if (f.type === "bool" && f.key !== "visible") blank[f.key] = false;
    setEditing(blank);
  }, [rows, config]);

  useEffect(() => {
    if (openedNew.current || rows === null) return;
    if (new URLSearchParams(window.location.search).get("new") === "1") {
      openedNew.current = true;
      startNew();
    }
  }, [rows, startNew]);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  /** Saves a new order: rows get 10, 20, 30… and only changed rows are written. */
  const saveOrder = async (next: Row[]) => {
    setRows(next);
    setSavingOrder(true);
    const changes = next
      .map((r, i) => ({ r, order: (i + 1) * 10 }))
      .filter(({ r, order }) => Number(r.sort_order) !== order);
    const results = await Promise.all(
      changes.map(({ r, order }) => supabase.from(config.table).update({ sort_order: order }).eq("id", r.id!))
    );
    setSavingOrder(false);
    const failed = results.find((x) => x.error);
    if (failed?.error) {
      setToast({ kind: "error", text: `Couldn't save the new order: ${failed.error.message}` });
      await load();
      return;
    }
    if (changes.length > 0) await afterChange("New order saved");
  };

  const move = (from: number, to: number) => {
    if (!rows || to < 0 || to >= rows.length || from === to) return;
    const next = [...rows];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    saveOrder(next);
  };

  const confirmDelete = async () => {
    if (!deleting?.id) return;
    const name = String(deleting[config.titleKey] ?? config.singular);
    const { error } = await supabase.from(config.table).delete().eq("id", deleting.id);
    setDeleting(null);
    if (error) setToast({ kind: "error", text: `Couldn't delete: ${error.message}` });
    else await afterChange(`Deleted “${name}”`);
  };

  return (
    <section aria-labelledby="cms-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="cms-title" className="text-3xl font-semibold tracking-tight">{config.plural}</h1>
          <p className="mt-1 max-w-2xl text-[15px] leading-6 text-white/70">{config.intro}</p>
        </div>
        {!editing && (
          <button type="button" onClick={startNew} className="admin-btn admin-btn-primary">
            + Add {config.singular}
          </button>
        )}
      </div>

      {toast && (
        <p
          role="status"
          className={`mt-6 rounded-xl px-4 py-3 text-[15px] ${
            toast.kind === "ok" ? "bg-emerald-500/15 text-emerald-100" : "bg-red-500/15 text-red-100"
          }`}
        >
          {toast.text}
        </p>
      )}

      {editing ? (
        <Editor
          key={String(editing.id ?? "new")}
          config={config}
          initial={editing}
          artistNames={artistNames}
          onCancel={() => setEditing(null)}
          onSaved={async (verb) => {
            setEditing(null);
            await afterChange(verb);
          }}
          onError={(text) => setToast({ kind: "error", text })}
        />
      ) : rows === null ? (
        <p className="mt-10 text-white/70" role="status">Loading…</p>
      ) : (
        <>
          {loadError && <p className="mt-6 text-red-300" role="alert">Couldn't load: {loadError}</p>}
          {rows.length === 0 && !loadError ? (
            <div className="mt-8 rounded-2xl border border-dashed border-white/20 p-10 text-center text-white/70">
              Nothing here yet. Use “Add {config.singular}” to create the first one.
            </div>
          ) : (
            <ul className="mt-8 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              {rows.map((r, i) => {
                const img = config.imageKey ? previewSrc(r[config.imageKey]) : null;
                const title = String(r[config.titleKey] ?? "(untitled)");
                const scheduled = typeof r.publish_at === "string" && Date.parse(r.publish_at) > Date.now();
                return (
                  <li
                    key={String(r.id)}
                    draggable={!savingOrder}
                    onDragStart={(e) => {
                      setDragIndex(i);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragIndex !== null) move(dragIndex, i);
                      setDragIndex(null);
                    }}
                    onDragEnd={() => setDragIndex(null)}
                    className={`flex items-center gap-3 p-3 sm:gap-4 sm:p-4 ${dragIndex === i ? "opacity-40" : ""}`}
                  >
                    <div className="flex shrink-0 flex-col items-center gap-1">
                      <span aria-hidden="true" title="Drag to reorder" className="hidden cursor-grab select-none text-[18px] leading-none text-white/40 sm:block">⋮⋮</span>
                      <button
                        type="button"
                        onClick={() => move(i, i - 1)}
                        disabled={i === 0 || savingOrder}
                        aria-label={`Move ${title} up`}
                        className="admin-arrow"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, i + 1)}
                        disabled={i === rows.length - 1 || savingOrder}
                        aria-label={`Move ${title} down`}
                        className="admin-arrow"
                      >
                        ↓
                      </button>
                    </div>
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5 sm:h-16 sm:w-16">
                      {img ? (
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[11px] text-white/40">No image</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 break-words text-[15px] font-semibold leading-5 sm:text-[16px]">{title}</p>
                      <p className="truncate text-[13px] text-white/60">{config.subtitle(r)}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {r.visible === false && <Badge tone="muted">Hidden</Badge>}
                        {scheduled && (
                          <Badge tone="accent">Goes live {new Date(String(r.publish_at)).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</Badge>
                        )}
                        {r.featured === true && <Badge tone="accent">Homepage hero</Badge>}
                        {config.table === "releases" && isFutureRelease(r) && <Badge tone="accent">Countdown on</Badge>}
                      </div>
                      {config.viewUrl && r.visible !== false && !scheduled && (
                        <a
                          href={config.viewUrl(r)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-[13px] text-[#ff8a5c] underline-offset-4 hover:underline"
                        >
                          View on site ↗<span className="sr-only"> ({title})</span>
                        </a>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                      <button type="button" onClick={() => setEditing(r)} className="admin-btn admin-btn-sm" aria-label={`Edit ${title}`}>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(r)}
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        aria-label={`Delete ${title}`}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {rows.length > 1 && (
            <p className="mt-3 text-[13px] text-white/60" role="status">
              {savingOrder
                ? "Saving the new order…"
                : `Drag rows to reorder, or use the ↑ ↓ arrows.${config.orderNote ? " " + config.orderNote : ""}`}
            </p>
          )}
        </>
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete “${String(deleting[config.titleKey] ?? config.singular)}”?`}
          body={`This removes the ${config.singular} from the website for good. To take it down for now instead, edit it and untick “Show on the website”.`}
          confirmLabel="Delete"
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}
    </section>
  );
}

/** A release whose date (and optional time) in Central time is still ahead. */
function isFutureRelease(r: Row): boolean {
  const at = releaseInstant(r.release_date, r.release_time);
  return !!at && Date.parse(at) > Date.now();
}

export function Badge({ tone, children }: { tone: "muted" | "accent"; children: React.ReactNode }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[12px] font-medium ${
        tone === "accent" ? "bg-[#ff5a1f] text-black" : "bg-white/10 text-white/80"
      }`}
    >
      {children}
    </span>
  );
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  onCancel,
  onConfirm,
  busyLabel = "Deleting…",
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  busyLabel?: string;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-body"
        className="w-full max-w-md rounded-2xl border border-white/15 bg-zinc-900 p-6 shadow-2xl"
      >
        <h2 id="confirm-title" className="text-xl font-semibold">{title}</h2>
        <p id="confirm-body" className="mt-2 text-[15px] leading-6 text-white/75">{body}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button ref={cancelRef} type="button" onClick={onCancel} className="admin-btn">
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              onConfirm();
            }}
            className="admin-btn admin-btn-danger-solid"
          >
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Editor({
  config,
  initial,
  artistNames,
  onCancel,
  onSaved,
  onError,
}: {
  config: CmsConfig;
  initial: Row;
  artistNames: string[];
  onCancel: () => void;
  onSaved: (verb: string) => void;
  onError: (text: string) => void;
}) {
  const { supabase } = useAdmin();
  const [values, setValues] = useState<Row>(initial);
  const [saving, setSaving] = useState(false);
  const isNew = !initial.id;
  const set = (k: string, v: unknown) => setValues((prev) => ({ ...prev, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: Row = {};
    for (const f of config.fields) {
      let v = values[f.key];
      if (typeof v === "string") v = v.trim();
      if (f.type === "number") v = v === "" || v === undefined || v === null ? 100 : Number(v);
      if (f.type === "bool") v = v === true;
      if ((f.type === "date" || f.type === "time" || f.type === "url" || f.type === "image" || f.type === "datetime") && v === "") v = null;
      if (f.type === "time" && typeof v === "string") v = v.slice(0, 5);
      if (f.type === "datetime" && typeof v === "string" && v) {
        const t = new Date(v); // a local "2026-11-20T09:00" from the picker, or a stored ISO time
        v = Number.isNaN(t.getTime()) ? null : t.toISOString();
      }
      payload[f.key] = v === undefined ? null : v;
    }
    Object.assign(payload, config.filter ?? {});
    if (config.fields.some((f) => f.key === "slug") && !payload.slug) {
      payload.slug = slugify(String(payload[config.titleKey] ?? ""));
    }
    if (typeof payload.slug === "string") payload.slug = slugify(payload.slug);
    const q = isNew
      ? supabase.from(config.table).insert(payload).select("id").single()
      : supabase.from(config.table).update(payload).eq("id", initial.id!).select("id").single();
    const { data, error } = await q;
    if (error || !data) {
      setSaving(false);
      onError(`Couldn't save: ${error?.message ?? "no row came back"}`);
      return;
    }
    // Only one homepage hero at a time.
    if (config.table === "releases" && payload.featured === true) {
      await supabase.from("releases").update({ featured: false }).neq("id", (data as { id: number }).id).eq("featured", true);
    }
    onSaved(isNew ? `Added “${String(payload[config.titleKey])}”` : `Saved “${String(payload[config.titleKey])}”`);
  };

  return (
    <form onSubmit={save} className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">
      <h2 className="text-xl font-semibold">{isNew ? `New ${config.singular}` : `Edit ${String(initial[config.titleKey] ?? "")}`}</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {config.fields.map((f) => (
          <div key={f.key} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
            <FieldInput
              field={f}
              value={values[f.key]}
              onChange={(v) => set(f.key, v)}
              table={config.table}
              artistNames={artistNames}
              onError={onError}
              nameHint={String(values[config.titleKey] ?? "")}
              supabase={supabase}
            />
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 -mx-5 mt-8 flex flex-wrap justify-end gap-3 border-t border-white/10 bg-zinc-950/95 px-5 py-4 sm:-mx-8 sm:px-8">
        <button type="button" onClick={onCancel} className="admin-btn">Cancel</button>
        <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
          {saving ? "Saving…" : isNew ? `Add ${config.singular}` : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export function FieldInput({
  field,
  value,
  onChange,
  table,
  artistNames,
  onError,
  nameHint,
  supabase,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  table: string;
  artistNames: string[];
  onError: (t: string) => void;
  nameHint: string;
  supabase: ReturnType<typeof useAdmin>["supabase"];
}) {
  const id = `f-${field.key}`;
  const helpId = field.help ? `${id}-help` : undefined;
  const str = value === null || value === undefined ? "" : String(value);
  const [uploading, setUploading] = useState(false);
  const options = useMemo(() => {
    if (field.type === "artist") return Array.from(new Set([...artistNames, ...(str ? [str] : [])]));
    if (field.type === "select") return Array.from(new Set([...(field.options ?? []), ...(str ? [str] : [])]));
    return [];
  }, [field, artistNames, str]);

  const label = (
    <label htmlFor={id} className="block text-[14px] font-medium">
      {field.label}
      {field.required && <span className="text-[#ff8a5c]"> *</span>}
    </label>
  );
  const help = field.help && (
    <p id={helpId} className="mt-1 text-[13px] text-white/60">{field.help}</p>
  );

  if (field.type === "bool") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-white/10 p-4">
        <input
          id={id}
          type="checkbox"
          checked={value === true}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={helpId}
          className="mt-1 h-5 w-5 accent-[#ff5a1f]"
        />
        <div>
          {label}
          {help}
        </div>
      </div>
    );
  }

  if (field.type === "image" || field.type === "video") {
    const isVideo = field.type === "video";
    const src = previewSrc(value);
    const upload = async (file: File) => {
      if (isVideo) {
        if (!file.type.startsWith("video/")) return onError("That file isn't a video.");
        if (file.size > 50 * 1024 * 1024) return onError("That video is over 50 MB. Export a smaller MP4 (720p is plenty).");
      } else {
        if (!file.type.startsWith("image/")) return onError("That file isn't an image.");
        if (file.size > 10 * 1024 * 1024) return onError("That image is over 10 MB. Try a smaller one.");
      }
      setUploading(true);
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${table}/${Date.now()}-${slugify(nameHint || file.name) || "image"}.${ext}`;
      const { error } = await supabase.storage
        .from(SITE_IMAGES_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false, cacheControl: "31536000" });
      setUploading(false);
      if (error) return onError(`Upload failed: ${error.message}`);
      const { data } = supabase.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    };
    return (
      <div>
        {label}
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <div className={`overflow-hidden rounded-xl bg-white/5 ${isVideo ? "h-28 w-48" : "h-28 w-28"}`}>
            {src && isVideo ? (
              <video src={src} muted playsInline preload="metadata" aria-label={`Current ${field.label.toLowerCase()}`} className="h-full w-full object-cover" />
            ) : src ? (
              <img src={src} alt={`Current ${field.label.toLowerCase()}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[12px] text-white/40">{isVideo ? "No video" : "No image"}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="admin-btn cursor-pointer text-center focus-within:outline focus-within:outline-2 focus-within:outline-white">
              {uploading ? "Uploading…" : `${src ? "Replace" : "Upload"} ${isVideo ? "video" : "image"}`}
              <input
                type="file"
                accept={isVideo ? "video/mp4,video/quicktime,video/webm" : "image/*"}
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                  e.target.value = "";
                }}
              />
            </label>
            {src && (
              <button type="button" onClick={() => onChange(null)} className="text-left text-[13px] text-white/60 underline hover:text-white">
                {field.placeholder ? "Use the original" : `Remove ${isVideo ? "video" : "image"}`}
              </button>
            )}
          </div>
        </div>
        <input
          id={id}
          type="text"
          value={str}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isVideo ? "or paste a video address" : "or paste an image address"}
          aria-describedby={helpId}
          className="admin-input mt-3"
        />
        {help}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        {label}
        <textarea
          id={id}
          rows={Math.min(10, Math.max(3, Math.ceil(str.length / 36) + 1))}
          value={str}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={helpId}
          className="admin-input mt-1"
        />
        {help}
      </div>
    );
  }

  if (field.type === "select" || field.type === "artist") {
    return (
      <div>
        {label}
        <select
          id={id}
          required={field.required}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={helpId}
          className="admin-input mt-1"
        >
          <option value="">Choose…</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        {help}
      </div>
    );
  }

  if (field.type === "datetime") {
    // Shown and picked in the phone's own time zone; stored as an exact moment.
    const local = (() => {
      if (!str) return "";
      const d = new Date(str);
      if (Number.isNaN(d.getTime())) return str;
      const p = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
    })();
    return (
      <div>
        {label}
        <div className="mt-1 flex gap-2">
          <input
            id={id}
            type="datetime-local"
            value={local}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={helpId}
            className="admin-input"
          />
          {str && (
            <button type="button" onClick={() => onChange("")} className="admin-btn shrink-0">
              Clear
            </button>
          )}
        </div>
        {help}
      </div>
    );
  }

  return (
    <div>
      {label}
      <input
        id={id}
        type={field.type === "url" ? "url" : field.type === "date" ? "date" : field.type === "time" ? "time" : field.type === "number" ? "number" : "text"}
        required={field.required}
        value={field.type === "date" ? str.slice(0, 10) : str}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? (field.type === "url" ? "https://" : undefined)}
        aria-describedby={helpId}
        className="admin-input mt-1"
      />
      {help}
    </div>
  );
}
