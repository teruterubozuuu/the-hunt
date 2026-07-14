import { createBrowserClient } from "@supabase/ssr";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = (storage?:Storage) =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
    {
      auth: {
        storage: storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined)
      }
    }
  );