"use client";

import type { Session, SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { getBrowserSupabase } from "@/lib/supabaseBrowser";

type AdminCtx = { supabase: SupabaseClient; session: Session; email: string };
const Ctx = createContext<AdminCtx | null>(null);

export function useAdmin(): AdminCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAdmin outside AdminShell");
  return v;
}

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/artists", label: "Artists" },
  { href: "/admin/releases", label: "Releases" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/team", label: "Team" },
];

type State = "loading" | "signed-out" | "checking" | "not-admin" | "admin" | "no-config" | "set-password";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [supabase] = useState(() => getBrowserSupabase());
  const [session, setSession] = useState<Session | null>(null);
  const [state, setState] = useState<State>(supabase ? "loading" : "no-config");
  const recoveryPending = useRef(false);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    async function check(s: Session | null) {
      if (cancelled) return;
      setSession(s);
      if (!s) {
        setState("signed-out");
        return;
      }
      setState("checking");
      const { data, error } = await supabase!.rpc("portal_is_admin");
      if (cancelled) return;
      setState(!error && data === true ? "admin" : "not-admin");
    }

    // Arriving from a "set your password" email: ask for the new password first.
    if (/type=recovery/.test(window.location.hash + window.location.search)) recoveryPending.current = true;
    supabase.auth.getSession().then(({ data }) => {
      if (recoveryPending.current && data.session) {
        setSession(data.session);
        setState("set-password");
      } else check(data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") recoveryPending.current = true;
      if (event === "USER_UPDATED") return;
      if (recoveryPending.current && s) {
        setSession(s);
        setState("set-password");
        return;
      }
      check(s);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase?.auth.signOut();
  };

  let body: React.ReactNode;
  if (state === "no-config") {
    body = <Notice title="Admin isn't configured">The site is missing its Supabase settings.</Notice>;
  } else if (state === "loading" || state === "checking") {
    body = <p className="py-24 text-center text-white/70" role="status">Loading…</p>;
  } else if (state === "set-password") {
    body = (
      <SetPassword
        supabase={supabase!}
        email={session?.user.email ?? ""}
        onDone={async () => {
          recoveryPending.current = false;
          window.history.replaceState(null, "", "/admin");
          const { data } = await supabase!.auth.getSession();
          setSession(data.session);
          setState("checking");
          const { data: ok } = await supabase!.rpc("portal_is_admin");
          setState(ok === true ? "admin" : "not-admin");
        }}
      />
    );
  } else if (state === "signed-out") {
    body = <SignIn supabase={supabase!} />;
  } else if (state === "not-admin") {
    body = (
      <Notice title="This account isn't a label admin">
        You're signed in as {session?.user.email}. Only label admins can edit the website.
        <div className="mt-6">
          <button type="button" onClick={signOut} className="admin-btn">Sign out</button>
        </div>
      </Notice>
    );
  } else {
    body = (
      <Ctx.Provider value={{ supabase: supabase!, session: session!, email: session?.user.email ?? "" }}>
        {children}
      </Ctx.Provider>
    );
  }

  return (
    <div className="admin min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <Link href="/admin" className="caps text-[15px] text-white">
            Melted Mindz <span className="text-[#ff5a1f]">Website admin</span>
          </Link>
          <div className="ml-auto flex items-center gap-3 text-[13px]">
            <Link href="/" target="_blank" className="text-white/70 underline-offset-4 hover:text-white hover:underline">
              View site ↗
            </Link>
            {state === "admin" && (
              <button type="button" onClick={() => setState("set-password")} className="text-white/70 hover:text-white">
                Change password
              </button>
            )}
            {state === "admin" && (
              <button type="button" onClick={signOut} className="text-white/70 hover:text-white">
                Sign out
              </button>
            )}
          </div>
          {state === "admin" && (
            <nav aria-label="Admin sections" className="no-scrollbar -mx-1 flex w-full gap-1 overflow-x-auto">
              {nav.map((n) => {
                const active = n.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-medium transition ${
                      active ? "bg-white text-black" : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{body}</div>
    </div>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="mt-3 text-[15px] leading-7 text-white/75">{children}</div>
    </div>
  );
}

function SignIn({ supabase }: { supabase: SupabaseClient }) {
  const [mode, setMode] = useState<"password" | "reset" | "link">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("busy");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) {
      setStatus("error");
      setMessage(
        /invalid/i.test(error.message)
          ? "That email and password don't match. First time here, or forgot it? Use “Set or reset my password” below."
          : error.message
      );
    } else {
      setStatus("idle");
    }
  };

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("busy");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/admin`,
    });
    if (error) {
      setStatus("error");
      setMessage(
        /rate|limit|seconds/i.test(error.message)
          ? "Too many emails were sent in the last hour. Wait a bit and try again."
          : error.message
      );
    } else {
      setStatus("sent");
    }
  };

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("busy");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error) {
      setStatus("error");
      setMessage(
        /rate|limit|seconds/i.test(error.message)
          ? "Too many emails were sent in the last hour. Wait a bit and try again."
          : "We couldn't send a link to that address. Use the email you use for the artist portal."
      );
    } else {
      setStatus("sent");
    }
  };

  const titles = {
    password: "Sign in to edit the website",
    reset: "Set or reset your password",
    link: "Email me a sign-in link",
  };
  const intros = {
    password: "Label admins only. Use the email you use for the artist portal.",
    reset: "We'll email you one link to choose a password. After that you just sign in with email and password.",
    link: "We'll email you a one-time link that signs you straight in.",
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
      <h1 className="text-2xl font-semibold">{titles[mode]}</h1>
      <p className="mt-2 text-[15px] leading-7 text-white/70">{intros[mode]}</p>
      {status === "sent" ? (
        <p className="mt-6 rounded-xl bg-emerald-500/10 p-4 text-[15px] text-emerald-200" role="status">
          {mode === "link"
            ? "Check your inbox (and spam) and open the link on this device."
            : "Check your inbox (and spam) for the email, open the link, and pick your password. You only do this once."}
        </p>
      ) : (
        <form onSubmit={mode === "password" ? signIn : mode === "reset" ? sendReset : sendLink} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-[14px] font-medium">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input mt-1"
            />
          </label>
          {mode === "password" && (
            <label className="block">
              <span className="text-[14px] font-medium">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input mt-1"
              />
            </label>
          )}
          {status === "error" && (
            <p className="text-[14px] text-red-300" role="alert">{message}</p>
          )}
          <button type="submit" disabled={status === "busy"} className="admin-btn admin-btn-primary w-full">
            {status === "busy"
              ? "One moment…"
              : mode === "password"
                ? "Sign in"
                : mode === "reset"
                  ? "Email me a link to set my password"
                  : "Email me a sign-in link"}
          </button>
        </form>
      )}
      <div className="mt-5 flex flex-col items-start gap-3 text-[14px]">
        {(["password", "reset", "link"] as const)
          .filter((m) => m !== mode)
          .map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setStatus("idle");
                setMessage("");
              }}
              className="text-white/75 underline underline-offset-4 hover:text-white"
            >
              {m === "password" ? "Sign in with my password" : m === "reset" ? "First time, or forgot it? Set or reset my password" : "Email me a sign-in link instead"}
            </button>
          ))}
      </div>
    </div>
  );
}

function SetPassword({ supabase, email, onDone }: { supabase: SupabaseClient; email: string; onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setStatus("error");
      setMessage("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setStatus("error");
      setMessage("The two passwords don't match.");
      return;
    }
    setStatus("busy");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      onDone();
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
      <h1 className="text-2xl font-semibold">Choose your password</h1>
      <p className="mt-2 text-[15px] leading-7 text-white/70">
        For {email}. Next time, sign in with your email and this password.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-[14px] font-medium">New password</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input mt-1"
          />
        </label>
        <label className="block">
          <span className="text-[14px] font-medium">Type it again</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="admin-input mt-1"
          />
        </label>
        {status === "error" && (
          <p className="text-[14px] text-red-300" role="alert">{message}</p>
        )}
        <button type="submit" disabled={status === "busy"} className="admin-btn admin-btn-primary w-full">
          {status === "busy" ? "Saving…" : "Save password"}
        </button>
      </form>
    </div>
  );
}
