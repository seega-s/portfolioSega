import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for admin operations (only to be used in Server Components or API Routes)
export const getServiceSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasValidServiceKey = serviceKey && serviceKey !== 'AQUI_PON_TU_SERVICE_ROLE_KEY_SECRETA';
  
  if (!hasValidServiceKey) {
    console.warn('Missing or invalid SUPABASE_SERVICE_ROLE_KEY in environment variables. Falling back to anon key.');
  }
  
  return createClient(supabaseUrl, hasValidServiceKey ? serviceKey : supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
