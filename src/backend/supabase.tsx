import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase: ReturnType<typeof createClient> | null = null;
if (!supabaseUrl) {
  console.warn('Warning: supabaseUrl is required but missing. Supabase client will not be initialized.');
} else if (!supabaseAnonKey) {
  console.warn('Warning: supabaseAnonKey is required but missing. Supabase client will not be initialized.');
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };