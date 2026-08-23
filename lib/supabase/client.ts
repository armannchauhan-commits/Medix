/**
 * Placeholder Supabase client for Medix.
 *
 * Step 1 does not connect to Supabase yet — the app runs entirely in demo
 * mode (see lib/demo-data.ts). This file exists so a later step can drop in
 * `@supabase/supabase-js`, wire up `NEXT_PUBLIC_SUPABASE_URL` and
 * `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see .env.local.example), and have every
 * import site already pointing at one place.
 *
 * Planned shape for the next step:
 *
 *   import { createBrowserClient } from "@supabase/ssr";
 *
 *   export const supabase = createBrowserClient(
 *     process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 *   );
 */

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabase = null;
