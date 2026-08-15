import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env?.VITE_SUPABASE_URL ||
  'https://vpvfasyjkwxlyqldjjcj.supabase.co';

const supabaseKey =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable__O2bZnv4hBka8HPWwa3hcw_zmE6J3eq';

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseKey);
};