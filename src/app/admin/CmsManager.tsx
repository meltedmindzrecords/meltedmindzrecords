"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SITE_IMAGES_BUCKET } from "@/lib/supabaseBrowser";

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

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from(config.table)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
    if (error) {
      setLoadError(error.message);
      setRows([]);
    } else {
      setLoadError("");
      setRows((data ?? []) as Row[]);
    }
  }, [supabase, config.table]);

  useEffect(() => {
    load();
  }, [load]);

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

  const startNew = () => {
    const maxOrder = Math.max(0, ...(rows ?? []).map((r) => Number(r.sort_order) || 0));
    const blank: Row = { visible: true, sort_order: maxOrder + 10 };
    for (const f of config.fields) if (f.type === "bool" && f.key !== "visible") blank[f.key] = false;
    setEditing(blank);
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
              {rows.map((r) => {
                const img = config.imageKey ? previewSrc(r[config.imageKey]) : null;
                const title = String(r[config.titleKey] ?? "(untitled)");
                return (
                  <li key={String(r.id)} className="flex items-center gap-4 p-3 sm:p-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/5 sm:h-16 sm:w-16">
                      {img ? (
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[11px] text-white/40">No image</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[16px] font-semibold">{title}</p>
                      <p className="truncate text-[13px] text-white/60">{config.subtitle(r)}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {r.visible === false && <Badge tone="muted">Hidden</Badge>}
                        {r.featured === true && <Badge tone="accent">Homepage hero</Badge>}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                      <button type="button" onClick={() => setEditing(r)} className="admin-btn" aria-label={`Edit ${title}`}>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(r)}
                        className="admin-btn admin-btn-danger"
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

function Badge({ tone, children }: { tone: "muted" | "accent"; children: React.ReactNode }) {
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

function ConfirmDialog({
  title,
  body,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
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
            {busy ? "Deleting…" : confirmLabel}
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
      if ((f.type === "date" || f.type === "url" || f.type === "image") && v === "") v = null;
      payload[f.key] = v === undefined ? null : v;
    }
    if (config.fields.some((f) => f.key === "slug") && !payload.slug) {
      payload.slug = slugify(String(payload[config.titleKey] ?? ""));
    }
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

function FieldInput({
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

  if (field.type === "image") {
    const src = previewSrc(value);
    const upload = async (file: File) => {
      if (!file.type.startsWith("image/")) return onError("That file isn't an image.");
      if (file.size > 10 * 1024 * 1024) return onError("That image is over 10 MB. Try a smaller one.");
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
          <div className="h-28 w-28 overflow-hidden rounded-xl bg-white/5">
            {src ? (
              <img src={src} alt={`Current ${field.label.toLowerCase()}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[12px] text-white/40">No image</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="admin-btn cursor-pointer text-center focus-within:outline focus-within:outline-2 focus-within:outline-white">
              {uploading ? "Uploading…" : src ? "Replace image" : "Upload image"}
              <input
                type="file"
                accept="image/*"
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
                Remove image
              </button>
            )}
          </div>
        </div>
        <input
          id={id}
          type="text"
          value={str}
          onChange={(e) => onChange(e.target.value)}
          placeholder="or paste an image address"
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
          rows={4}
          value={str}
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

  return (
    <div>
      {label}
      <input
        id={id}
        type={field.type === "url" ? "url" : field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
        required={field.required}
        value={field.type === "date" ? str.slice(0, 10) : str}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.type === "url" ? "https://" : undefined}
        aria-describedby={helpId}
        className="admin-input mt-1"
      />
      {help}
    </div>
  );
}
