import { cache } from "react";

import { getSupabaseClient } from "@/lib/content";
import { mergeSettings, SETTINGS_DEFAULTS, type SiteSettings } from "@/lib/settingsSchema";

/** The site's settings (admin overrides merged over the original text). Never throws. */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = getSupabaseClient();
  if (!supabase) return { ...SETTINGS_DEFAULTS } as SiteSettings;
  try {
    const { data, error } = await supabase.from("site_settings").select("data").eq("id", 1).maybeSingle();
    if (error) {
      console.warn(`[cms] site_settings: ${error.message} (using built-in text)`);
      return { ...SETTINGS_DEFAULTS } as SiteSettings;
    }
    return mergeSettings(data?.data);
  } catch (err) {
    console.warn("[cms] site_settings unreachable (using built-in text)", err);
    return { ...SETTINGS_DEFAULTS } as SiteSettings;
  }
});
