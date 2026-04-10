import { createClient } from "@supabase/supabase-js";

const fallbackSupabaseUrl = "https://ejxrtxuvkafdpjdyxbmo.supabase.co";
const fallbackSupabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqeHJ0eHV2a2FmZHBqZHl4Ym1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjAxNjgsImV4cCI6MjA5MTAzNjE2OH0.9iu85sboAnE8cB8XKo9OptBKxW5E0I8FN1gSAAZgmBQ";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  fallbackSupabaseUrl;
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  fallbackSupabaseAnonKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
