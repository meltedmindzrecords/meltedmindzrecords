"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useState } from "react";

import { SITE_IMAGES_BUCKET } from "@/lib/supabaseBrowser";

import { useAdmin } from "../AdminShell";
import { ConfirmDialog } from "../CmsManager";
import { slugify } from "../cms";
import { PageHead, Toast, type ToastMsg } from "../Toast";

type Item = { path: string; name: string; folder: string; size: number; at: string; type: string; url: string };

const folderNames: Record<string, string> = {
  artists: "Artists",
  releases: "Releases",
  news: "News",
  team: "Team",
  settings: "Settings",
  media: "Uploaded here",
  "": "Other",
};

function prettySize(n: number): string {
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(n / 1024))} KB`;
}

export default function MediaPage() {
  const { supabase, session, email } = useAdmin();
  const [items, setItems] = useState<Item[] | null>(null);
  const [used, setUsed] = useState<string>("");
  const [folder, setFolder] = useState("all");
  const [uploading, setUploading] = useState(0);
  const [deleting, setDeleting] = useState<Item | null>(null);
  const [copied, setCopied] = useState("");
  const [toast, setToast] = useState<ToastMsg>(null);
  const clearToast = useCallback(() => setToast(null), []);
  const bucket = supabase.storage.from(SITE_IMAGES_BUCKET);

  const load = useCallback(async () => {
    const out: Item[] = [];
    const walk = async (prefix: string, depth: number) => {
      const { data, error } = await bucket.list(prefix, { limit: 1000, sortBy: { column: "created_at", order: "desc" } });
      if (error) throw new Error(error.message);
      for (const o of data ?? []) {
        const path = prefix ? `${prefix}/${o.name}` : o.name;
        if (!o.id) {
          if (depth < 3) await walk(path, depth + 1);
          continue;
        }
        if (o.name === ".emptyFolderPlaceholder") continue;
        const meta = (o.metadata ?? {}) as { size?: number; mimetype?: string };
        out.push({
          path,
          name: o.name,
          folder: prefix.split("/")[0] ?? "",
          size: Number(meta.size ?? 0),
          at: o.created_at ?? "",
          type: meta.mimetype ?? "",
          url: bucket.getPublicUrl(path).data.publicUrl,
        });
      }
    };
    try {
      await walk("", 0);
      out.sort((a, b) => (b.at > a.at ? 1 : -1));
      setItems(out);
    } catch (e) {
      setToast({ kind: "error", text: `Couldn't load the library: ${(e as Error).message}` });
      setItems([]);
    }
    // Every address the site uses right now, to mark files "in use".
    const [a, r, n, t, s] = await Promise.all([
      supabase.from("artists").select("image_url"),
      supabase.from("releases").select("cover_url"),
      supabase.from("news").select("image_url"),
      supabase.from("team").select("image_url"),
      supabase.from("site_settings").select("data"),
    ]);
    setUsed(JSON.stringify([a.data, r.data, n.data, t.data, s.data]));
  }, [bucket, supabase]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inUse = (it: Item) => used.includes(it.path) || used.includes(encodeURI(it.path));
  const folders = useMemo(() => Array.from(new Set((items ?? []).map((i) => i.folder))), [items]);
  const shown = (items ?? []).filter((i) => folder === "all" || i.folder === folder);

  const log = (action: string, label: string) =>
    supabase.from("admin_activity").insert({ user_id: session.user.id, actor: email, action, area: "media", item_label: label });

  const upload = async (files: FileList) => {
    const list = Array.from(files);
    setUploading(list.length);
    let ok = 0;
    for (const file of list) {
      const isImg = file.type.startsWith("image/");
      const isVid = file.type.startsWith("video/");
      if (!isImg && !isVid) {
        setToast({ kind: "error", text: `${file.name} isn't an image or video.` });
        continue;
      }
      if (file.size > (isVid ? 50 : 10) * 1024 * 1024) {
        setToast({ kind: "error", text: `${file.name} is too big (max ${isVid ? "50" : "10"} MB).` });
        continue;
      }
      const dot = file.name.lastIndexOf(".");
      const ext = dot > 0 ? file.name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "jpg";
      const base = slugify(dot > 0 ? file.name.slice(0, dot) : file.name) || "file";
      const path = `media/${Date.now()}-${base}.${ext}`;
      const { error } = await bucket.upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
      if (error) setToast({ kind: "error", text: `Upload failed for ${file.name}: ${error.message}` });
      else {
        ok++;
        await log("upload", file.name);
      }
      setUploading((n) => n - 1);
    }
    setUploading(0);
    if (ok > 0) setToast({ kind: "ok", text: `Uploaded ${ok} file${ok === 1 ? "" : "s"}. Tap “Copy link” to use one anywhere on the site.` });
    await load();
  };

  const copy = async (it: Item) => {
    try {
      await navigator.clipboard.writeText(it.url);
      setCopied(it.path);
      setTimeout(() => setCopied(""), 2500);
    } catch {
      window.prompt("Copy this link:", it.url);
    }
  };

  const remove = async () => {
    if (!deleting) return;
    const it = deleting;
    const { data, error } = await bucket.remove([it.path]);
    setDeleting(null);
    if (error || !data || data.length === 0) {
      setToast({ kind: "error", text: `Couldn't delete ${it.name}${error ? `: ${error.message}` : "."}` });
    } else {
      await log("delete", it.name);
      setToast({ kind: "ok", text: `Deleted ${it.name}.` });
    }
    await load();
  };

  return (
    <section>
      <PageHead title="Media library" intro="Every photo and video uploaded to the website. Upload here, then copy a link to paste into any image box.">
        <label className="admin-btn admin-btn-primary cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-white">
          {uploading > 0 ? `Uploading ${uploading}…` : "+ Upload files"}
          <input
            type="file"
            accept="image/*,video/mp4,video/quicktime,video/webm"
            multiple
            className="sr-only"
            disabled={uploading > 0}
            onChange={(e) => {
              if (e.target.files?.length) upload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </PageHead>
      <Toast toast={toast} onDone={clearToast} />

      {items && items.length > 0 && (
        <div className="no-scrollbar -mx-1 mt-6 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by folder">
          {["all", ...folders].map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={folder === f}
              onClick={() => setFolder(f)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] ${folder === f ? "bg-white text-black" : "border border-white/15 text-white/80 hover:bg-white/10"}`}
            >
              {f === "all" ? `All (${items.length})` : `${folderNames[f] ?? f} (${items.filter((i) => i.folder === f).length})`}
            </button>
          ))}
        </div>
      )}

      {items === null ? (
        <p className="mt-10 text-white/70" role="status">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-white/20 p-10 text-center text-white/70">No files yet. Use “Upload files” to add some.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((it) => (
            <li key={it.path} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <a href={it.url} target="_blank" rel="noopener noreferrer" className="block aspect-square bg-black/40">
                {it.type.startsWith("video/") ? (
                  <video src={it.url} muted playsInline preload="metadata" aria-label={it.name} className="h-full w-full object-cover" />
                ) : (
                  <img src={it.url} alt={it.name} loading="lazy" className="h-full w-full object-cover" />
                )}
              </a>
              <div className="p-3">
                <p className="truncate text-[13px] font-medium" title={it.name}>{it.name.replace(/^\d{10,}-/, "")}</p>
                <p className="mt-0.5 text-[12px] text-white/55">
                  {prettySize(it.size)}
                  {it.at ? ` · ${new Date(it.at).toLocaleDateString([], { month: "short", day: "numeric" })}` : ""}
                  {inUse(it) ? " · In use" : ""}
                </p>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <button type="button" onClick={() => copy(it)} className="admin-btn admin-btn-sm admin-btn-block" aria-label={`Copy link to ${it.name}`}>
                    {copied === it.path ? "Copied ✓" : "Copy link"}
                  </button>
                  <button type="button" onClick={() => setDeleting(it)} className="admin-btn admin-btn-danger admin-btn-sm admin-btn-block" aria-label={`Delete ${it.name}`}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete ${deleting.name.replace(/^\d{10,}-/, "")}?`}
          body={
            inUse(deleting)
              ? "This file is used on the website right now. Deleting it will leave a blank spot there until you pick another one."
              : "This removes the file for good."
          }
          confirmLabel="Delete"
          onCancel={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </section>
  );
}
