// Initialize Supabase Client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service Role Key (for server-side operations) - Keep this secure and server-only
const supabaseServiceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Assumes SUPABASE_SERVICE_ROLE_KEY is set in env

export const supabaseAdmin = createClient(supabaseServiceUrl, supabaseServiceRoleKey);
