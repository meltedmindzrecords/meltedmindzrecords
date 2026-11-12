"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAdmin } from "../AdminShell";
import { ConfirmDialog } from "../CmsManager";
import { PageHead, Toast, type ToastMsg } from "../Toast";

type Sub = { id: string; email: string; marketing_consent: boolean | null; created_at: string };

function csvCell(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export default function NewsletterPage() {
  const { supabase } = useAdmin();
  const [subs, setSubs] = useState<Sub[] | null>(null);
  const [query, setQuery] = useState("");
  const [removing, setRemoving] = useState<Sub | null>(null);
  const [toast, setToast] = useState<ToastMsg>(null);
  const clearToast = useCallback(() => setToast(null), []);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("id,email,marketing_consent,created_at")
      .order("created_at", { ascending: false });
    if (error) setToast({ kind: "error", text: `Couldn't load subscribers: ${error.message}` });
    setSubs((data ?? []) as Sub[]);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const shown = useMemo(
    () => (subs ?? []).filter((s) => s.email.toLowerCase().includes(query.trim().toLowerCase())),
    [subs, query]
  );
  const consented = (subs ?? []).filter((s) => s.marketing_consent).length;

  const exportCsv = () => {
    const lines = [
      "email,marketing_consent,signed_up",
      ...(subs ?? []).map((s) => [csvCell(s.email), s.marketing_consent ? "yes" : "no", s.created_at].join(",")),
    ];
    const blob = new Blob([lines.join("\n") + "\n"], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const remove = async () => {
    if (!removing) return;
    const { error, count } = await supabase.from("newsletter_subscribers").delete({ count: "exact" }).eq("id", removing.id);
    const email = removing.email;
    setRemoving(null);
    if (error || count === 0) setToast({ kind: "error", text: `Couldn't remove ${email}${error ? `: ${error.message}` : "."}` });
    else setToast({ kind: "ok", text: `Removed ${email}.` });
    await load();
  };

  return (
    <section>
      <PageHead title="Newsletter" intro="People who signed up with the “Stay up to date” box in the footer.">
        <button type="button" onClick={exportCsv} disabled={!subs || subs.length === 0} className="admin-btn admin-btn-primary">
          Export CSV
        </button>
      </PageHead>
      <Toast toast={toast} onDone={clearToast} />

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <dt className="text-[13px] text-white/60">Subscribers</dt>
          <dd className="mt-1 text-3xl font-semibold">{subs ? subs.length : "…"}</dd>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <dt className="text-[13px] text-white/60">OK’d marketing</dt>
          <dd className="mt-1 text-3xl font-semibold">{subs ? consented : "…"}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <label htmlFor="sub-search" className="sr-only">Search emails</label>
        <input id="sub-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search emails" className="admin-input sm:max-w-md" />
      </div>

      {subs === null ? (
        <p className="mt-8 text-white/70" role="status">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-white/20 p-10 text-center text-white/70">
          {subs.length === 0 ? "No one has signed up yet." : "No emails match that search."}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
          {shown.map((s) => (
            <li key={s.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium">{s.email}</p>
                <p className="text-[13px] text-white/55">
                  Joined {new Date(s.created_at).toLocaleDateString([], { dateStyle: "medium" })}
                  {s.marketing_consent ? " · OK’d marketing" : " · no marketing OK"}
                </p>
              </div>
              <button type="button" onClick={() => setRemoving(s)} className="admin-btn admin-btn-danger shrink-0" aria-label={`Remove ${s.email}`}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {removing && (
        <ConfirmDialog
          title={`Remove ${removing.email}?`}
          body="They’ll be taken off the newsletter list for good. They can sign up again from the website."
          confirmLabel="Remove"
          busyLabel="Removing…"
          onCancel={() => setRemoving(null)}
          onConfirm={remove}
        />
      )}
    </section>
  );
}
