'use client';

import { createBrowserClient } from '@supabase/ssr';

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export async function signOut() {
  const supabase = getSupabaseClient();
  await supabase.auth.signOut();
  // Redirect handled by router middleware
}

export async function getSession() {
  const supabase = getSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
