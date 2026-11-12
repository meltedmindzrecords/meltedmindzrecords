"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

import { SETTINGS_DEFAULTS, type SettingKey } from "@/lib/settingsSchema";

export type StoredSettings = Partial<Record<SettingKey, string | boolean>>;

/** What's stored in the one site_settings row (only the changed values). */
export async function loadStored(supabase: SupabaseClient): Promise<StoredSettings> {
  const { data, error } = await supabase.from("site_settings").select("data").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  return ((data?.data as StoredSettings | undefined) ?? {}) as StoredSettings;
}

/**
 * Writes changes on top of the latest stored values. A value equal to the
 * original text (or `undefined`) is removed, so the site falls back to it.
 */
export async function saveSettings(
  supabase: SupabaseClient,
  patch: Partial<Record<SettingKey, string | boolean | null | undefined>>
): Promise<void> {
  const current = await loadStored(supabase);
  const next: StoredSettings = { ...current };
  for (const [k, raw] of Object.entries(patch) as [SettingKey, string | boolean | null | undefined][]) {
    const def = SETTINGS_DEFAULTS[k];
    const v = typeof raw === "string" ? raw.trim() : raw;
    if (v === undefined || v === null || v === def) delete next[k];
    else next[k] = v;
  }
  const { error } = await supabase.from("site_settings").upsert({ id: 1, data: next }, { onConflict: "id" });
  if (error) throw new Error(error.message);
}

/** The value the site is using right now for a key. */
export function effective(stored: StoredSettings, key: SettingKey): string | boolean {
  const v = stored[key];
  const def = SETTINGS_DEFAULTS[key];
  if (typeof def === "boolean") return typeof v === "boolean" ? v : def;
  return typeof v === "string" ? v : def;
}
