import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build if env vars are missing
    // This prevents build errors, but the app won't work without proper env vars
    if (typeof window === 'undefined') {
      // Server-side: return a client that will fail gracefully
      return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key');
    }
    throw new Error('Missing Supabase environment variables');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();
