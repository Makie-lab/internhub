import { createClient as supabaseCreateClient } from "@supabase/supabase-js";
import type { Database } from "./types/database";

/**
 * Create a Supabase client for browser/client-side usage.
 * Uses the public anon key - safe for client components.
 * Returns null if environment variables are not configured.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== "undefined") {
      console.warn(
        "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Client not initialized."
      );
    }
    return null;
  }

  return supabaseCreateClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Create a Supabase client for server-side usage (API routes, server components).
 * Uses the service role key - should NEVER be exposed to the client.
 * Returns null if environment variables are not configured.
 */
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(
      "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Server client not initialized."
    );
    return null;
  }

  return supabaseCreateClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
