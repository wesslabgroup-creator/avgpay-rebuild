// Initialize Supabase Client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Check if we have valid credentials (not placeholders)
const hasValidCredentials = (
  supabaseUrl && 
  !supabaseUrl.includes('placeholder') && 
  supabaseAnonKey && 
  !supabaseAnonKey.includes('placeholder')
);

// Create clients only if we have valid credentials, otherwise create dummy clients
export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder');

export const supabaseAdmin = hasValidCredentials
  ? createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder');
