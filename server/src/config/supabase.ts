import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV, hasSupabaseConfig } from './env.js';

let supabaseAdmin: SupabaseClient | null = null;
let supabaseAnon: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!hasSupabaseConfig) {
    return null;
  }

  if (!supabaseAdmin) {
    const key = ENV.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_ANON_KEY;
    supabaseAdmin = createClient(ENV.SUPABASE_URL, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseAdmin;
}

export function getSupabaseAnon(): SupabaseClient | null {
  if (!hasSupabaseConfig) {
    return null;
  }

  if (!supabaseAnon) {
    supabaseAnon = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
      },
    });
  }

  return supabaseAnon;
}
