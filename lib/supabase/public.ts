import { createClient } from "@supabase/supabase-js";

/**
 * Creates a public, unauthenticated Supabase client for reading published CMS data.
 * Does not use cookies or auth session management, avoiding dynamic prerendering
 * and Date.now() timer issues during static generation.
 */
export function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
